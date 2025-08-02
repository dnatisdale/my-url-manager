import React, { useRef } from 'react';

export const ExportImport = ({ urls, categories, onImportData }) => {
  const fileInputRef = useRef(null);

  // Export data to JSON file
  const handleExport = () => {
    const exportData = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      urls: urls,
      categories: categories,
      metadata: {
        totalUrls: urls.length,
        totalCategories: categories.length,
        urlsByCategory: categories.reduce((acc, cat) => {
          acc[cat] = urls.filter(url => url.category === cat).length;
          return acc;
        }, {})
      }
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `url-manager-backup-${new Date().toISOString().slice(0, 10)}.json`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    
    alert(`✅ Exported ${urls.length} URLs and ${categories.length} categories!`);
  };

  // Export as CSV
  const handleExportCSV = () => {
    const headers = ['Title', 'URL', 'Category', 'Date Added'];
    const csvData = urls.map(url => [
      `"${url.title.replace(/"/g, '""')}"`, // Escape quotes
      `"${url.url}"`,
      `"${url.category}"`,
      `"${url.added}"`
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const dataBlob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `url-manager-export-${new Date().toISOString().slice(0, 10)}.csv`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    
    alert(`✅ Exported ${urls.length} URLs as CSV!`);
  };

  // Handle file import
  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        
        // Validate the imported data
        if (!importedData.urls || !Array.isArray(importedData.urls)) {
          throw new Error('Invalid file format: missing URLs array');
        }

        if (!importedData.categories || !Array.isArray(importedData.categories)) {
          throw new Error('Invalid file format: missing categories array');
        }

        // Confirm import
        const confirmMessage = `Import ${importedData.urls.length} URLs and ${importedData.categories.length} categories?\n\nThis will replace your current data.`;
        
        if (window.confirm(confirmMessage)) {
          onImportData(importedData);
          alert(`✅ Successfully imported ${importedData.urls.length} URLs and ${importedData.categories.length} categories!`);
        }

      } catch (error) {
        console.error('Import error:', error);
        alert(`❌ Import failed: ${error.message}\n\nPlease check that you're importing a valid URL Manager backup file.`);
      }
    };

    reader.readAsText(file);
    // Reset file input
    event.target.value = '';
  };

  // Trigger file input
  const triggerImport = () => {
    fileInputRef.current?.click();
  };

  return (
    <div style={{ 
      background: 'white', 
      border: '1px solid #e5e7eb', 
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{ margin: '0 0 15px 0', color: '#111827' }}>
        💾 Backup & Restore
      </h3>
      
      <p style={{ 
        margin: '0 0 20px 0', 
        fontSize: '14px', 
        color: '#6b7280' 
      }}>
        Export your URLs and categories for backup, or import from a previous backup.
      </p>

      {/* Export Section */}
      <div style={{ marginBottom: '20px' }}>
        <h4 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#374151' }}>
          📤 Export Data
        </h4>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={handleExport}
            style={{
              background: '#10b981',
              color: 'white',
              border: 'none',
              padding: '10px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#059669'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#10b981'}
          >
            📄 Export JSON
          </button>
          
          <button
            onClick={handleExportCSV}
            style={{
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '10px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
          >
            📊 Export CSV
          </button>
        </div>
        
        <div style={{ 
          marginTop: '8px', 
          fontSize: '12px', 
          color: '#6b7280' 
        }}>
          JSON: Complete backup with all data • CSV: Spreadsheet-friendly format
        </div>
      </div>

      {/* Import Section */}
      <div>
        <h4 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#374151' }}>
          📥 Import Data
        </h4>
        
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          style={{ display: 'none' }}
        />
        
        <button
          onClick={triggerImport}
          style={{
            background: '#f59e0b',
            color: 'white',
            border: 'none',
            padding: '10px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#d97706'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#f59e0b'}
        >
          📂 Import Backup
        </button>
        
        <div style={{ 
          marginTop: '8px', 
          fontSize: '12px', 
          color: '#dc2626' 
        }}>
          ⚠️ Warning: Importing will replace all current data
        </div>
      </div>

      {/* Current Data Summary */}
      <div style={{ 
        marginTop: '20px',
        padding: '12px',
        background: '#f3f4f6',
        borderRadius: '8px',
        fontSize: '14px',
        color: '#374151'
      }}>
        <strong>Current Data:</strong> {urls.length} URLs across {categories.length} categories
      </div>
    </div>
  );
};