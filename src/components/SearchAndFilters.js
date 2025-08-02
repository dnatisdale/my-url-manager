import React from 'react';

export const SearchAndFilters = ({ 
  searchTerm, 
  setSearchTerm, 
  categoryFilter, 
  setCategoryFilter, 
  sortOption, 
  setSortOption, 
  categories, 
  urlCountsByCategory, 
  urls, 
  filteredUrls, 
  onClearSearch 
}) => {
  return (
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
            onClick={onClearSearch}
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
        {/* Category Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>
            Category:
          </span>
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
          <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>
            Sort:
          </span>
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
          ? `Showing ${filteredUrls.length} of ${urls.length} URLs`
          : `${urls.length} URLs total`
        }
      </div>
    </div>
  );
};