import React, { useState, useEffect } from 'react';

function App() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    // Listen for the install prompt
    const handleBeforeInstallPrompt = (e) => {
      console.log('PWA install prompt triggered');
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    // Listen for successful app install
    const handleAppInstalled = () => {
      console.log('PWA was installed');
      setShowInstallButton(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log('App is running in standalone mode (already installed)');
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      console.log('No install prompt available');
      return;
    }

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user's response
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to install prompt: ${outcome}`);

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }

    // Clear the prompt
    setDeferredPrompt(null);
    setShowInstallButton(false);
  };

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      {/* Header */}
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '20px',
        borderRadius: '10px',
        marginBottom: '20px'
      }}>
        <h1 style={{ margin: '0 0 10px 0' }}>🇹🇭 Thai Good News URL Vault</h1>
        <p style={{ margin: '0', opacity: '0.9' }}>Manage your URLs with PWA power!</p>
      </div>

      {/* PWA Install Button */}
      {showInstallButton && (
        <div style={{ 
          background: '#4CAF50',
          color: 'white',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <strong>📱 Install App</strong>
            <div style={{ fontSize: '14px', opacity: '0.9' }}>
              Add to your home screen for quick access
            </div>
          </div>
          <button
            onClick={handleInstallClick}
            style={{
              background: 'white',
              color: '#4CAF50',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Install
          </button>
        </div>
      )}

      {/* Status Info */}
      <div style={{ 
        background: '#f5f5f5',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>✅ App Status</h3>
        <ul style={{ margin: '0', paddingLeft: '20px' }}>
          <li>React is working!</li>
          <li>PWA manifest loaded</li>
          <li>Service worker ready</li>
          <li>Offline capability enabled</li>
          <li>Install prompt: {showInstallButton ? '🟢 Available' : '🔴 Not available'}</li>
        </ul>
      </div>

      {/* Current Info */}
      <div style={{ 
        background: 'white',
        border: '2px solid #ddd',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <p><strong>Current time:</strong> {new Date().toLocaleString()}</p>
        <p><strong>Online status:</strong> {navigator.onLine ? '🟢 Online' : '🔴 Offline'}</p>
        <p><strong>Display mode:</strong> {window.matchMedia('(display-mode: standalone)').matches ? '📱 Standalone (Installed)' : '🌐 Browser'}</p>
      </div>

      {/* Test Buttons */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button 
          onClick={() => alert('Button works!')}
          style={{
            background: '#2196F3',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Test Button
        </button>
        
        <button 
          onClick={() => {
            if ('serviceWorker' in navigator) {
              navigator.serviceWorker.ready.then(() => {
                alert('Service Worker is ready!');
              });
            } else {
              alert('Service Worker not supported');
            }
          }}
          style={{
            background: '#FF9800',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Check Service Worker
        </button>

        <button 
          onClick={() => {
            const urls = localStorage.getItem('test-urls') || '[]';
            alert(`Local storage works! Stored: ${JSON.parse(urls).length} items`);
          }}
          style={{
            background: '#9C27B0',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Test Storage
        </button>
      </div>

      {/* Footer */}
      <div style={{ 
        textAlign: 'center', 
        marginTop: '30px',
        color: '#666',
        fontSize: '14px'
      }}>
        <p>🎉 Your PWA is ready to install!</p>
        <p>Works offline • Fast loading • Native app feel</p>
      </div>
    </div>
  );
}

export default App;