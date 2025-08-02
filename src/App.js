import React, { useState, useEffect } from 'react';

function App() {
  // PWA state
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  
  // URL Manager state
  const [urls, setUrls] = useState([]);
  const [newUrl, setNewUrl] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Load URLs from localStorage on startup
  useEffect(() => {
    const savedUrls = localStorage.getItem('url-manager-urls');
    if (savedUrls) {
      try {
        const parsedUrls = JSON.parse(savedUrls);
        setUrls(parsedUrls);
        console.log('Loaded URLs from storage:', parsedUrls.length);
      } catch (error) {
        console.error('Error loading URLs:', error);
      }
    }
  }, []);

  // Save URLs to localStorage whenever urls change
  useEffect(() => {
    localStorage.setItem('url-manager-urls', JSON.stringify(urls));
  }, [urls]);

  // PWA install functionality
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    const handleAppInstalled = () => {
      setShowInstallButton(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`Install prompt: ${outcome}`);
    setDeferredPrompt(null);
    setShowInstallButton(false);
  };

  // URL Management Functions
  const addUrl = () => {
    if (!newUrl.trim()) {
      alert('Please enter a URL');
      return;
    }

    // Auto-add https if no protocol
    let formattedUrl = newUrl.trim();
    if (!formattedUrl.match(/^https?:\/\//)) {
      formattedUrl = 'https://' + formattedUrl;
    }

    // Auto-generate title if empty
    let title = newTitle.trim();
    if (!title) {
      try {
        const urlObj = new URL(formattedUrl);
        title = urlObj.hostname.replace('www.', '');
      } catch (error) {
        title = formattedUrl;
      }
    }

    const newUrlObj = {
      id: Date.now().toString(),
      url: formattedUrl,
      title: title,
      dateAdded: new Date().toISOString(),
      dateModified: new Date().toISOString()
    };

    setUrls(prevUrls => [newUrlObj, ...prevUrls]);
    setNewUrl('');
    setNewTitle('');
    console.log('Added URL:', newUrlObj);
  };

  const deleteUrl = (id) => {
    if (window.confirm('Are you sure you want to delete this URL?')) {
      setUrls(prevUrls => prevUrls.filter(url => url.id !== id));
      console.log('Deleted URL:', id);
    }
  };

  const openUrl = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const copyUrl = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      alert('URL copied to clipboard!');
    } catch (error) {
      console.error('Copy failed:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('URL copied to clipboard!');
    }
  };

  // Filter URLs based on search
  const filteredUrls = urls.filter(url => 
    url.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    url.url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      maxWidth: '800px',
      margin: '0 auto',
      minHeight: '100vh',
      backgroundColor: '#f5f7fa'
    }}>
      
      {/* Header */}
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '20px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ margin: '0 0 10px 0', fontSize: '24px' }}>
          🇹🇭 Thai Good News URL Vault
        </h1>
        <p style={{ margin: '0', opacity: '0.9', fontSize: '14px' }}>
          {urls.length} URLs saved • PWA enabled • Works offline
        </p>
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
          justifyContent: 'space-between',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <div>
            <strong>📱 Install App</strong>
            <div style={{ fontSize: '14px', opacity: '0.9' }}>
              Add to home screen for quick access
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

      {/* Add URL Form */}
      <div style={{ 
        background: 'white',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        border: '1px solid #e1e8ed'
      }}>
        <h2 style={{ margin: '0 0 15px 0', color: '#333', fontSize: '18px' }}>
          ➕ Add New URL
        </h2>
        
        <div style={{ marginBottom: '15px' }}>
          <input
            type="text"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && addUrl()}
            placeholder="Enter URL (e.g., google.com or https://example.com)"
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e1e8ed',
              borderRadius: '8px',
              fontSize: '16px',
              boxSizing: 'border-box',
              outline: 'none',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#667eea'}
            onBlur={(e) => e.target.style.borderColor = '#e1e8ed'}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && addUrl()}
            placeholder="Title (optional - auto-generated if empty)"
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e1e8ed',
              borderRadius: '8px',
              fontSize: '16px',
              boxSizing: 'border-box',
              outline: 'none',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#667eea'}
            onBlur={(e) => e.target.style.borderColor = '#e1e8ed'}
          />
        </div>

        <button
          onClick={addUrl}
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            width: '100%',
            transition: 'transform 0.2s'
          }}
          onMouseDown={(e) => e.target.style.transform = 'scale(0.98)'}
          onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        >
          Add URL
        </button>
      </div>

      {/* Search */}
      {urls.length > 0 && (
        <div style={{ 
          background: 'white',
          padding: '15px',
          borderRadius: '12px',
          marginBottom: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          border: '1px solid #e1e8ed'
        }}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="🔍 Search your URLs..."
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e1e8ed',
              borderRadius: '8px',
              fontSize: '16px',
              boxSizing: 'border-box',
              outline: 'none'
            }}
            onFocus={(e) => e.target.style.borderColor = '#667eea'}
            onBlur={(e) => e.target.style.borderColor = '#e1e8ed'}
          />
        </div>
      )}

      {/* URL List */}
      <div style={{ 
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        border: '1px solid #e1e8ed',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '20px 20px 10px 20px', borderBottom: '1px solid #e1e8ed' }}>
          <h2 style={{ margin: '0', color: '#333', fontSize: '18px' }}>
            📋 Your URLs ({filteredUrls.length})
          </h2>
        </div>

        {filteredUrls.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '10px' }}>📝</div>
            <h3 style={{ color: '#666', margin: '0 0 10px 0' }}>
              {urls.length === 0 ? 'No URLs yet' : 'No matching URLs'}
            </h3>
            <p style={{ color: '#999', margin: '0' }}>
              {urls.length === 0 ? 'Add your first URL above!' : 'Try a different search term'}
            </p>
          </div>
        ) : (
          <div>
            {filteredUrls.map((url, index) => (
              <div 
                key={url.id} 
                style={{ 
                  padding: '15px 20px',
                  borderBottom: index < filteredUrls.length - 1 ? '1px solid #f0f0f0' : 'none',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '15px' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ 
                      margin: '0 0 8px 0', 
                      color: '#333',
                      fontSize: '16px',
                      fontWeight: '600'
                    }}>
                      {url.title}
                    </h3>
                    <a 
                      href={url.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ 
                        color: '#667eea', 
                        textDecoration: 'none',
                        fontSize: '14px',
                        wordBreak: 'break-all'
                      }}
                      onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                      onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                    >
                      {url.url}
                    </a>
                    <div style={{ 
                      fontSize: '12px', 
                      color: '#999', 
                      marginTop: '8px' 
                    }}>
                      Added: {new Date(url.dateAdded).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                    <button
                      onClick={() => openUrl(url.url)}
                      title="Open URL"
                      style={{
                        background: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      Open
                    </button>
                    <button
                      onClick={() => copyUrl(url.url)}
                      title="Copy URL"
                      style={{
                        background: '#2196F3',
                        color: 'white',
                        border: 'none',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      Copy
                    </button>
                    <button
                      onClick={() => deleteUrl(url.id)}
                      title="Delete URL"
                      style={{
                        background: '#f44336',
                        color: 'white',
                        border: 'none',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ 
        textAlign: 'center', 
        marginTop: '30px',
        color: '#666',
        fontSize: '14px'
      }}>
        <p>💾 Data saved locally • 🌐 Works offline • 📱 PWA enabled</p>
      </div>
    </div>
  );
}

export default App;