import React from 'react';

export const URLList = ({ urls, allUrls, onDeleteUrl, onCopyUrl }) => {
  
  // Get category color
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

  return (
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
        <h2 style={{ margin: 0 }}>📋 Your URLs ({urls.length})</h2>
      </div>

      {urls.length === 0 ? (
        <div style={{ padding: '40px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
          <h3 style={{ color: '#6b7280', margin: '0 0 8px 0' }}>
            {allUrls.length === 0 ? 'No URLs yet' : 'No matching URLs'}
          </h3>
          <p style={{ color: '#9ca3af', margin: 0 }}>
            {allUrls.length === 0 
              ? 'Add your first URL above!' 
              : 'Try adjusting your search or filters'
            }
          </p>
        </div>
      ) : (
        <div>
          {urls.map((url, index) => (
            <URLItem 
              key={url.id}
              url={url}
              index={index}
              totalUrls={urls.length}
              getCategoryColor={getCategoryColor}
              onDeleteUrl={onDeleteUrl}
              onCopyUrl={onCopyUrl}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Individual URL Item Component
const URLItem = ({ url, index, totalUrls, getCategoryColor, onDeleteUrl, onCopyUrl }) => {
  return (
    <div 
      style={{ 
        padding: '16px 20px',
        borderBottom: index < totalUrls - 1 ? '1px solid #f3f4f6' : 'none',
        transition: 'background-color 0.2s'
      }}
      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
    >
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start', 
        gap: '16px' 
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Title and Category */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px', 
            marginBottom: '6px' 
          }}>
            <div style={{ 
              fontWeight: '600', 
              fontSize: '16px', 
              color: '#111827' 
            }}>
              {url.title}
            </div>
            {/* Category Badge */}
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
            onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
            onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
          >
            {url.url}
          </a>
          
          {/* Date */}
          <div style={{ 
            fontSize: '12px', 
            color: '#6b7280', 
            marginTop: '4px' 
          }}>
            Added: {url.added}
          </div>
        </div>
        
        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => onCopyUrl(url.url)}
            style={{
              background: '#f59e0b',
              color: 'white',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '500',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#d97706'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#f59e0b'}
            title="Copy URL to clipboard"
          >
            📋 Copy
          </button>
          <button
            onClick={() => onDeleteUrl(url.id)}
            style={{
              background: '#ef4444',
              color: 'white',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '500',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#dc2626'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#ef4444'}
            title="Delete URL"
          >
            🗑️ Delete
          </button>
        </div>
      </div>
    </div>
  );
};