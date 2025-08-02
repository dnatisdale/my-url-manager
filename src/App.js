import React, { useState, useEffect } from 'react';

function App() {
  const [urls, setUrls] = useState([]);
  const [newUrl, setNewUrl] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('newest'); // NEW: Sort functionality

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
    
    // NEW: Auto-HTTPS functionality
    let formattedUrl = newUrl.trim();
    if (!formattedUrl.match(/^https?:\/\//)) {
      formattedUrl = 'https://' + formattedUrl;
    }
    
    const url = {
      id: Date.now(),
      url: formattedUrl, // Using formatted URL with auto-https
      title: newTitle.trim() || formattedUrl,
      added: new Date().toLocaleDateString(),
      timestamp: Date.now() // For sorting
    };
    
    setUrls([url, ...urls]);
    setNewUrl('');
    setNewTitle('');
  };

  const deleteUrl = (id) => {
    setUrls(urls.filter(url => url.id !== id));
  };

  // NEW: Copy URL functionality
  const copyUrl = async (urlToCopy) => {
    try {
      await navigator.clipboard.writeText(urlToCopy);
      alert('URL copied to clipboard! 📋');
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = urlToCopy;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('URL copied to clipboard! 📋');
    }
  };

  // NEW: Clear search functionality
  const clearSearch = () => {
    setSearchTerm('');
  };

  // Filter URLs based on search term
  const filteredUrls = urls.filter(url => 
    url.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    url.url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // NEW: Sort filtered URLs
  const sortedUrls = [...filteredUrls].sort((a, b) => {
    switch (sortOption) {
      case 'newest':
        return b.timestamp - a.timestamp;
      case 'oldest':
        return a.timestamp - b.timestamp;
      case 'alphabetical':
        return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
      case 'url':
        return a.url.toLowerCase().localeCompare(b.url.toLowerCase());
      default:
        return 0;
    }
  });

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
        <h1 style={{ margin: 0 }}>URL Manager Pro</h1>
        <p style={{ margin: '5px 0 0 0' }}>
          🚀 {urls.length} URLs saved • 🔍 Search • 📋 Copy • 📂 Sort • ⚡ Auto-HTTPS
        </p>
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
        
        {/* Title input field */}
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Title (optional)"
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addUrl()}
            placeholder="Enter URL (https:// added automatically)"
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
        
        {/* NEW: Auto-HTTPS info */}
        <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
          💡 Tip: Just type "google.com" - we'll add https:// automatically!
        </div>
      </div>

      {/* Search and Sort Controls */}
      {urls.length > 0 && (
        <div style={{ 
          background: 'white', 
          border: '1px solid #ddd', 
          borderRadius: '8px',
          padding: '15px',
          marginBottom: '20px'
        }}>
          {/* Search Box with Clear Button */}
          <div style={{ position: 'relative', marginBottom: '15px' }}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="🔍 Search your URLs..."
              style={{
                width: '100%',
                padding: '10px 40px 10px 10px', // Extra padding for clear button
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            />
            {/* NEW: Clear Search Button */}
            {searchTerm && (
              <button
                onClick={clearSearch}
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: '#ccc',
                  border: 'none',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* NEW: Sort Options */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '14px', color: '#666' }}>Sort by:</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              style={{
                padding: '5px 10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="alphabetical">Title A-Z</option>
              <option value="url">URL A-Z</option>
            </select>
          </div>

          {/* Search Results Counter */}
          {searchTerm && (
            <div style={{ marginTop: '8px', fontSize: '14px', color: '#666' }}>
              Showing {sortedUrls.length} of {urls.length} URLs
            </div>
          )}
        </div>
      )}

      {/* URL List */}
      <div style={{ 
        background: 'white', 
        border: '1px solid #ddd', 
        borderRadius: '8px',
        padding: '20px'
      }}>
        <h2 style={{ marginTop: 0 }}>Your URLs ({sortedUrls.length})</h2>
        
        {sortedUrls.length === 0 ? (
          <p style={{ color: '#666', textAlign: 'center', padding: '20px' }}>
            {urls.length === 0 
              ? 'No URLs yet. Add one above!' 
              : 'No URLs match your search. Try a different term.'
            }
          </p>
        ) : (
          sortedUrls.map(url => (
            <div 
              key={url.id}
              style={{ 
                border: '1px solid #eee',
                borderRadius: '4px',
                padding: '12px',
                marginBottom: '10px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div style={{ flex: 1 }}>
                {/* Show title */}
                <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                  {url.title}
                </div>
                <a 
                  href={url.url}
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
              
              {/* NEW: Action buttons including Copy */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => copyUrl(url.url)}
                  title="Copy URL to clipboard"
                  style={{
                    background: '#FF9800',
                    color: 'white',
                    border: 'none',
                    padding: '5px 10px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  📋 Copy
                </button>
                <button
                  onClick={() => deleteUrl(url.id)}
                  title="Delete URL"
                  style={{
                    background: '#f44336',
                    color: 'white',
                    border: 'none',
                    padding: '5px 10px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  🗑️ Delete
                </button>
              </div>
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
        ✅ All features working • 💾 Data saved locally • 🔄 {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
}

export default App;