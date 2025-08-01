export const dataUtils = {
  compress: (data) => {
    try {
      const jsonString = JSON.stringify(data);
      const compressed = btoa(jsonString);
      return {
        data: compressed,
        originalSize: jsonString.length,
        compressedSize: compressed.length,
        ratio: (compressed.length / jsonString.length * 100).toFixed(1)
      };
    } catch (error) {
      return { data, originalSize: 0, compressedSize: 0, ratio: '100.0' };
    }
  },

  decompress: (compressedData) => {
    try {
      const decompressed = atob(compressedData);
      return JSON.parse(decompressed);
    } catch (error) {
      return null;
    }
  },

  getDataSize: (data) => {
    return new Blob([JSON.stringify(data)]).size;
  },

  formatBytes: (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  createBackup: (urls, categories, metadata = {}) => {
    const backup = {
      version: '5.0',
      timestamp: new Date().toISOString(),
      urls,
      categories,
      metadata: {
        totalUrls: urls.length,
        totalCategories: categories.length,
        ...metadata
      }
    };
    
    return dataUtils.compress(backup);
  }
};