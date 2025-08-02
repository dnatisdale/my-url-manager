import React, { useState, useEffect } from 'react';

function App() {
  const [urls, setUrls] = useState([]);
  const [categories, setCategories] = useState(['General', 'Work', 'Personal', 'Resources']); // NEW: Categories
  const [newUrl, setNewUrl] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('General'); // NEW: Category selection
  const [customCategory, setCustomCategory] = useState(''); // NEW: Custom category input
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('newest');
  const [categoryFilter, setCategoryFilter] = useState('all'); // NEW: Category filter

  // Load data from localStorage
  useEffect(() => {
    try {
      const savedUrls = localStorage.getItem('urls');
      const savedCategories = localStorage.getItem('categories');
      
      if (savedUrls) {
        setUrls(JSON.parse(savedUrls));
      }
      if (savedCategories) {
        setCategories(JSON.parse(savedCategories));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('urls', JSON.stringify(urls));
      localStorage.setItem('categories', JSON.stringify(categories));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }, [urls, categories]);

  const addUrl = () => {
    if (!newUrl.trim()) return;
    
    // Auto-HTTPS functionality
    let formattedUrl = newUrl.trim();
    if (!formattedUrl.match(/^https?:\/\//)) {
      formattedUrl = 'https://' + formattedUrl;
    }

    // Handle custom category
    let finalCategory = newCategory;
    if (customCategory.trim()) {
      finalCategory = customCategory.trim();
      // Add to categories list if it's new
      if (!categories.includes(finalCategory)) {
        setCategories(prev => [...prev, finalCategory].sort());
      }
      setCustomCategory('');
    }
    
    const url = {
      id: Date.now(),
      url: formattedUrl,
      title: newTitle.trim() || formattedUrl,
      category: finalCategory, // NEW: Save category
      added: new Date().toLocaleDateString(),
      timestamp: Date.now()
    };
    
    setUrls([url, ...urls]);
    setNewUrl('');
    setNewTitle('');
    setNewCategory('General');
  };

  const deleteUrl = (id) => {
    setUrls(urls.filter(url => url.id !== id));
  };

  // NEW: Delete category
  const deleteCategory = (categoryToDelete) => {
    if (window.confirm(`Delete category "${categoryToDelete}"? URLs in this category will be moved to "General".`)) {
      // Move URLs to General category
      setUrls(prev => prev.map(url => 
        url.category === categoryToDelete 
          ? { ...url, category: 'General' }
          : url
      ));
      // Remove category
      setCategories(prev => prev.filter(cat => cat !== categoryToDelete));
      // Reset filter if it was the deleted category
      if (categoryFilter === categoryToDelete) {
        setCategoryFilter('all');
      }
    }
  };

  const copyUrl = async (urlToCopy) => {
    try {
      await navigator.clipboard.writeText(urlToCopy);
      alert('URL copied to clipboard! 📋');
    } catch (error) {
      const textArea = document.createElement('textarea');
      textArea.value = urlToCopy;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('URL copied to clipboard! 📋');
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  // Filter URLs by search and category
  const filteredUrls = urls.filter(url => {
    const matchesSearch = url.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         url.url.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || url.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Sort filtered URLs
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
      case 'category': // NEW: Sort by category
        return a.category.localeCompare(b.category);
      default:
        return 0;
    }
  });

  // NEW: Get category color
  const getCategoryColor = (category) => {
    const colors = {
      'General': '#6B7280',
      'Work': '#3B82F6',
      'Personal': '#10B981',
      'Resources': '#F59E0B',
      'Social': '#8B5CF6',
      'News': '#EF4444',
      'Entertainment': '#EC4899',
      'Shopping': '#F97316'
    };
    // Generate color for custom categories
    if (!colors[category]) {
      const hash = category.split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
      }, 0);
      const hue = Math.abs(hash) % 360;
      return `hsl(${hue}, 60%, 50%)`;
    }
    return colors[category];
  };

  // NEW: Get URLs by category for stats
  const getUrlCountByCategory = () => {
    const counts = {};
    urls.forEach(url => {
      counts[url.category] = (counts[url.category] || 0) + 1;
    });
    return counts;
  };

  const urlCountsByCategory = getUrlCountByCategory();

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white', 
        padding: '24px', 
        borderRadius: '12px',
        marginBottom: '24px',
        textAlign: 'center'
      }}>
        <h1 style={{ margin: '0 0 8px 0', fontSize: '28px' }}>URL Manager Ultimate</h1>
        <p style={{ margin: '0', opacity: '0.9' }}>
          🗂️ {categories.length} Categories • 🔗 {urls.length} URLs • 🚀 All Features
        </p>
      </div>

      {/* Add URL */}
      <div style={{ 
        background: 'white', 
        border: '1px solid #e5e7eb', 
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ marginTop: 0, marginBottom: '20px' }}>➕ Add New URL</h2>
        
        {/* Title input */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>
            Title (optional)
          </label>
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Custom title for your URL"
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* URL input */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>
            URL *
          </label>
          <input
            type="text"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addUrl()}
            placeholder="Enter URL (https:// added automatically)"
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* NEW: Category Selection */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>
            Category
          </label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              style={{
                flex: 1,
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '16px'
              }}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <input
              type="text"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              placeholder="Or create new category"
              style={{
                flex: 1,
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '16px'
              }}
            />
          </div>
        </div>

        <button
          onClick={addUrl}
          style={{
            width: '100%',
            padding: '14px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Add URL
        </button>
        
        <div style={{ marginTop: '8px', fontSize: '12px', color: '#6b7280' }}>
          💡 Tip: Just type "google.com" - we'll add https:// automatically!
        </div>
      </div>

      {/* Search, Filter, and Sort Controls */}
      {urls.length > 0 && (
        <div style={{ 
          background: 'white', 
          border: '1px solid #e5e7eb', 
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          {/* Search Box */}
          <div style={{ position: 'relative', marginBottom: '15px' }}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="🔍 Search your URLs..."
              style={{
                width: '100%',
                padding: '12px 40px 12px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: '#9ca3af',
                  border: 'none',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  color: 'white'
                }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Controls Row */}
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center' }}>
            {/* NEW: Category Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Category:</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              >
                <option value="all">All Categories ({urls.length})</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat} ({urlCountsByCategory[cat] || 0})
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Options */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Sort:</span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="alphabetical">Title A-Z</option>
                <option value="url">URL A-Z</option>
                <option value="category">By Category</option>
              </select>
            </div>
          </div>

          {/* Results Counter */}
          <div style={{ marginTop: '15px', fontSize: '14px', color: '#6b7280' }}>
            {searchTerm || categoryFilter !== 'all' 
              ? `Showing ${sortedUrls.length} of ${urls.length} URLs`
              : `${urls.length} URLs total`
            }
          </div>
        </div>
      )}

      {/* URL List */}
      <div style={{ 
        background: 'white', 
        border: '1px solid #e5e7eb', 
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          padding: '20px', 
          borderBottom: '1px solid #f3f4f6',
          background: '#f9fafb'
        }}>
          <h2 style={{ margin: 0 }}>📋 Your URLs ({sortedUrls.length})</h2>
        </div>

        {sortedUrls.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
            <h3 style={{ color: '#6b7280', margin: '0 0 8px 0' }}>
              {urls.length === 0 ? 'No URLs yet' : 'No matching URLs'}
            </h3>
            <p style={{ color: '#9ca3af', margin: 0 }}>
              {urls.length === 0 ? 'Add your first URL above!' : 'Try adjusting your search or filters'}
            </p>
          </div>
        ) : (
          <div>
            {sortedUrls.map((url, index) => (
              <div 
                key={url.id}
                style={{ 
                  padding: '16px 20px',
                  borderBottom: index < sortedUrls.length - 1 ? '1px solid #f3f4f6' : 'none',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Title and Category */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                      <div style={{ fontWeight: '600', fontSize: '16px', color: '#111827' }}>
                        {url.title}
                      </div>
                      {/* NEW: Category Badge */}
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '500',
                        color: 'white',
                        backgroundColor: getCategoryColor(url.category)
                      }}>
                        {url.category}
                      </span>
                    </div>
                    
                    {/* URL */}
                    <a 
                      href={url.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ 
                        color: '#3b82f6', 
                        textDecoration: 'none',
                        fontSize: '14px',
                        wordBreak: 'break-all'
                      }}
                    >
                      {url.url}
                    </a>
                    
                    {/* Date */}
                    <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                      Added: {url.added}
                    </div>
                  </div>
                  
                  {/* Action buttons */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => copyUrl(url.url)}
                      style={{
                        background: '#f59e0b',
                        color: 'white',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}
                    >
                      📋 Copy
                    </button>
                    <button
                      onClick={() => deleteUrl(url.id)}
                      style={{
                        background: '#ef4444',
                        color: 'white',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* NEW: Category Management */}
      {categories.length > 4 && (
        <div style={{ 
          background: 'white', 
          border: '1px solid #e5e7eb', 
          borderRadius: '12px',
          padding: '20px',
          marginTop: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 15px 0' }}>🗂️ Manage Categories</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {categories.filter(cat => !['General', 'Work', 'Personal', 'Resources'].includes(cat)).map(cat => (
              <div 
                key={cat}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 8px',
                  borderRadius: '16px',
                  backgroundColor: getCategoryColor(cat),
                  color: 'white',
                  fontSize: '12px'
                }}
              >
                {cat} ({urlCountsByCategory[cat] || 0})
                <button
                  onClick={() => deleteCategory(cat)}
                  style={{
                    background: 'rgba(255,255,255,0.3)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '16px',
                    height: '16px',
                    cursor: 'pointer',
                    color: 'white',
                    fontSize: '10px'
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{ 
        textAlign: 'center', 
        marginTop: '32px',
        color: '#6b7280',
        fontSize: '14px'
      }}>
        ✅ Phase 1 Complete: Categories System • 💾 Data saved locally • 🔄 {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
}

export default App;