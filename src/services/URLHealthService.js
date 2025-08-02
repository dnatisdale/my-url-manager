import React from 'react';

// URL Health Service
class URLHealthService {
  constructor() {
    this.healthCache = new Map();
    this.checkQueue = new Set();
    this.isChecking = false;
    this.subscribers = new Set();
    this.checkInterval = null;
  }

  // Subscribe to health updates
  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  // Notify all subscribers of health updates
  notifySubscribers(url, healthData) {
    this.subscribers.forEach(callback => {
      try {
        callback(url, healthData);
      } catch (error) {
        console.error('Error in health service subscriber:', error);
      }
    });
  }

  // Start periodic health checks
  startPeriodicChecks(intervalMinutes = 30) {
    this.stopPeriodicChecks();
    
    this.checkInterval = setInterval(() => {
      this.checkAllCachedURLs();
    }, intervalMinutes * 60 * 1000);
  }

  // Stop periodic health checks
  stopPeriodicChecks() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  // Get cached health data
  getHealthData(url) {
    return this.healthCache.get(url) || {
      isHealthy: null,
      lastChecked: null,
      responseTime: null,
      statusCode: null,
      error: null,
      checkCount: 0
    };
  }

  // Check single URL health
  async checkURL(url, options = {}) {
    const { 
      timeout = 10000, 
      retries = 1,
      updateCache = true 
    } = options;

    if (this.checkQueue.has(url)) {
      return this.getHealthData(url);
    }

    this.checkQueue.add(url);

    try {
      const healthData = await this.performHealthCheck(url, timeout, retries);
      
      if (updateCache) {
        this.healthCache.set(url, {
          ...healthData,
          lastChecked: new Date().toISOString(),
          checkCount: (this.getHealthData(url).checkCount || 0) + 1
        });

        this.notifySubscribers(url, this.healthCache.get(url));
      }

      return healthData;

    } catch (error) {
      const errorData = {
        isHealthy: false,
        responseTime: null,
        statusCode: null,
        error: error.message,
        lastChecked: new Date().toISOString(),
        checkCount: (this.getHealthData(url).checkCount || 0) + 1
      };

      if (updateCache) {
        this.healthCache.set(url, errorData);
        this.notifySubscribers(url, errorData);
      }

      return errorData;

    } finally {
      this.checkQueue.delete(url);
    }
  }

