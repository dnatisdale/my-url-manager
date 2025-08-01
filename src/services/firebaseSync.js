// Firebase Cloud Sync Service
// This would connect to Firebase for real cloud sync across devices

class FirebaseSyncService {
  constructor() {
    this.isOnline = navigator.onLine;
    this.syncQueue = JSON.parse(localStorage.getItem('syncQueue') || '[]');
    this.lastSync = localStorage.getItem('lastSync') || null;
    
    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.processSyncQueue();
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  // Simulate cloud sync (replace with real Firebase implementation)
  async syncToCloud(userEmail, data) {
    if (!this.isOnline || !userEmail) {
      this.addToSyncQueue('upload', userEmail, data);
      return { success: false, message: 'Queued for sync when online' };
    }

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In real implementation, this would be:
      // await firebase.firestore().collection('users').doc(userEmail).set(data);
      
      const cloudData = {
        ...data,
        lastUpdated: new Date().toISOString(),
        syncedAt: new Date().toISOString()
      };
      
      // Store in localStorage with cloud metadata for now
      localStorage.setItem(`cloud_${userEmail}`, JSON.stringify(cloudData));
      localStorage.setItem('lastSync', new Date().toISOString());
      
      return { success: true, message: 'Synced to cloud successfully' };
    } catch (error) {
      console.error('Sync failed:', error);
      this.addToSyncQueue('upload', userEmail, data);
      return { success: false, message: 'Sync failed, queued for retry' };
    }
  }

  // Simulate cloud fetch (replace with real Firebase implementation)
  async fetchFromCloud(userEmail) {
    if (!this.isOnline || !userEmail) {
      return { success: false, message: 'No internet connection' };
    }

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // In real implementation, this would be:
      // const doc = await firebase.firestore().collection('users').doc(userEmail).get();
      
      const cloudData = localStorage.getItem(`cloud_${userEmail}`);
      if (cloudData) {
        const data = JSON.parse(cloudData);
        return { 
          success: true, 
          data: data,
          message: 'Data loaded from cloud' 
        };
      } else {
        return { 
          success: true, 
          data: null, 
          message: 'No cloud data found - first time login' 
        };
      }
    } catch (error) {
      console.error('Fetch failed:', error);
      return { success: false, message: 'Failed to load cloud data' };
    }
  }

  // Add operations to sync queue for when back online
  addToSyncQueue(operation, userEmail, data) {
    this.syncQueue.push({
      operation,
      userEmail,
      data,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('syncQueue', JSON.stringify(this.syncQueue));
  }

  // Process queued sync operations when back online
  async processSyncQueue() {
    if (!this.isOnline || this.syncQueue.length === 0) return;

    const queue = [...this.syncQueue];
    this.syncQueue = [];
    
    for (const item of queue) {
      if (item.operation === 'upload') {
        await this.syncToCloud(item.userEmail, item.data);
      }
    }
    
    localStorage.removeItem('syncQueue');
  }

  // Check if user has cloud data
  async hasCloudData(userEmail) {
    if (!userEmail) return false;
    
    try {
      const cloudData = localStorage.getItem(`cloud_${userEmail}`);
      return !!cloudData;
    } catch {
      return false;
    }
  }

  // Get sync status
  getSyncStatus() {
    return {
      isOnline: this.isOnline,
      lastSync: this.lastSync,
      queuedOperations: this.syncQueue.length
    };
  }
}

export const firebaseSync = new FirebaseSyncService();