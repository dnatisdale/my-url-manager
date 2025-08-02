import React, { useState, useEffect } from 'react';

function App() {
  const [urls, setUrls] = useState([]);
  const [newUrl, setNewUrl] = useState('');
  const [newTitle, setNewTitle] = useState('');

  // Load URLs from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('url-manager-urls');
      if (saved) {
        const parsed = JSON.parse(saved);
        setUrls(parsed);
        console.log('Loaded', parsed.length, 'URLs from storage');
      }
    } catch (error) {
      console.error('Error loading URLs:', error);
    }
  }, []);

  // Save URLs to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('url-manager-urls', JSON.stringify(urls));
    } catch (error) {
      console.error('Error saving URLs:', error);
    }
  }, [urls]);

  const addUrl = () => {
    if (!newUrl.trim()) {
      alert('Please enter a URL');
      return;
    }
    
    // Auto-add https if missing
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
    
    const url = {
      id: Date.now().toString(),
      url: formattedUrl,
      title: title,
      dateAdded: new Date().toISOString()
    };
    
    setUrls([url, ...urls]);
    setNewUrl('');
    setNewTitle('');
    console.log('Added URL:', url);
  };

  const deleteUrl = (id) => {
    if (window.confirm('Are you sure you want to delete this URL?')) {
      setUrls(urls.filter(url => url.id !== id));
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

  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto', 
        padding: '20px'
      }}>
        
        {/* Header */}
        <div style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '30px',
          borderRadius: '16px',
          marginBottom: '24px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h1 style={{ 
            margin: '0 0 8px 0', 
            fontSize: '28px',
            fontWeight: '700'
          }}>
            🇹🇭 Thai Good News URL Vault
          </h1>
          <p style={{ 
            margin: '0', 
            opacity: '0.9',
            fontSize: '16px'
          }}>
            {urls.length} URLs saved • Working perfectly ✨
          </p>
        </div>

        {/* Add URL Form */}
        <div style={{ 
          background: 'white',
          padding: '24px',
          borderRadius: '16px',
          marginBottom: '24px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          border: '1px solid #e2e8f0'
        }}>
          <h2 style={{ 
            margin: '0 0 20px 0', 
            color: '#1a202c',
            fontSize: '20px',
            fontWeight: '600'
          }}>
            ➕ Add New URL
          </h2>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ 
              display: 'block',
              marginBottom: '6px',
              color: '#4a5568',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              URL *
            </label>
            <input
              type="text"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && addUrl()}
              placeholder="Enter URL (e.g., google.com or https://example.com)"
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e2e8f0',
                borderRadius: '10px',
                fontSize: '16px',
                boxSizing: 'border-box',
                outline: 'none',
                transition: 'border-color 0.2s, box-shadow 0.2s',
                backgroundColor: '#ffffff'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea';
                e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block',
              marginBottom: '6px',
              color: '#4a5568',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              Title (optional)
            </label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && addUrl()}
              placeholder="Custom title (auto-generated if empty)"
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e2e8f0',
                borderRadius: '10px',
                fontSize: '16px',
                boxSizing: 'border-box',
                outline: 'none',
                transition: 'border-color 0.2s, box-shadow 0.2s',
                backgroundColor: '#ffffff'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea';
                e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <button
            onClick={addUrl}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              padding: '14px 28px',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              width: '100%',
              transition: 'transform 0.2s, box-shadow 0.2s',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
            }}
            onMouseDown={(e) => e.target.style.transform = 'translateY(0)'}
          >
            Add URL
          </button>
        </div>

        {/* URL List */}
        <div style={{ 
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          border: '1px solid #e2e8f0',
          overflow: 'hidden'
        }}>
          <div style={{ 
            padding: '24px 24px 16px 24px', 
            borderBottom: '1px solid #f1f5f9',
            background: '#fafbfc'
          }}>
            <h2 style={{ 
              margin: '0', 
              color: '#1a202c',
              fontSize: '20px',
              fontWeight: '600'
            }}>
              📋 Your URLs ({urls.length})
            </h2>
          </div>

          {urls.length === 0 ? (
            <div style={{ padding: '60px 24px', textAlign: 'center' }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>📝</div>
              <h3 style={{ 
                color: '#4a5568', 
                margin: '0 0 8px 0',
                fontSize: '18px',
                fontWeight: '600'
              }}>
                No URLs yet
              </h3>
              <p style={{ 
                color: '#718096', 
                margin: '0',
                fontSize: '16px'
              }}>
                Add your first URL above to get started!
              </p>
            </div>
          ) : (
            <div>
              {urls.map((url, index) => (
                <div 
                  key={url.id} 
                  style={{ 
                    padding: '20px 24px',
                    borderBottom: index < urls.length - 1 ? '1px solid #f1f5f9' : 'none',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start', 
                    gap: '20px' 
                  }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{ 
                        margin: '0 0 8px 0', 
                        color: '#1a202c',
                        fontSize: '16px',
                        fontWeight: '600',
                        lineHeight: '1.4'
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
                          wordBreak: 'break-all',
                          lineHeight: '1.4'
                        }}
                        onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                        onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                      >
                        {url.url}
                      </a>
                      <div style={{ 
                        fontSize: '12px', 
                        color: '#718096', 
                        marginTop: '8px' 
                      }}>
                        Added: {new Date(url.dateAdded).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div style={{ 
                      display: 'flex', 
                      gap: '8px', 
                      flexShrink: 0,
                      flexWrap: 'wrap'
                    }}>
                      <button
                        onClick={() => openUrl(url.url)}
                        title="Open URL"
                        style={{
                          background: '#48bb78',
                          color: 'white',
                          border: 'none',
                          padding: '8px 14px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '500',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#38a169'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#48bb78'}
                      >
                        Open
                      </button>
                      <button
                        onClick={() => copyUrl(url.url)}
                        title="Copy URL"
                        style={{
                          background: '#4299e1',
                          color: 'white',
                          border: 'none',
                          padding: '8px 14px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '500',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#3182ce'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#4299e1'}
                      >
                        Copy
                      </button>
                      <button
                        onClick={() => deleteUrl(url.id)}
                        title="Delete URL"
                        style={{
                          background: '#f56565',
                          color: 'white',
                          border: 'none',
                          padding: '8px 14px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '500',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#e53e3e'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#f56565'}
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
          marginTop: '32px',
          color: '#718096',
          fontSize: '14px'
        }}>
          <p style={{ margin: '0' }}>
            💾 Data saved locally • ⚡ Fast & reliable • 🔄 Updated: {new Date().toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;