  // Perform the actual health check
  async performHealthCheck(url, timeout, retries) {
    let lastError;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const startTime = Date.now();
        const result = await this.fetchWithTimeout(url, timeout);
        const responseTime = Date.now() - startTime;

        return {
          isHealthy: result.ok,
          responseTime: responseTime,
          statusCode: result.status,
          error: result.ok ? null : `HTTP ${result.status}`,
          redirected: result.redirected,
          finalURL: result.url
        };

      } catch (error) {
        lastError = error;
        
        if (attempt < retries) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
        }
      }
    }

    try {
      return await this.alternativeHealthCheck(url, timeout);
    } catch (altError) {
      throw lastError || altError;
    }
  }

  // Fetch with timeout
  async fetchWithTimeout(url, timeout) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        method: 'HEAD',
        mode: 'no-cors',
        signal: controller.signal,
        cache: 'no-cache',
        redirect: 'follow'
      });

      clearTimeout(timeoutId);
      return {
        ok: true,
        status: 'unknown',
        redirected: false,
        url: url
      };

    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  // Alternative health check using image loading
  async alternativeHealthCheck(url, timeout) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const startTime = Date.now();
      
      const cleanup = () => {
        img.onload = null;
        img.onerror = null;
      };

      const timeoutId = setTimeout(() => {
        cleanup();
        reject(new Error('Health check timeout'));
      }, timeout);

      img.onload = () => {
        cleanup();
        clearTimeout(timeoutId);
        resolve({
          isHealthy: true,
          responseTime: Date.now() - startTime,
          statusCode: 'image-success',
          error: null
        });
      };

      img.onerror = () => {
        cleanup();
        clearTimeout(timeoutId);
        reject(new Error('URL not accessible'));
      };

      img.src = `${url}/favicon.ico?t=${Date.now()}`;
    });
  }

  // Check multiple URLs in batches
  async checkMultipleURLs(urls, options = {}) {
    const { 
      batchSize = 5, 
      delayBetweenBatches = 1000,
      ...checkOptions 
    } = options;

    const results = new Map();
    
    for (let i = 0; i < urls.length; i += batchSize) {
      const batch = urls.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async url => {
        try {
          const result = await this.checkURL(url, checkOptions);
          results.set(url, result);
          return { url, success: true, result };
        } catch (error) {
          const errorResult = {
            isHealthy: false,
            error: error.message,
            lastChecked: new Date().toISOString()
          };
          results.set(url, errorResult);
          return { url, success: false, error: error.message };
        }
      });

      await Promise.allSettled(batchPromises);

      if (i + batchSize < urls.length && delayBetweenBatches > 0) {
        await new Promise(resolve => setTimeout(resolve, delayBetweenBatches));
      }
    }

    return results;
  }

  // Check all URLs in cache
  async checkAllCachedURLs() {
    const urls = Array.from(this.healthCache.keys());
    if (urls.length === 0) return;

    console.log(`Checking health of ${urls.length} cached URLs...`);
    
    await this.checkMultipleURLs(urls, {
      batchSize: 3,
      delayBetweenBatches: 2000,
      timeout: 8000
    });
  }

  // Get health statistics
  getHealthStats() {
    const all = Array.from(this.healthCache.values());
    const healthy = all.filter(h => h.isHealthy === true).length;
    const unhealthy = all.filter(h => h.isHealthy === false).length;
    const unknown = all.filter(h => h.isHealthy === null).length;

    return {
      total: all.length,
      healthy,
      unhealthy,
      unknown,
      healthyPercentage: all.length > 0 ? Math.round((healthy / all.length) * 100) : 0
    };
  }

  // Clear health cache
  clearCache() {
    this.healthCache.clear();
    this.checkQueue.clear();
  }

  // Remove URL from cache
  removeFromCache(url) {
    this.healthCache.delete(url);
    this.checkQueue.delete(url);
  }

  // Export health data
  exportHealthData() {
    const data = {};
    this.healthCache.forEach((value, key) => {
      data[key] = value;
    });
    return {
      exportDate: new Date().toISOString(),
      healthData: data,
      stats: this.getHealthStats()
    };
  }

  // Import health data
  importHealthData(exportedData) {
    if (exportedData.healthData) {
      Object.entries(exportedData.healthData).forEach(([url, healthData]) => {
        this.healthCache.set(url, healthData);
      });
    }
  }
}

// Create and export singleton instance
export const urlHealthService = new URLHealthService();

// React hook for using the health service
export const useURLHealth = (urls = []) => {
  const [healthData, setHealthData] = React.useState(new Map());
  const [isChecking, setIsChecking] = React.useState(false);

  React.useEffect(() => {
    const initialData = new Map();
    urls.forEach(url => {
      initialData.set(url, urlHealthService.getHealthData(url));
    });
    setHealthData(initialData);

    const unsubscribe = urlHealthService.subscribe((url, health) => {
      setHealthData(prev => new Map(prev.set(url, health)));
    });

    return unsubscribe;
  }, [urls.join(',')]);

  const checkURL = async (url) => {
    setIsChecking(true);
    try {
      const result = await urlHealthService.checkURL(url);
      return result;
    } finally {
      setIsChecking(false);
    }
  };

  const checkAllURLs = async () => {
    if (urls.length === 0) return;
    
    setIsChecking(true);
    try {
      await urlHealthService.checkMultipleURLs(urls);
    } finally {
      setIsChecking(false);
    }
  };

  return {
    healthData,
    isChecking,
    checkURL,
    checkAllURLs,
    getHealthStats: () => urlHealthService.getHealthStats()
  };
};