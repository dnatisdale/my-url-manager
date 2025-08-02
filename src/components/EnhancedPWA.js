import React, { useState, useEffect } from 'react';

// Mock PWA Manager for demonstration
const mockPWAManager = {
  subscribe: (callback) => {
    // Simulate PWA events
    setTimeout(() => callback('installPromptAvailable', true), 1000);
    
    return () => {}; // unsubscribe function
  },
  
  getInstallInfo: () => ({
    canInstall: true,
    isInstalled: false,
    isOnline: true,
    notificationPermission: 'default',
    updateAvailable: false,
    displayMode: 'browser'
  }),
  
  handleAppShortcut: () => {},
  
  showInstallPrompt: async () => {
    // Simulate install process
    await new Promise(resolve => setTimeout(resolve, 1000));
    return 'accepted';
  },
  
  requestNotificationPermission: async () => {
    return await Notification.requestPermission();
  },
  
  shareContent: async (shareData) => {
    if (navigator.share) {
      await navigator.share(shareData);
      return true;
    }
    return false;
  }
};

// Mock theme context
const mockTheme = {
  getColors: () => ({
    primary: '#6366f1',
    gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    shadowLarge: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    background: '#ffffff',
    text: '#1f2937'
  })
};

export default function EnhancedPWA({ onShortcutAction }) {
  const colors = mockTheme.getColors();
  
  const [pwaState, setPwaState] = useState({
    canInstall: false,
    isInstalled: false,
    isOnline: true,
    notificationPermission: 'default',
    updateAvailable: false,
    displayMode: 'browser'
  });
  
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  // Subscribe to PWA events
  useEffect(() => {
    const unsubscribe = mockPWAManager.subscribe((event, data) => {
      switch (event) {
        case 'installPromptAvailable':
          setPwaState(prev => ({ ...prev, canInstall: data }));
          if (data && !pwaState.isInstalled) {
            setShowInstallPrompt(true);
          }
          break;
          
        case 'appInstalled':
          setPwaState(prev => ({ ...prev, isInstalled: true, canInstall: false }));
          setShowInstallPrompt(false);
          break;
          
        case 'onlineStatusChanged':
          setPwaState(prev => ({ ...prev, isOnline: data }));
          break;
          
        case 'notificationPermissionChanged':
          setPwaState(prev => ({ ...prev, notificationPermission: data }));
          break;
          
        case 'updateAvailable':
          setPwaState(prev => ({ ...prev, updateAvailable: data }));
          break;
          
        case 'shortcutActivated':
          onShortcutAction?.(data);
          break;
          
        default:
          console.log('PWA event:', event, data);
      }
    });

    // Initialize state
    const installInfo = mockPWAManager.getInstallInfo();
    setPwaState(installInfo);
    
    // Handle app shortcuts
    mockPWAManager.handleAppShortcut();

    return unsubscribe;
  }, [onShortcutAction]); // Removed pwaState dependency to prevent infinite loop

  // Install the app
  const handleInstall = async () => {
    try {
      setIsInstalling(true);
      const outcome = await mockPWAManager.showInstallPrompt();
      
      if (outcome === 'accepted') {
        setShowInstallPrompt(false);
        setPwaState(prev => ({ ...prev, isInstalled: true, canInstall: false }));
      }
    } catch (error) {
      console.error('Install failed:', error);
      alert('Installation failed. Please try again.');
    } finally {
      setIsInstalling(false);
    }
  };

  // Request notification permission
  const handleEnableNotifications = async () => {
    try {
      await mockPWAManager.requestNotificationPermission();
    } catch (error) {
      console.error('Notification permission failed:', error);
      alert('Notification permission denied. You can enable it later in browser settings.');
    }
  };

  // Dismiss install prompt
  const dismissInstallPrompt = () => {
    setShowInstallPrompt(false);
    // Note: localStorage not available in Claude artifacts
    // localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  // Check if install prompt was recently dismissed
  const wasRecentlyDismissed = () => {
    // Note: localStorage not available in Claude artifacts
    // const dismissed = localStorage.getItem('pwa-install-dismissed');
    // if (!dismissed) return false;
    
    // const dismissedTime = parseInt(dismissed);
    // const dayAgo = Date.now() - (24 * 60 * 60 * 1000);
    // return dismissedTime > dayAgo;
    return false;
  };

  // Share app
  const handleShare = async () => {
    const shareData = {
      title: 'URL Manager Ultimate',
      text: 'Check out this amazing URL management app!',
      url: window.location.origin
    };

    try {
      const shared = await mockPWAManager.shareContent(shareData);
      if (!shared) {
        // Fallback: copy URL to clipboard
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(shareData.url);
          alert('App URL copied to clipboard!');
        }
      }
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  // Update app
  const handleUpdate = () => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  };

  // Don't show if already installed or recently dismissed
  if (pwaState.isInstalled || (!pwaState.canInstall && !pwaState.updateAvailable) || 
      (showInstallPrompt && wasRecentlyDismissed())) {
    return null;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      {/* Online/Offline Status */}
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: pwaState.isOnline ? '#10b981' : '#ef4444',
        color: 'white',
        padding: '8px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '600',
        zIndex: 1000
      }}>
        {pwaState.isOnline ? '🟢 Online' : '🔴 Offline'}
      </div>

      {/* Update Available Banner */}
      {pwaState.updateAvailable && (
        <div style={{
          background: '#f59e0b',
          color: 'white',
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <strong>Update Available!</strong>
            <p style={{ margin: '4px 0 0 0', fontSize: '14px' }}>
              A new version is ready to install.
            </p>
          </div>
          <button
            onClick={handleUpdate}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Update Now
          </button>
        </div>
      )}

      {/* Install Prompt */}
      {showInstallPrompt && pwaState.canInstall && (
        <div style={{
          background: colors.gradient,
          color: 'white',
          padding: '24px',
          borderRadius: '16px',
          marginBottom: '24px',
          boxShadow: colors.shadowLarge,
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Background decoration */}
          <div style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '100px',
            height: '100px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            animation: 'float 6s ease-in-out infinite'
          }} />
          
          {/* Close button */}
          <button
            onClick={dismissInstallPrompt}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              color: 'white',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              cursor: 'pointer',
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ×
          </button>
          
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <div style={{ fontSize: '48px' }}>📱</div>
              <div>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '20px', fontWeight: '700' }}>
                  Install URL Manager
                </h3>
                <p style={{ margin: '0', opacity: '0.9', fontSize: '14px' }}>
                  Get the native app experience with offline access and notifications
                </p>
              </div>
            </div>

            {/* Features */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
              gap: '12px',
              marginBottom: '20px',
              fontSize: '13px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>⚡</span> Lightning fast
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>📱</span> Works offline
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>🔔</span> Notifications
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>🏠</span> Home screen
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={handleInstall}
                disabled={isInstalling}
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  color: colors.primary,
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: isInstalling ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  opacity: isInstalling ? 0.7 : 1
                }}
              >
                {isInstalling ? (
                  <>
                    <div style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid transparent',
                      borderTop: `2px solid ${colors.primary}`,
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                    Installing...
                  </>
                ) : (
                  <>
                    <span>📥</span>
                    Install App
                  </>
                )}
              </button>
              
              <button
                onClick={handleShare}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  padding: '12px 20px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span>🔗</span>
                Share
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Permission */}
      {pwaState.notificationPermission === 'default' && (
        <div style={{
          background: colors.background,
          border: '1px solid #e5e7eb',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <span style={{ fontSize: '24px' }}>🔔</span>
            <div>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '600', color: colors.text }}>
                Enable Notifications
              </h4>
              <p style={{ margin: '0', fontSize: '14px', color: '#6b7280' }}>
                Get notified about important updates and reminders
              </p>
            </div>
          </div>
          
          <button
            onClick={handleEnableNotifications}
            style={{
              background: colors.primary,
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Enable Notifications
          </button>
        </div>
      )}

      {/* PWA Features Demo */}
      <div style={{
        background: colors.background,
        border: '1px solid #e5e7eb',
        padding: '20px',
        borderRadius: '12px'
      }}>
        <h4 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600', color: colors.text }}>
          PWA Features
        </h4>
        
        <div style={{ display: 'grid', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Can Install:</span>
            <span style={{ color: pwaState.canInstall ? '#10b981' : '#ef4444' }}>
              {pwaState.canInstall ? '✅ Yes' : '❌ No'}
            </span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Is Installed:</span>
            <span style={{ color: pwaState.isInstalled ? '#10b981' : '#6b7280' }}>
              {pwaState.isInstalled ? '✅ Yes' : '⏳ No'}
            </span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Online Status:</span>
            <span style={{ color: pwaState.isOnline ? '#10b981' : '#ef4444' }}>
              {pwaState.isOnline ? '🟢 Online' : '🔴 Offline'}
            </span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Notifications:</span>
            <span style={{ 
              color: pwaState.notificationPermission === 'granted' ? '#10b981' : 
                     pwaState.notificationPermission === 'denied' ? '#ef4444' : '#6b7280' 
            }}>
              {pwaState.notificationPermission === 'granted' ? '✅ Enabled' :
               pwaState.notificationPermission === 'denied' ? '❌ Denied' : '⏳ Default'}
            </span>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}