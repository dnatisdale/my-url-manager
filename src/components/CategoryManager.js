import React from 'react';

export const CategoryManager = ({ categories, urlCountsByCategory, onDeleteCategory }) => {
  
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

  // Only show custom categories (not the default ones)
  const customCategories = categories.filter(cat => 
    !['General', 'Work', 'Personal', 'Resources'].includes(cat)
  );

  // Don't render if no custom categories
  if (customCategories.length === 0) {
    return null;
  }

  return (
    <div style={{ 
      background: 'white', 
      border: '1px solid #e5e7eb', 
      borderRadius: '12px',
      padding: '20px',
      marginTop: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{ margin: '0 0 15px 0', color: '#111827' }}>
        🗂️ Manage Categories
      </h3>
      <p style={{ 
        margin: '0 0 15px 0', 
        fontSize: '14px', 
        color: '#6b7280' 
      }}>
        Custom categories you've created. Click ✕ to delete (URLs will move to General).
      </p>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {customCategories.map(cat => (
          <CategoryBadge
            key={cat}
            category={cat}
            count={urlCountsByCategory[cat] || 0}
            color={getCategoryColor(cat)}
            onDelete={() => onDeleteCategory(cat)}
          />
        ))}
      </div>
    </div>
  );
};

// Individual Category Badge Component
const CategoryBadge = ({ category, count, color, onDelete }) => {
  return (
    <div 
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 12px',
        borderRadius: '16px',
        backgroundColor: color,
        color: 'white',
        fontSize: '13px',
        fontWeight: '500'
      }}
    >
      <span>{category}</span>
      <span style={{ 
        opacity: '0.8', 
        fontSize: '11px' 
      }}>
        ({count})
      </span>
      <button
        onClick={onDelete}
        style={{
          background: 'rgba(255,255,255,0.3)',
          border: 'none',
          borderRadius: '50%',
          width: '18px',
          height: '18px',
          cursor: 'pointer',
          color: 'white',
          fontSize: '11px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background-color 0.2s'
        }}
        onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.5)'}
        onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.3)'}
        title={`Delete ${category} category`}
      >
        ✕
      </button>
    </div>
  );
};