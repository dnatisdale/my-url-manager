import React, { useState, useEffect } from 'react';
import { Search, Download, Share2, Trash2, Settings, QrCode, ChevronDown, ChevronUp, Upload, X, LogIn, LogOut, User } from 'lucide-react';

// Simple Auth Modal Component (Mandatory)
const AuthModal = ({ onClose, onLogin, mandatory = false }) => {
  const [email, setEmail] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      onLogin(email.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            {mandatory ? '🔒 Sign In Required' : (isLogin ? 'Sign In' : 'Create Account')}
          </h3>
          {!mandatory && (
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          )}
        </div>

        {mandatory && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              Sign in is required to use this app and sync your URLs across devices.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Email (used as your account ID)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {!mandatory && (
          <div className="mt-4 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-500 hover:text-blue-600 text-sm"
            >
              {isLogin ? "Don't have an account? Create one" : "Already have an account? Sign in"}
            </button>
          </div>
        )}

        <div className="mt-4 text-xs text-gray-500">
          <p>📱 Your data will sync across all your devices</p>
          <p>🔒 Simple email-based account (no password needed for demo)</p>
        </div>
      </div>
    </div>
  );
};

// QR Code component using QR Server API
const QRCode = ({ value, size = 64 }) => {
  return (
    <img
      src={`https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(value)}`}
      alt={`QR Code for ${value}`}
      className="qr-code border"
      style={{ width: size, height: size }}
    />
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
    .filter(cat => !['Save for Later', 'No Cat', '5fish', 'GRN', 'Thailand'].includes(cat))
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
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  // PWA Install Event Listener
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    const handleAppInstalled = () => {
      setShowInstallButton(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Load data from localStorage on app start (user-specific)
  const loadData = (userEmail = null) => {
    try {
      const userKey = userEmail || user?.email || 'guest';
      const savedUrls = localStorage.getItem(`urlManagerUrls_${userKey}`);
      const savedCategories = localStorage.getItem(`urlManagerCategories_${userKey}`);
      const defaultCategories = ['No Cat', 'Save for Later', '5fish', 'GRN', 'Thailand'];
      
      let categories = defaultCategories;
      if (savedCategories) {
        const parsed = JSON.parse(savedCategories);
        // Merge saved categories with default ones, keeping defaults at start
        const customCategories = parsed.filter(cat => !defaultCategories.includes(cat));
        categories = [...defaultCategories, ...customCategories];
      }
      
      return {
        urls: savedUrls ? JSON.parse(savedUrls) : [],
        categories: categories
      };
    } catch (error) {
      return {
        urls: [],
        categories: ['No Cat', 'Save for Later', '5fish', 'GRN', 'Thailand']
      };
    }
  };

  // Load user from localStorage on app start and enforce mandatory signup
  useEffect(() => {
    const loadUserData = (userEmail = null) => {
      try {
        const userKey = userEmail || 'guest';
        const savedUrls = localStorage.getItem(`urlManagerUrls_${userKey}`);
        const savedCategories = localStorage.getItem(`urlManagerCategories_${userKey}`);
        const defaultCategories = ['No Cat', 'Save for Later', '5fish', 'GRN', 'Thailand'];
        
        let categories = defaultCategories;
        if (savedCategories) {
          const parsed = JSON.parse(savedCategories);
          const customCategories = parsed.filter(cat => !defaultCategories.includes(cat));
          categories = [...defaultCategories, ...customCategories];
        }
        
        return {
          urls: savedUrls ? JSON.parse(savedUrls) : [],
          categories: categories
        };
      } catch (error) {
        return {
          urls: [],
          categories: ['No Cat', 'Save for Later', '5fish', 'GRN', 'Thailand']
        };
      }
    };

    const savedUser = localStorage.getItem('urlManagerUser');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      const userData2 = loadUserData(userData.email);
      setUrls(userData2.urls);
      setCategories(userData2.categories);
    } else {
      // Mandatory signup - show auth modal if no user
      setShowAuthModal(true);
    }
  }, []);

  const initialData = loadData();
  const [urls, setUrls] = useState(initialData.urls);
  const [inputUrl, setInputUrl] = useState('https://');
  const [selectedUrls, setSelectedUrls] = useState([]);
  const [categories, setCategories] = useState(['No Cat', 'Save for Later', '5fish', 'GRN', 'Thailand']);
  const [selectedCategory, setSelectedCategory] = useState('No Cat');
  const [expandedCategories, setExpandedCategories] = useState({});
  const [showQRModal, setShowQRModal] = useState(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleQRs, setVisibleQRs] = useState({});
  const [allUrlsHidden, setAllUrlsHidden] = useState(false);

  // Save data to localStorage with user-specific keys
  const saveData = (newUrls, newCategories) => {
    try {
      const userKey = user?.email || 'guest';
      if (newUrls !== undefined) {
        localStorage.setItem(`urlManagerUrls_${userKey}`, JSON.stringify(newUrls));
      }
      if (newCategories !== undefined) {
        localStorage.setItem(`urlManagerCategories_${userKey}`, JSON.stringify(newCategories));
      }
    } catch (error) {
      console.error('Failed to save data:', error);
    }
  };

  // Authentication functions
  const handleLogin = (email) => {
    const userData = { email, signedInAt: new Date().toISOString() };
    setUser(userData);
    localStorage.setItem('urlManagerUser', JSON.stringify(userData));
    
    // Load user's data
    const userSpecificData = loadData(email);
    setUrls(userSpecificData.urls);
    setCategories(userSpecificData.categories);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('urlManagerUser');
    
    // Reset to guest data
    const guestData = loadData('guest');
    setUrls(guestData.urls);
    setCategories(guestData.categories);
    setSelectedUrls([]);
  };

  const normalizeUrl = (url) => {
    let trimmed = url.trim().replaceAll(' ', '');
    if (!trimmed || trimmed === 'https://') return '';
    
    // Remove any existing protocol
    trimmed = trimmed.replace(/^https?:\/\//, '');
    
    // Add https:// if there's actual content
    return trimmed ? `https://${trimmed}` : '';
  };

  const addUrl = () => {
    const normalized = normalizeUrl(inputUrl);
    if (normalized && !urls.find(u => u.url === normalized)) {
      const newUrl = {
        id: Date.now(),
        url: normalized,
        category: selectedCategory
      };
      const newUrls = [...urls, newUrl];
      setUrls(newUrls);
      saveData(newUrls, undefined);
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
    const permanentCategories = ['No Cat', 'Save for Later', '5fish', 'GRN', 'Thailand'];
    if (permanentCategories.includes(categoryName)) {
      alert(`Cannot delete "${categoryName}" - this is a permanent category.`);
      return;
    }
    
    if (window.confirm(`Delete category "${categoryName}"? URLs will be moved to "No Cat".`)) {
      setUrls(urls.map(url => 
        url.category === categoryName 
          ? { ...url, category: 'No Cat' }
          : url
      ));
      setCategories(categories.filter(cat => cat !== categoryName));
    }
  };

  const toggleAllUrls = () => {
    setAllUrlsHidden(!allUrlsHidden);
    if (!allUrlsHidden) {
      // Hide all categories
      setExpandedCategories({});
    } else {
      // Show all categories
      const allExpanded = {};
      categories.forEach(cat => allExpanded[cat] = true);
      setExpandedCategories(allExpanded);
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

  const installApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowInstallButton(false);
      }
      setDeferredPrompt(null);
    } else {
      // Fallback for browsers that don't support the install prompt
      if (navigator.userAgent.includes('iPhone') || navigator.userAgent.includes('iPad')) {
        alert('To install: Tap the Share button in Safari, then "Add to Home Screen"');
      } else if (navigator.userAgent.includes('Android')) {
        alert('To install: Tap the menu (⋮) in Chrome, then "Add to Home screen" or "Install app"');
      } else {
        alert('To install: Look for "Install app" or "Add to Home Screen" in your browser menu');
      }
    }
  };

  const toggleQR = (urlId) => {
    setVisibleQRs(prev => ({
      ...prev,
      [urlId]: !prev[urlId]
    }));
  };

  const urlsByCategory = getUrlsByCategory();

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6" style={{ fontFamily: 'ui-rounded, "SF Pro Rounded", system-ui, sans-serif' }}>
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 md:mb-8 gap-2 sm:gap-4">
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
            ข่าวดี Thai: Good News
          </h1>
          
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            {user ? (
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-2 bg-green-100 rounded-lg">
                  <User size={14} className="sm:w-4 sm:h-4 text-green-600" />
                  <span className="text-xs sm:text-sm font-medium text-green-700 max-w-20 sm:max-w-none truncate">
                    {user.email.split('@')[0]}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-2 sm:px-3 py-1 sm:py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-1"
                >
                  <LogOut size={14} className="sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline text-sm">Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="px-3 sm:px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-1 sm:gap-2"
              >
                <LogIn size={14} className="sm:w-4 sm:h-4" />
                <span className="text-sm">Sign In for Sync</span>
              </button>
            )}
            
            {showInstallButton && (
              <button
                onClick={installApp}
                className="px-2 sm:px-3 py-1 sm:py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-1"
              >
                <span className="text-xs sm:text-sm">App</span>
              </button>
            )}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 md:p-6 mb-4 sm:mb-6">
          {!user && (
            <div className="mb-4 p-3 sm:p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 font-medium text-sm sm:text-base">
                🔒 Please sign in to save your URLs and sync across devices
              </p>
            </div>
          )}
          
          {user && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs sm:text-sm text-blue-700">
                ☁️ <strong>Synced to Cloud:</strong> Your data automatically saves and syncs across all your devices
              </p>
            </div>
          )}
          
          <div className="flex flex-col gap-2 mb-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={inputUrl}
                onChange={e => setInputUrl(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter URL..."
                className="flex-1 px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!user}
              />
              <div className="flex gap-2">
                <select
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  className="flex-1 sm:flex-none px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={!user}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <button
                  onClick={() => setShowCategoryModal(true)}
                  disabled={!user}
                  className="px-2 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:bg-gray-300 transition-colors flex items-center gap-1"
                  title="Manage Categories"
                >
                  <Settings size={14} />
                </button>
              </div>
            </div>
            <button
              onClick={addUrl}
              disabled={!user}
              className="w-full sm:w-auto sm:self-start px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 transition-colors text-sm sm:text-base"
            >
              Add URL
            </button>
          </div>
          
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 mb-4">
            <button
              onClick={shareUrls}
              disabled={!user}
              className="px-2 sm:px-3 py-2 text-xs sm:text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 transition-colors flex items-center justify-center gap-1"
            >
              <Share2 size={12} className="sm:w-3.5 sm:h-3.5" />
              <span className="hidden xs:inline sm:hidden lg:inline">Share</span> ({selectedUrls.length})
            </button>
            <button
              onClick={exportUrls}
              disabled={!user}
              className="px-2 sm:px-3 py-2 text-xs sm:text-sm bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:bg-gray-300 transition-colors flex items-center justify-center gap-1"
            >
              <Download size={12} className="sm:w-3.5 sm:h-3.5" />
              <span className="hidden xs:inline sm:hidden lg:inline">Export</span> ({selectedUrls.length})
            </button>
            <button
              onClick={deleteUrls}
              disabled={!user}
              className="px-2 sm:px-3 py-2 text-xs sm:text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-300 transition-colors flex items-center justify-center gap-1"
            >
              <Trash2 size={12} className="sm:w-3.5 sm:h-3.5" />
              <span className="hidden xs:inline sm:hidden lg:inline">Delete</span> ({selectedUrls.length})
            </button>
            {selectedUrls.length > 0 && user && (
              <select
                onChange={e => e.target.value && moveUrls(e.target.value)}
                className="col-span-2 sm:col-span-1 px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg"
                defaultValue=""
              >
                <option value="">Move to...</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            )}
          </div>
          
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 mb-4">
            <button
              onClick={() => setShowImportModal(true)}
              disabled={!user}
              className="px-2 sm:px-3 py-2 text-xs sm:text-sm bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:bg-gray-300 transition-colors flex items-center justify-center gap-1"
            >
              <Upload size={12} className="sm:w-3.5 sm:h-3.5" />
              <span className="hidden sm:inline">Import</span>
            </button>
          </div>
          
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search URLs and categories..."
                className="w-full pl-10 pr-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          {urls.length === 0 && (
            <p className="text-gray-500 text-center py-6 sm:py-8 text-sm sm:text-base">
              No URLs added yet. Add some URLs to get started!
            </p>
          )}
        </div>
        
        {urls.length > 0 && user && (
          <div className="flex justify-center mb-3 sm:mb-4">
            <button
              onClick={toggleAllUrls}
              className="px-3 sm:px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2 text-sm sm:text-base"
            >
              {allUrlsHidden ? '👁️ Show All URLs' : '🙈 Hide All URLs'}
            </button>
          </div>
        )}
        
        <div className="space-y-3 sm:space-y-4">
          {categories.map(category => {
            const categoryUrls = urlsByCategory[category] || [];
            const isExpanded = expandedCategories[category] && !allUrlsHidden;
            
            if (categoryUrls.length === 0 && searchTerm) return null;
            
            return (
              <div key={category} className="bg-white rounded-lg shadow-md">
                <div
                  className="p-3 sm:p-4 cursor-pointer hover:bg-gray-50 flex justify-between items-center"
                  onClick={() => toggleCategory(category)}
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="font-medium text-sm sm:text-base">{category}</span>
                    <span className="text-xs sm:text-sm text-gray-500">({categoryUrls.length})</span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2">
                    {categoryUrls.length > 0 && user && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          selectAllInCategory(category);
                        }}
                        className="text-xs sm:text-sm px-2 sm:px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                      >
                        <span className="hidden sm:inline">Select All</span>
                        <span className="sm:hidden">All</span>
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCategory(category);
                      }}
                      className="p-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                    >
                      {isExpanded ? <ChevronUp size={16} className="sm:w-4 sm:h-4" /> : <ChevronDown size={16} className="sm:w-4 sm:h-4" />}
                    </button>
                  </div>
                </div>
                
                {isExpanded && (
                  <div className="border-t">
                    {categoryUrls.map(url => (
                      <div key={url.id} className="p-3 sm:p-4 border-b last:border-b-0 flex items-center gap-2 sm:gap-4">
                        <input
                          type="checkbox"
                          checked={selectedUrls.includes(url.id)}
                          onChange={() => toggleSelectUrl(url.id)}
                          className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 rounded focus:ring-blue-500 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <a
                            href={url.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 break-all text-sm sm:text-base"
                          >
                            <span className="text-gray-400">https://</span>
                            <span>{url.url.replace(/^https?:\/\//, '')}</span>
                          </a>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                          <button
                            onClick={() => toggleQR(url.id)}
                            className="p-1.5 sm:p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
                          >
                            <QrCode size={14} className="sm:w-4 sm:h-4" />
                          </button>
                          {visibleQRs[url.id] && (
                            <div
                              className="cursor-pointer"
                              onClick={() => setShowQRModal(url.url)}
                            >
                              <QRCode value={url.url} size={40} className="sm:w-12 sm:h-12" />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {categoryUrls.length === 0 && (
                      <div className="p-3 sm:p-4 text-gray-500 text-center text-sm sm:text-base">
                        No URLs in this category
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {showAuthModal && (
          <AuthModal
            onClose={() => setShowAuthModal(false)}
            onLogin={handleLogin}
            mandatory={!user}
          />
        )}
        
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