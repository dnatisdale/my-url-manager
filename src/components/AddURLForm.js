import React, { useState } from 'react';

export const AddURLForm = ({ categories, onAddUrl }) => {
  const [newUrl, setNewUrl] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('General');
  const [customCategory, setCustomCategory] = useState('');

  const handleSubmit = () => {
    if (!newUrl.trim()) return;
    
    onAddUrl({
      url: newUrl,
      title: newTitle,
      category: newCategory,
      customCategory: customCategory
    });
    
    // Reset form
    setNewUrl('');
    setNewTitle('');
    setNewCategory('General');
    setCustomCategory('');
  };

  return (
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
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
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

      {/* Category Selection */}
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
        onClick={handleSubmit}
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
  );
};