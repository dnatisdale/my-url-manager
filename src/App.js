import React, { useState, useEffect } from 'react';
import { Search, Plus, Download, Share2, Trash2, Settings, QrCode, ChevronDown, ChevronUp, Upload, Move, X, Check } from 'lucide-react';

// QR Code component
const QRCode = ({ value, size = 64 }) => {
  const createQRCodeSVG = (text, size) => {
    const gridSize = 21;
    const moduleSize = size / gridSize;
    
    const pattern = [];
    for (let i = 0; i < gridSize; i++) {
      pattern[i] = [];
      for (let j = 0; j < gridSize; j++) {
        const hash = (text.charCodeAt(i % text.length) + i + j) % 3;
        pattern[i][j] = hash < 2;
      }
    }
    
    const addFinderPattern = (startX, startY) => {
      for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 7; j++) {
          if (startX + i < gridSize && startY + j < gridSize) {
            pattern[startX + i][startY + j] = 
              (i === 0 || i === 6 || j === 0 || j === 6) || 
              (i >= 2 && i <= 4 && j >= 2 && j <= 4);
          }
        }
      }
    };
    
    addFinderPattern(0, 0);
    addFinderPattern(0, gridSize - 7);
    addFinderPattern(gridSize - 7, 0);
    
    return pattern;
  };
  
  const pattern = createQRCodeSVG(value, size);
  
  return (
    <svg width={size} height={size} className="qr-code border">
      <rect width={size} height={size} fill="white" />
      {pattern.map((row, i) =>
        row.map((cell, j) => (
          cell && (
            <rect
              key={`${i}-${j}`}
              x={j * (size / 21)}
              y={i * (size / 21)}
              width={size / 21}
              height={size / 21}
              fill="black"
            />
          )
        ))
      )}
    </svg>
  );
};

