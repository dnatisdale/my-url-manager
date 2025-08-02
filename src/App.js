import React, { useState, useEffect } from 'react';

function App() {
  const [urls, setUrls] = useState([]);
  const [newUrl, setNewUrl] = useState('');

  // Load URLs from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('urls');
      if (saved) {
        setUrls(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading URLs:', error);
    }
  }, []);

  // Save URLs to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('urls', JSON.stringify(urls));
    } catch (error) {
      console.error('Error saving URLs:', error);
    }
  }, [urls]);

  const addUrl = () => {
    if (!newUrl.trim()) return;
    
    const url = {
      id: Date.now(),
      url: newUrl.trim(),
      added: new Date().toLocaleDateString()
    };
    
    setUrls([url, ...urls]);
    setNewUrl('');
  };

  const deleteUrl = (id) => {
    setUrls(urls.filter(url => url.id !== id));
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ 
        background: '#4CAF50', 
        color: 'white', 
        padding: '20px', 
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h1 style={{ margin: 0 }}>URL Manager</h1>
        <p style={{ margin: '5px 0 0 0' }}>Working! {urls.length} URLs saved</p>
      </div>

      {/* Add URL */}
      <div style={{ 
        background: 'white', 
        border: '1px solid #ddd', 
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '20px'
      }}>
        <h2 style={{ marginTop: 0 }}>Add URL</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addUrl()}
            placeholder="Enter URL..."
            style={{
              flex: 1,
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px'
            }}
          />
          <button
            onClick={addUrl}
            style={{
              padding: '10px 20px',
              background: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Add
          </button>
        </div>
      </div>

      {/* URL List */}
      <div style={{ 
        background: 'white', 
        border: '1px solid #ddd', 
        borderRadius: '8px',
        padding: '20px'
      }}>
        <h2 style={{ marginTop: 0 }}>Your URLs ({urls.length})</h2>
        
        {urls.length === 0 ? (
          <p style={{ color: '#666', textAlign: 'center', padding: '20px' }}>
            No URLs yet. Add one above!
          </p>
        ) : (
          urls.map(url => (
            <div 
              key={url.id}
              style={{ 
                border: '1px solid #eee',
                borderRadius: '4px',
                padding: '10px',
                marginBottom: '10px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div style={{ flex: 1 }}>
                <a 
                  href={url.url.startsWith('http') ? url.url : `https://${url.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#2196F3', textDecoration: 'none' }}
                >
                  {url.url}
                </a>
                <div style={{ fontSize: '12px', color: '#666' }}>
                  Added: {url.added}
                </div>
              </div>
              <button
                onClick={() => deleteUrl(url.id)}
                style={{
                  background: '#f44336',
                  color: 'white',
                  border: 'none',
                  padding: '5px 10px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>

      {/* Debug Info */}
      <div style={{ 
        marginTop: '20px', 
        fontSize: '14px', 
        color: '#666',
        textAlign: 'center'
      }}>
        ✅ App working • 💾 Data saved locally • 🔄 {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
}

export default App;