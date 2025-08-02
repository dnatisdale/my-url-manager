// PWA Management Service
class PWAManager {
  constructor() {
    this.deferredPrompt = null;
    this.isInstalled = false;
    this.isOnline = navigator.onLine;
    this.subscribers = new Set();
    this.notificationPermission = 'default';
    
    this.initialize();
  }

  // Initialize PWA features
  initialize() {
    this.checkInstallStatus();
    this.setupEventListeners();
    this.checkNotificationPermission();
    this.registerServiceWorker();
  }

  // Subscribe to PWA events
  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  // Notify subscribers of PWA events
  notifySubscribers(event, data) {
    this.subscribers.forEach(callback => {
      try {
        callback(event, data);
      } catch (error) {
        console.error('PWA subscriber error:', error);
      }
    });
  }

  // Check if app is already installed
  checkInstallStatus() {
    // Check if running in standalone mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isFullscreen = window.matchMedia('(display-mode: fullscreen)').matches;
    const isMinimalUI = window.matchMedia('(display-mode: minimal-ui)').matches;
    
    this.isInstalled = isStandalone || isFullscreen || isMinimalUI || 
                      (window.navigator.standalone === true); // iOS
    
    this.notifySubscribers('installStatusChanged', this.isInstalled);
  }

  // Setup PWA event listeners
  setupEventListeners() {
    // Install prompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      console.log('PWA install prompt available');
      e.preventDefault();
      this.deferredPrompt = e;
      this.notifySubscribers('installPromptAvailable', true);
    });

    // App installed event
    window.addEventListener('appinstalled', () => {
      console.log('PWA installed successfully');
      this.isInstalled = true;
      this.deferredPrompt = null;
      this.notifySubscribers('appInstalled', true);
      this.notifySubscribers('installPromptAvailable', false);
      
      // Show success notification
      this.showNotification('App Installed! 🎉', {
        body: 'URL Manager is now available as a native app',
        icon: '/logo192.png'
      });
    });

    // Online/offline events
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.notifySubscribers('onlineStatusChanged', true);
      this.showNotification('Back Online! 🌐', {
        body: 'Internet connection restored',
        icon: '/logo192.png'
      });
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.notifySubscribers('onlineStatusChanged', false);
      this.showNotification('Offline Mode 📱', {
        body: 'App continues to work offline',
        icon: '/logo192.png'
      });
    });

    // Visibility change (app focus)
    document.addEventListener('visibilitychange', () => {
      const isVisible = !document.hidden;
      this.notifySubscribers('visibilityChanged', isVisible);
      
      if (isVisible && this.isInstalled) {
        // App came into focus, could show updates or sync data
        console.log('App focused - could trigger sync');
      }
    });
  }

  // Register service worker with enhanced features
  async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw-enhanced.js');
        console.log('Enhanced service worker registered:', registration);
        
        // Listen for service worker updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              this.notifySubscribers('updateAvailable', true);
            }
          });
        });

        return registration;
      } catch (error) {
        console.error('Service worker registration failed:', error);
      }
    }
  }

  // Show install prompt
  async showInstallPrompt() {
    if (!this.deferredPrompt) {
      throw new Error('Install prompt not available');
    }

    try {
      this.deferredPrompt.prompt();
      const { outcome } = await this.deferredPrompt.userChoice;
      
      console.log(`Install prompt result: ${outcome}`);
      this.notifySubscribers('installPromptResult', outcome);
      
      if (outcome === 'accepted') {
        this.deferredPrompt = null;
        this.notifySubscribers('installPromptAvailable', false);
      }
      
      return outcome;
    } catch (error) {
      console.error('Install prompt error:', error);
      throw error;
    }
  }

  // Check notification permission
  checkNotificationPermission() {
    if ('Notification' in window) {
      this.notificationPermission = Notification.permission;
      this.notifySubscribers('notificationPermissionChanged', this.notificationPermission);
    }
  }

  // Request notification permission
  async requestNotificationPermission() {
    if (!('Notification' in window)) {
      throw new Error('Notifications not supported');
    }

    try {
      const permission = await Notification.requestPermission();
      this.notificationPermission = permission;
      this.notifySubscribers('notificationPermissionChanged', permission);
      return permission;
    } catch (error) {
      console.error('Notification permission error:', error);
      throw error;
    }
  }

  // Show notification
  showNotification(title, options = {}) {
    if (this.notificationPermission !== 'granted' || !this.isInstalled) {
      return;
    }

    try {
      const notification = new Notification(title, {
        badge: '/logo192.png',
        icon: '/logo192.png',
        tag: 'url-manager',
        renotify: false,
        requireInteraction: false,
        ...options
      });

      // Auto close after 5 seconds
      setTimeout(() => notification.close(), 5000);

      return notification;
    } catch (error) {
      console.error('Notification error:', error);
    }
  }

  // Add app shortcuts (for supported browsers)
  async addAppShortcuts() {
    if ('getInstalledRelatedApps' in navigator && this.isInstalled) {
      try {
        // This is experimental and may not work in all browsers
        const shortcuts = [
          {
            name: 'Add URL',
            short_name: 'Add',
            description: 'Quickly add a new URL',
            url: '/?action=add',
            icons: [{ src: '/logo192.png', sizes: '192x192' }]
          },
          {
            name: 'Search URLs',
            short_name: 'Search',
            description: 'Search through your URLs',
            url: '/?action=search',
            icons: [{ src: '/logo192.png', sizes: '192x192' }]
          }
        ];

        console.log('App shortcuts configured:', shortcuts);
        return shortcuts;
      } catch (error) {
        console.error('App shortcuts error:', error);
      }
    }
  }

  // Handle app shortcuts
  handleAppShortcut() {
    const urlParams = new URLSearchParams(window.location.search);
    const action = urlParams.get('action');
    
    if (action) {
      this.notifySubscribers('shortcutActivated', action);
      
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }

  // Get PWA installation info
  getInstallInfo() {
    return {
      canInstall: !!this.deferredPrompt,
      isInstalled: this.isInstalled,
      isOnline: this.isOnline,
      notificationPermission: this.notificationPermission,
      supportsNotifications: 'Notification' in window,
      supportsServiceWorker: 'serviceWorker' in navigator,
      displayMode: this.getDisplayMode()
    };
  }

  // Get current display mode
  getDisplayMode() {
    if (window.matchMedia('(display-mode: standalone)').matches) return 'standalone';
    if (window.matchMedia('(display-mode: fullscreen)').matches) return 'fullscreen';
    if (window.matchMedia('(display-mode: minimal-ui)').matches) return 'minimal-ui';
    return 'browser';
  }

  // Share content using Web Share API
  async shareContent(shareData) {
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return true;
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Share error:', error);
        }
        return false;
      }
    }
    
    // Fallback to clipboard
    if (shareData.url && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareData.url);
        return true;
      } catch (error) {
        console.error('Clipboard error:', error);
        return false;
      }
    }
    
    return false;
  }

  // Get device info for analytics
  getDeviceInfo() {
    return {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      screenWidth: screen.width,
      screenHeight: screen.height,
      colorDepth: screen.colorDepth,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
  }
}

// Create and export singleton instance
export const pwaManager = new PWAManager();

// Export the class for testing
export { PWAManager };