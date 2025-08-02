// URL Health Monitoring Service
class URLHealthService {
  constructor() {
    this.healthCache = new Map();
    this.checkQueue = new Set();
    this.subscribers = new Set();
    this.checkInterval = null;
  }

  // Subscribe to health updates
  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  // Notify subscribers of health changes
  notifySubscribers(url, healthData) {
    this.subscribers.forEach(callback => {
      try {
        callback(url, healthData);
      } catch (error) {
        console.error('Health service subscriber error:', error);
      }
    });
  }

  // Start periodic health checks
  startPeriodicChecks(intervalMinutes = 30) {
    this.stopPeriodicChecks();
    
    this.checkInterval = setInterval(() => {
      this.checkAllCachedURLs();
    }, intervalMinutes * 60 * 1000);
    
    console.log(`Health monitoring started: checking every ${intervalMinutes} minutes`);
  }

  // Stop periodic health checks
  stopPeriodicChecks() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
      console.log('Health monitoring stopped');
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
    const { timeout = 8000, updateCache = true } = options;

    // Avoid duplicate checks
    if (this.checkQueue.has(url)) {
      return this.getHealthData(url);
    }

    this.checkQueue.add(url);

    try {
      const startTime = Date.now();
      const healthData = await this.performHealthCheck(url, timeout);
      const responseTime = Date.now() - startTime;

      const result = {
        ...healthData,
        responseTime,
        lastChecked: new Date().toISOString(),
        checkCount: (this.getHealthData(url).checkCount || 0) + 1
      };

      if (updateCache) {
        this.healthCache.set(url, result);
        this.notifySubscribers(url, result);
      }

      return result;

    } catch (error) {
      const errorResult = {
        isHealthy: false,
        responseTime: Date.now() - Date.now(),
        statusCode: null,
        error: error.message,
        lastChecked: new Date().toISOString(),
        checkCount: (this.getHealthData(url).checkCount || 0) + 1
      };

      if (updateCache) {
        this.healthCache.set(url, errorResult);
        this.notifySubscribers(url, errorResult);
      }

      return errorResult;

    } finally {
      this.checkQueue.delete(url);
    }
  }

  // Perform the actual health check
  async performHealthCheck(url, timeout) {
    // Method 1: Try HEAD request with no-cors
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        method: 'HEAD',
        mode: 'no-cors',
        signal: controller.signal,
        cache: 'no-cache'
      });

      clearTimeout(timeoutId);

      // With no-cors, we can't read the actual status, but no error means it's reachable
      return {
        isHealthy: true,
        statusCode: 'reachable',
        error: null
      };

    } catch (fetchError) {
      // Method 2: Try loading as image (works for many sites)
      try {
        await this.checkViaImage(url, timeout);
        return {
          isHealthy: true,
          statusCode: 'image-accessible',
          error: null
        };
      } catch (imageError) {
        // Method 3: Try loading favicon
        try {
          await this.checkViaFavicon(url, timeout);
          return {
            isHealthy: true,
            statusCode: 'favicon-accessible',
            error: null
          };
        } catch (faviconError) {
          // All methods failed
          throw new Error(this.categorizeError(fetchError.message));
        }
      }
    }
  }

  // Check URL by trying to load it as an image
  checkViaImage(url, timeout) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const timer = setTimeout(() => {
        img.onload = null;
        img.onerror = null;
        reject(new Error('Image load timeout'));
      }, timeout);

      img.onload = () => {
        clearTimeout(timer);
        resolve();
      };

      img.onerror = () => {
        clearTimeout(timer);
        reject(new Error('Image load failed'));
      };

      img.src = url;
    });
  }

  // Check URL by trying to load its favicon
  checkViaFavicon(url, timeout) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const timer = setTimeout(() => {
        img.onload = null;
        img.onerror = null;
        reject(new Error('Favicon load timeout'));
      }, timeout);

      img.onload = () => {
        clearTimeout(timer);
        resolve();
      };

      img.onerror = () => {
        clearTimeout(timer);
        reject(new Error('Favicon load failed'));
      };

      try {
        const urlObj = new URL(url);
        img.src = `${urlObj.protocol}//${urlObj.hostname}/favicon.ico?t=${Date.now()}`;
      } catch (error) {
        clearTimeout(timer);
        reject(new Error('Invalid URL for favicon check'));
      }
    });
  }

  // Categorize error messages
  categorizeError(errorMessage) {
    if (errorMessage.includes('abort')) return 'Request timeout';
    if (errorMessage.includes('network')) return 'Network error';
    if (errorMessage.includes('cors')) return 'CORS blocked';
    if (errorMessage.includes('timeout')) return 'Connection timeout';
    return 'URL not accessible';
  }

  // Check multiple URLs in batches
  async checkMultipleURLs(urls, options = {}) {
    const { batchSize = 3, delayBetweenBatches = 1000 } = options;
    const results = new Map();

    for (let i = 0; i < urls.length; i += batchSize) {
      const batch = urls.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async url => {
        try {
          const result = await this.checkURL(url, options);
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

      // Delay between batches to be nice to servers
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

    console.log(`Performing health check on ${urls.length} URLs...`);
    
    try {
      await this.checkMultipleURLs(urls, {
        batchSize: 3,
        delayBetweenBatches: 2000,
        timeout: 6000
      });
      console.log('Health check completed');
    } catch (error) {
      console.error('Health check error:', error);
    }
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

// Export the class for testing
export { URLHealthService };