import { useState, useEffect, useCallback } from 'react';
import { dataUtils } from '../utils/dataUtils';

// Performance Monitor Hook
export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState({
    memoryUsage: 0,
    renderTime: 0,
    searchTime: 0,
    dataSize: 0,
    compressionRatio: 0
  });

  const updateDataMetrics = useCallback((urls) => {
    const dataSize = dataUtils.getDataSize(urls);
    const compressed = dataUtils.compress(urls);
    setMetrics(prev => ({
      ...prev,
      dataSize,
      compressionRatio: compressed.ratio
    }));
  }, []);

  const updateMemoryUsage = useCallback(() => {
    if ('memory' in performance) {
      setMetrics(prev => ({ 
        ...prev, 
        memoryUsage: performance.memory.usedJSHeapSize 
      }));
    }
  }, []);

  return {
    metrics,
    updateDataMetrics,
    updateMemoryUsage
  };
};

// Offline Status Hook
export const useOfflineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastSync, setLastSync] = useState(new Date());

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setLastSync(new Date());
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline, lastSync };
};