// QR Modal Component
const QRModal = ({ url, onClose }) => {
  const [qrSize, setQrSize] = useState('large');
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">QR Code</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        
        <div className="text-center mb-4">
          <QRCode value={url} size={qrSize === 'large' ? 200 : 100} />
        </div>
        
        <div className="flex justify-center gap-2 mb-4">
          <button
            onClick={() => setQrSize('small')}
            className={`px-3 py-1 rounded ${qrSize === 'small' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Small
          </button>
          <button
            onClick={() => setQrSize('large')}
            className={`px-3 py-1 rounded ${qrSize === 'large' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Large
          </button>
        </div>
        
        <p className="text-sm text-gray-600 break-all text-center">{url}</p>
      </div>
    </div>
  );
};

// Import Modal Component
const ImportModal = ({ onClose, onImport, categories }) => {
  const [selectedCategory, setSelectedCategory] = useState('No Cat');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [createNewCategory, setCreateNewCategory] = useState(false);
  const [importData, setImportData] = useState('');
  const [previewUrls, setPreviewUrls] = useState([]);
  const [showPreview, setShowPreview] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImportData(event.target.result);
      };
      reader.readAsText(file);
    }
  };

  const validateAndPreview = () => {
    const lines = importData.split('\n').filter(line => line.trim());
    const urls = lines.map(line => {
      const trimmed = line.trim().replace(/^https?:\/\//, '');
      return trimmed ? `https://${trimmed}` : '';
    }).filter(url => url);
    
    setPreviewUrls(urls);
    setShowPreview(true);
  };

  const handleImport = () => {
    const categoryToUse = createNewCategory ? newCategoryName : selectedCategory;
    onImport(previewUrls, categoryToUse, createNewCategory);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Import URLs</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Upload CSV File</label>
          <input
            type="file"
            accept=".csv,.txt"
            onChange={handleFileUpload}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Or paste URLs (one per line)</label>
          <textarea
            value={importData}
            onChange={(e) => setImportData(e.target.value)}
            placeholder="https://example.com&#10;https://another.com"
            className="w-full p-2 border rounded-lg h-32"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Category</label>
          <div className="flex gap-2">
            <button
              onClick={() => setCreateNewCategory(false)}
              className={`px-3 py-1 rounded ${!createNewCategory ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              Existing
            </button>
            <button
              onClick={() => setCreateNewCategory(true)}
              className={`px-3 py-1 rounded ${createNewCategory ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              New
            </button>
          </div>
          
          {createNewCategory ? (
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="New category name"
              className="w-full mt-2 p-2 border rounded-lg"
            />
          ) : (
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full mt-2 p-2 border rounded-lg"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          )}
        </div>

        <div className="flex gap-2 mb-4">
          <button
            onClick={validateAndPreview}
            disabled={!importData.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
          >
            Preview
          </button>
        </div>

        {showPreview && (
          <div className="mb-4">
            <h4 className="font-medium mb-2">Preview ({previewUrls.length} URLs)</h4>
            <div className="max-h-40 overflow-y-auto border rounded-lg p-2">
              {previewUrls.slice(0, 10).map((url, i) => (
                <div key={i} className="text-sm py-1">{url}</div>
              ))}
              {previewUrls.length > 10 && (
                <div className="text-sm text-gray-500">... and {previewUrls.length - 10} more</div>
              )}
            </div>
            
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleImport}
                disabled={!previewUrls.length || (createNewCategory && !newCategoryName.trim())}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300"
              >
                Import {previewUrls.length} URLs
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Category Management Modal
const CategoryManagementModal = ({ categories, onClose, onDeleteCategory, onAddCategory }) => {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredCategories = categories
    .filter(cat => cat !== 'Save for Later' && cat !== 'No Cat')
    .filter(cat => cat.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort();

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      onAddCategory(newCategoryName.trim());
      setNewCategoryName('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Manage Categories</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="New category name"
              className="flex-1 p-2 border rounded-lg"
              onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
            />
            <button
              onClick={handleAddCategory}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Add
            </button>
          </div>
        </div>

        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search categories..."
              className="w-full pl-10 p-2 border rounded-lg"
            />
          </div>
        </div>

        <div className="max-h-60 overflow-y-auto">
          {filteredCategories.map(category => (
            <div key={category} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
              <span>{category}</span>
              <button
                onClick={() => onDeleteCategory(category)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

function App() {
  const [urls, setUrls] = useState([]);
  const [inputUrl, setInputUrl] = useState('https://');
  const [selectedUrls, setSelectedUrls] = useState([]);
  const [categories, setCategories] = useState(['No Cat', 'Save for Later']);
  const [selectedCategory, setSelectedCategory] = useState('No Cat');
  const [expandedCategories, setExpandedCategories] = useState({});
  const [showQRModal, setShowQRModal] = useState(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleQRs, setVisibleQRs] = useState({});

  const normalizeUrl = (url) => {
    let trimmed = url.trim().replaceAll(' ', '');
    if (!trimmed || trimmed === 'https://') return '';
    
    // Remove any existing protocol
    trimmed = trimmed.replace(/^https?:\/\//, '');
    
    // Add https://
    return `https://${trimmed}`;
  };

  const addUrl = () => {
    const normalized = normalizeUrl(inputUrl);
    if (normalized && !urls.find(u => u.url === normalized)) {
      const newUrl = {
        id: Date.now(),
        url: normalized,
        category: selectedCategory
      };
      setUrls([...urls, newUrl]);
    }
    setInputUrl('https://');
  };

  const toggleSelectUrl = (urlId) => {
    setSelectedUrls(
      selectedUrls.includes(urlId)
        ? selectedUrls.filter(id => id !== urlId)
        : [...selectedUrls, urlId]
    );
  };

  const selectAllInCategory = (category) => {
    const categoryUrls = getFilteredUrls().filter(u => u.category === category);
    const categoryIds = categoryUrls.map(u => u.id);
    const allSelected = categoryIds.every(id => selectedUrls.includes(id));
    
    if (allSelected) {
      setSelectedUrls(selectedUrls.filter(id => !categoryIds.includes(id)));
    } else {
      setSelectedUrls([...new Set([...selectedUrls, ...categoryIds])]);
    }
  };

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const expandAll = () => {
    const allCategories = {};
    categories.forEach(cat => allCategories[cat] = true);
    setExpandedCategories(allCategories);
  };

  const collapseAll = () => {
    setExpandedCategories({});
  };

  const shareUrls = () => {
    if (selectedUrls.length === 0) return;
    const selectedUrlObjects = urls.filter(u => selectedUrls.includes(u.id));
    const urlList = selectedUrlObjects.map(u => u.url).join('\n');
    const mailtoLink = `mailto:?subject=Shared URLs&body=${encodeURIComponent(urlList)}`;
    window.location.href = mailtoLink;
  };

  const exportUrls = () => {
    if (selectedUrls.length === 0) return;
    
    const selectedUrlObjects = urls.filter(u => selectedUrls.includes(u.id));
    const format = prompt('Choose format:\n1. CSV\n2. TXT\n\nEnter 1 or 2:');
    
    if (format === '1') {
      const csvContent = 'Category,URL\n' + selectedUrlObjects.map(u => `${u.category},${u.url}`).join('\n');
      downloadFile(csvContent, 'urls.csv', 'text/csv');
    } else if (format === '2') {
      const groupedByCategory = selectedUrlObjects.reduce((acc, url) => {
        if (!acc[url.category]) acc[url.category] = [];
        acc[url.category].push(url.url);
        return acc;
      }, {});
      
      const txtContent = Object.entries(groupedByCategory)
        .map(([category, urls]) => `${category}:\n${urls.map(url => `  ${url}`).join('\n')}`)
        .join('\n\n');
      
      downloadFile(txtContent, 'urls.txt', 'text/plain');
    }
  };

  const downloadFile = (content, filename, type) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const deleteUrls = () => {
    if (selectedUrls.length === 0) return;
    if (window.confirm('Are you sure you want to delete the selected URLs?')) {
      setUrls(urls.filter(url => !selectedUrls.includes(url.id)));
      setSelectedUrls([]);
    }
  };

  const moveUrls = (newCategory) => {
    if (selectedUrls.length === 0) return;
    setUrls(urls.map(url => 
      selectedUrls.includes(url.id) 
        ? { ...url, category: newCategory }
        : url
    ));
    setSelectedUrls([]);
  };

  const handleImport = (importUrls, category, createNew) => {
    if (createNew && !categories.includes(category)) {
      setCategories([...categories, category]);
    }
    
    const newUrls = importUrls
      .filter(url => !urls.find(u => u.url === url))
      .map(url => ({
        id: Date.now() + Math.random(),
        url,
        category
      }));
    
    setUrls([...urls, ...newUrls]);
  };

  const addCategory = (categoryName) => {
    if (!categories.includes(categoryName)) {
      setCategories([...categories, categoryName]);
    }
  };

  const deleteCategory = (categoryName) => {
    if (categoryName === 'No Cat' || categoryName === 'Save for Later') return;
    if (window.confirm(`Delete category "${categoryName}"? URLs will be moved to "No Cat".`)) {
      setUrls(urls.map(url => 
        url.category === categoryName 
          ? { ...url, category: 'No Cat' }
          : url
      ));
      setCategories(categories.filter(cat => cat !== categoryName));
    }
  };

  const getFilteredUrls = () => {
    return urls.filter(url => 
      url.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      url.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const getUrlsByCategory = () => {
    const filteredUrls = getFilteredUrls();
    const grouped = {};
    
    categories.forEach(cat => {
      grouped[cat] = filteredUrls.filter(url => url.category === cat);
    });
    
    return grouped;
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addUrl();
    }
  };

  const installApp = () => {
    alert('To install: Use your browser\'s "Add to Home Screen" or "Install App" option in the menu.');
  };

  const toggleQR = (urlId) => {
    setVisibleQRs(prev => ({
      ...prev,
      [urlId]: !prev[urlId]
    }));
  };

  const urlsByCategory = getUrlsByCategory();

  return (
    <div className="min-h-screen bg-gray-50 p-6" style={{ fontFamily: 'ui-rounded, "SF Pro Rounded", system-ui, sans-serif' }}>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-center text-gray-800">
            ข่าวดี Thai: Good News
          </h1>
          <button
            onClick={installApp}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            Install App
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={inputUrl}
              onChange={e => setInputUrl(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter URL..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <button
              onClick={addUrl}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Add URL
            </button>
          </div>
          
          <div className="flex gap-2 mb-4">
            <button
              onClick={shareUrls}
              disabled={selectedUrls.length === 0}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <Share2 size={16} />
              Share ({selectedUrls.length})
            </button>
            <button
              onClick={exportUrls}
              disabled={selectedUrls.length === 0}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <Download size={16} />
              Export ({selectedUrls.length})
            </button>
            <button
              onClick={deleteUrls}
              disabled={selectedUrls.length === 0}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <Trash2 size={16} />
              Delete ({selectedUrls.length})
            </button>
            {selectedUrls.length > 0 && (
              <select
                onChange={e => e.target.value && moveUrls(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg"
                defaultValue=""
              >
                <option value="">Move to...</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            )}
          </div>
          
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setShowImportModal(true)}
              className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors flex items-center gap-2"
            >
              <Upload size={16} />
              Import URLs
            </button>
            <button
              onClick={() => setShowCategoryModal(true)}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
            >
              <Settings size={16} />
              Manage Categories
            </button>
            <button
              onClick={expandAll}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Expand All
            </button>
            <button
              onClick={collapseAll}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Collapse All
            </button>
          </div>
          
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search URLs and categories..."
                className="w-full pl-10 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          {urls.length === 0 && (
            <p className="text-gray-500 text-center py-8">
              No URLs added yet. Add some URLs to get started!
            </p>
          )}
        </div>
        
        <div className="space-y-4">
          {categories.map(category => {
            const categoryUrls = urlsByCategory[category] || [];
            const isExpanded = expandedCategories[category];
            
            if (categoryUrls.length === 0 && searchTerm) return null;
            
            return (
              <div key={category} className="bg-white rounded-lg shadow-md">
                <div
                  className="p-4 cursor-pointer hover:bg-gray-50 flex justify-between items-center"
                  onClick={() => toggleCategory(category)}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{category}</span>
                    <span className="text-sm text-gray-500">({categoryUrls.length})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {categoryUrls.length > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          selectAllInCategory(category);
                        }}
                        className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                      >
                        Select All
                      </button>
                    )}
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>
                
                {isExpanded && (
                  <div className="border-t">
                    {categoryUrls.map(url => (
                      <div key={url.id} className="p-4 border-b last:border-b-0 flex items-center gap-4">
                        <input
                          type="checkbox"
                          checked={selectedUrls.includes(url.id)}
                          onChange={() => toggleSelectUrl(url.id)}
                          className="w-5 h-5 text-blue-500 rounded focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <a
                            href={url.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 break-all"
                          >
                            {url.url}
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleQR(url.id)}
                            className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
                          >
                            <QrCode size={16} />
                          </button>
                          {visibleQRs[url.id] && (
                            <div
                              className="cursor-pointer"
                              onClick={() => setShowQRModal(url.url)}
                            >
                              <QRCode value={url.url} size={48} />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {categoryUrls.length === 0 && (
                      <div className="p-4 text-gray-500 text-center">
                        No URLs in this category
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {showQRModal && (
          <QRModal
            url={showQRModal}
            onClose={() => setShowQRModal(null)}
          />
        )}
        
        {showImportModal && (
          <ImportModal
            onClose={() => setShowImportModal(false)}
            onImport={handleImport}
            categories={categories}
          />
        )}
        
        {showCategoryModal && (
          <CategoryManagementModal
            categories={categories}
            onClose={() => setShowCategoryModal(false)}
            onDeleteCategory={deleteCategory}
            onAddCategory={addCategory}
          />
        )}
      </div>
    </div>
  );
}

export default App;