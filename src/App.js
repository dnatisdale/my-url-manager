import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Search, Download, Share2, Trash2, QrCode, ChevronDown, X, LogIn, LogOut, Eye, EyeOff, Plus, Sparkles, Globe, Moon, Sun, Filter, RefreshCw, AlertTriangle, CheckCircle, XCircle, Clock, Edit3, Copy, ExternalLink, Zap, Database, HardDrive, Wifi, WifiOff, Activity, BarChart3, TrendingUp, Archive, Save, CloudDownload, CloudUpload, Gauge, MemoryStick, FolderPlus, Tag, Check } from 'lucide-react';

// Import our modularized components and utilities
import { translations } from './constants/translations';
import { themes } from './constants/themes';
import { dataUtils } from './utils/dataUtils';
import { usePerformanceMonitor, useOfflineStatus } from './hooks/useCustomHooks';
import { LoadingSpinner, TouchButton, Toast } from './components/UI';
import { ActionBar } from './components/ActionBar';
import { CategoryModal } from './components/CategoryModal';
import { QRCodeModal } from './components/QRCodeModal';

function App() {
  // Core state
  const [urls, setUrls] = useState([]);
  const [selectedUrls, setSelectedUrls] = useState([]);
  const [categories, setCategories] = useState(['No Category', 'Save for Later', 'Thailand']);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentUrl, setCurrentUrl] = useState('');
  const [isThaiMode, setIsThaiMode] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);
  
  // Modal states
  const [categoryModal, setCategoryModal] = useState({
    isOpen: false,
    mode: 'add', // 'add', 'edit', 'delete'
    category: ''
  });
  
  // QR Code modal state
  const [qrModal, setQrModal] = useState({
    isOpen: false,
    url: '',
    title: ''
  });
  
  // Toast notifications
  const [toast, setToast] = useState({
    isVisible: false,
    message: '',
    type: 'success'
  });

  // Performance and offline hooks
  const { metrics, updateDataMetrics, updateMemoryUsage } = usePerformanceMonitor();
  const { isOnline } = useOfflineStatus();

  // Get current translations and theme
  const t = translations[isThaiMode ? 'th' : 'en'];
  const themeKey = isDarkMode ? (isThaiMode ? 'thaiDark' : 'dark') : (isThaiMode ? 'thai' : 'light');
  const themeConfig = themes[themeKey];

  // Load data on component mount
  useEffect(() => {
    loadData();
    updateMemoryUsage();
  }, []);

  // Update performance metrics when URLs change
  useEffect(() => {
    updateDataMetrics(urls);
  }, [urls, updateDataMetrics]);

  // Load data from localStorage
  const loadData = () => {
    try {
      const savedUrls = localStorage.getItem('goodNewsUrls');
      const savedCategories = localStorage.getItem('goodNewsCategories');
      const savedUser = localStorage.getItem('goodNewsUser');
      const savedTheme = localStorage.getItem('goodNewsTheme');
      const savedLanguage = localStorage.getItem('goodNewsLanguage');

      if (savedUrls) setUrls(JSON.parse(savedUrls));
      if (savedCategories) setCategories(JSON.parse(savedCategories));
      if (savedUser) setUser(JSON.parse(savedUser));
      if (savedTheme) setIsDarkMode(savedTheme === 'dark');
      if (savedLanguage) setIsThaiMode(savedLanguage === 'th');
    } catch (error) {
      console.error('Error loading data:', error);
      showToast('Error loading data', 'error');
    }
  };

  // Save data to localStorage
  const saveData = useCallback(() => {
    try {
      localStorage.setItem('goodNewsUrls', JSON.stringify(urls));
      localStorage.setItem('goodNewsCategories', JSON.stringify(categories));
      localStorage.setItem('goodNewsUser', JSON.stringify(user));
      localStorage.setItem('goodNewsTheme', isDarkMode ? 'dark' : 'light');
      localStorage.setItem('goodNewsLanguage', isThaiMode ? 'th' : 'en');
    } catch (error) {
      console.error('Error saving data:', error);
      showToast('Error saving data', 'error');
    }
  }, [urls, categories, user, isDarkMode, isThaiMode]);

  // Auto-save when data changes
  useEffect(() => {
    if (urls.length > 0 || user) {
      saveData();
    }
  }, [urls, categories, user, isDarkMode, isThaiMode, saveData]);

  // Show toast notification
  const showToast = (message, type = 'success') => {
    setToast({ isVisible: true, message, type });
  };

  // Hide toast notification
  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  // Open QR Code modal
  const openQRModal = (url, title) => {
    setQrModal({ isOpen: true, url, title });
  };

  // Close QR Code modal
  const closeQRModal = () => {
    setQrModal({ isOpen: false, url: '', title: '' });
  };

  // Sign in function
  const handleSignIn = async () => {
    if (!email.trim()) return;
    
    setIsSigningIn(true);
    
    // Simulate sign-in process
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser = {
      email: email.trim(),
      signedInAt: new Date().toISOString()
    };
    
    setUser(newUser);
    setEmail('');
    setIsSigningIn(false);
    showToast(t.welcomeBack, 'success');
  };

  // Sign out function
  const handleSignOut = () => {
    setUser(null);
    setSelectedUrls([]);
    showToast('Signed out successfully', 'info');
  };

  // Add URL function
  const addUrl = () => {
    if (!currentUrl.trim()) return;
    
    let url = currentUrl.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    const newUrl = {
      id: Date.now(),
      url,
      title: extractDomain(url),
      category: 'No Category',
      addedAt: new Date().toISOString(),
      isSelected: false
    };

    setUrls(prev => [newUrl, ...prev]);
    setCurrentUrl('');
    showToast('URL added successfully', 'success');
  };

  // Extract domain from URL
  const extractDomain = (url) => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return url;
    }
  };

  // Toggle URL selection
  const toggleUrlSelection = (urlId) => {
    setSelectedUrls(prev => {
      const isSelected = prev.includes(urlId);
      if (isSelected) {
        return prev.filter(id => id !== urlId);
      } else {
        return [...prev, urlId];
      }
    });
  };

  // Select all URLs
  const selectAllUrls = () => {
    const filteredUrlIds = filteredUrls.map(url => url.id);
    setSelectedUrls(filteredUrlIds);
  };

  // Deselect all URLs
  const deselectAllUrls = () => {
    setSelectedUrls([]);
  };

  // Share selected URLs
  const shareSelectedUrls = async () => {
    const selectedUrlsData = urls.filter(url => selectedUrls.includes(url.id));
    const shareText = selectedUrlsData.map(url => `${url.title}: ${url.url}`).join('\n\n');
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: t.appTitle,
          text: shareText
        });
        showToast(t.urlsShared, 'success');
      } catch (error) {
        // User cancelled or error occurred
        if (error.name !== 'AbortError') {
          copyToClipboard(shareText);
        }
      }
    } else {
      copyToClipboard(shareText);
    }
    
    setSelectedUrls([]);
  };

  // Copy to clipboard
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast(t.copiedToClipboard, 'success');
    } catch (error) {
      showToast(t.shareNotSupported, 'error');
    }
  };

  // Delete selected URLs
  const deleteSelectedUrls = () => {
    setUrls(prev => prev.filter(url => !selectedUrls.includes(url.id)));
    setSelectedUrls([]);
    showToast(t.urlsDeleted, 'success');
  };

  // Change category for selected URLs
  const changeSelectedCategory = (newCategory) => {
    setUrls(prev => prev.map(url => 
      selectedUrls.includes(url.id) 
        ? { ...url, category: newCategory }
        : url
    ));
    setSelectedUrls([]);
    showToast(t.categoryMoved, 'success');
  };

  // Add new category
  const addCategory = (categoryName) => {
    if (!categories.includes(categoryName)) {
      setCategories(prev => [...prev, categoryName]);
      showToast(t.categoryAdded, 'success');
    }
  };

  // Update category
  const updateCategory = (oldName, newName) => {
    setCategories(prev => prev.map(cat => cat === oldName ? newName : cat));
    setUrls(prev => prev.map(url => 
      url.category === oldName ? { ...url, category: newName } : url
    ));
    showToast(t.categoryUpdated, 'success');
  };

  // Delete category
  const deleteCategory = (categoryName) => {
    setCategories(prev => prev.filter(cat => cat !== categoryName));
    setUrls(prev => prev.map(url => 
      url.category === categoryName ? { ...url, category: 'No Category' } : url
    ));
    showToast(t.categoryDeleted, 'success');
  };

  // Filter URLs based on search term
  const filteredUrls = useMemo(() => {
    return urls.filter(url => 
      url.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      url.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      url.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [urls, searchTerm]);

  // Group URLs by category
  const groupedUrls = useMemo(() => {
    const groups = {};
    filteredUrls.forEach(url => {
      if (!groups[url.category]) {
        groups[url.category] = [];
      }
      groups[url.category].push(url);
    });
    return groups;
  }, [filteredUrls]);

  // Handle Enter key press for URL input
  const handleUrlKeyPress = (e) => {
    if (e.key === 'Enter') {
      addUrl();
    }
  };

  // Handle Enter key press for email input
  const handleEmailKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSignIn();
    }
  };

  // Toggle theme
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Toggle language
  const toggleLanguage = () => {
    setIsThaiMode(!isThaiMode);
  };

  // Main render
  return (
    <div className={`min-h-screen bg-gradient-to-br ${themeConfig.bg} transition-all duration-500`}>
      {/* Toast Notifications */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />

      {/* Header */}
      <header className={`sticky top-0 z-30 ${themeConfig.headerBg} border-b ${themeConfig.cardBorder} backdrop-blur-xl`}>
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Title */}
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-2xl bg-gradient-to-r ${themeConfig.accent} flex items-center justify-center shadow-lg`}>
                <Sparkles className="text-white" size={20} />
              </div>
              <div>
                <h1 className={`text-xl font-bold ${themeConfig.text}`}>
                  {t.appTitle}
                </h1>
                <p className={`text-sm ${themeConfig.textSecondary}`}>
                  {t.appSubtitle}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              {/* Online/Offline Status */}
              <div 
                className={`px-3 py-1 rounded-lg ${isOnline ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                title={isOnline ? "Online - Connected to internet" : "Offline - Working without internet"}
              >
                {isOnline ? <Wifi size={16} /> : <WifiOff size={16} />}
              </div>

              {/* Theme Toggle */}
              <TouchButton
                onClick={toggleTheme}
                variant="secondary"
                size="sm"
                className="p-2"
                isDark={isDarkMode}
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </TouchButton>

              {/* Language Toggle */}
              <TouchButton
                onClick={toggleLanguage}
                variant="secondary"
                size="sm"
                className="p-2"
                isDark={isDarkMode}
              >
                <Globe size={18} />
              </TouchButton>

              {/* User Actions */}
              {user ? (
                <TouchButton
                  onClick={handleSignOut}
                  variant="secondary"
                  size="sm"
                  isDark={isDarkMode}
                >
                  <LogOut size={16} />
                  {t.signOut}
                </TouchButton>
              ) : (
                <TouchButton
                  onClick={() => {/* Open sign in modal */}}
                  variant="primary"
                  size="sm"
                  isDark={isDarkMode}
                  isThaiMode={isThaiMode}
                >
                  <LogIn size={16} />
                  {t.signIn}
                </TouchButton>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Sign In Section */}
        {!user && (
          <div className={`${themeConfig.cardBg} rounded-3xl p-6 border ${themeConfig.cardBorder} shadow-xl ${themeConfig.shadowColor}`}>
            <div className="text-center space-y-4">
              <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r ${themeConfig.accent} flex items-center justify-center`}>
                <LogIn className="text-white" size={24} />
              </div>
              <h2 className={`text-2xl font-bold ${themeConfig.text}`}>
                {t.signInRequired}
              </h2>
              <p className={`${themeConfig.textSecondary}`}>
                {t.signInMessage}
              </p>
              
              <div className="max-w-md mx-auto space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={handleEmailKeyPress}
                  placeholder={t.emailPlaceholder}
                  className={`
                    w-full p-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent
                    transition-all duration-300 font-medium
                    ${isDarkMode 
                      ? 'border-purple-500/30 focus:ring-purple-500/30 bg-gray-800/40 text-purple-100 placeholder-purple-300/60' 
                      : isThaiMode 
                      ? 'border-blue-200/50 focus:ring-blue-500/30 bg-white/60 text-blue-900 placeholder-blue-500/60'
                      : 'border-blue-200/50 focus:ring-blue-500/30 bg-white/60 text-blue-900 placeholder-blue-500/60'
                    }
                  `}
                />
                <TouchButton
                  onClick={handleSignIn}
                  variant="primary"
                  size="lg"
                  className="w-full"
                  isDark={isDarkMode}
                  isThaiMode={isThaiMode}
                  loading={isSigningIn}
                  disabled={!email.trim()}
                >
                  <LogIn size={20} />
                  {t.signIn}
                </TouchButton>
              </div>
            </div>
          </div>
        )}

        {/* URL Input Section - Only show if signed in */}
        {user && (
          <div className={`${themeConfig.cardBg} rounded-3xl p-6 border ${themeConfig.cardBorder} shadow-xl ${themeConfig.shadowColor}`}>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${themeConfig.accent} flex items-center justify-center`}>
                  <Plus className="text-white" size={20} />
                </div>
                <div>
                  <h3 className={`text-lg font-semibold ${themeConfig.text}`}>
                    {t.addUrl}
                  </h3>
                  <p className={`text-sm ${themeConfig.textSecondary}`}>
                    {t.syncedToCloud}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <input
                  type="url"
                  value={currentUrl}
                  onChange={(e) => setCurrentUrl(e.target.value)}
                  onKeyPress={handleUrlKeyPress}
                  placeholder={t.enterUrl}
                  className={`
                    flex-1 p-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent
                    transition-all duration-300 font-medium
                    ${isDarkMode 
                      ? 'border-purple-500/30 focus:ring-purple-500/30 bg-gray-800/40 text-purple-100 placeholder-purple-300/60' 
                      : isThaiMode 
                      ? 'border-blue-200/50 focus:ring-blue-500/30 bg-white/60 text-blue-900 placeholder-blue-500/60'
                      : 'border-blue-200/50 focus:ring-blue-500/30 bg-white/60 text-blue-900 placeholder-blue-500/60'
                    }
                  `}
                />
                <TouchButton
                  onClick={addUrl}
                  variant="primary"
                  size="md"
                  isDark={isDarkMode}
                  isThaiMode={isThaiMode}
                  disabled={!currentUrl.trim()}
                >
                  <Plus size={20} />
                  {t.addUrl}
                </TouchButton>
              </div>
            </div>
          </div>
        )}

        {/* Search and Controls */}
        {user && urls.length > 0 && (
          <div className={`${themeConfig.cardBg} rounded-3xl p-6 border ${themeConfig.cardBorder} shadow-xl ${themeConfig.shadowColor}`}>
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${themeConfig.textSecondary}`} size={20} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className={`
                    w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent
                    transition-all duration-300 font-medium
                    ${isDarkMode 
                      ? 'border-purple-500/30 focus:ring-purple-500/30 bg-gray-800/40 text-purple-100 placeholder-purple-300/60' 
                      : isThaiMode 
                      ? 'border-blue-200/50 focus:ring-blue-500/30 bg-white/60 text-blue-900 placeholder-blue-500/60'
                      : 'border-blue-200/50 focus:ring-blue-500/30 bg-white/60 text-blue-900 placeholder-blue-500/60'
                    }
                  `}
                />
              </div>

              {/* Bulk Actions */}
              <div className="flex flex-wrap gap-3">
                <TouchButton
                  onClick={selectAllUrls}
                  variant="secondary"
                  size="sm"
                  isDark={isDarkMode}
                >
                  <Check size={16} />
                  {t.selectAll}
                </TouchButton>
                
                <TouchButton
                  onClick={deselectAllUrls}
                  variant="secondary"
                  size="sm"
                  isDark={isDarkMode}
                >
                  <X size={16} />
                  {t.deselectAll}
                </TouchButton>

                <TouchButton
                  onClick={() => setCategoryModal({ isOpen: true, mode: 'add', category: '' })}
                  variant="secondary"
                  size="sm"
                  isDark={isDarkMode}
                >
                  <FolderPlus size={16} />
                  {t.addCategory}
                </TouchButton>
              </div>
            </div>
          </div>
        )}

        {/* URLs List */}
        {user && (
          <div className="space-y-4">
            {Object.keys(groupedUrls).length === 0 ? (
              <div className={`${themeConfig.cardBg} rounded-3xl p-12 border ${themeConfig.cardBorder} shadow-xl ${themeConfig.shadowColor} text-center`}>
                <div className={`w-20 h-20 mx-auto rounded-3xl bg-gradient-to-r ${themeConfig.accent} flex items-center justify-center mb-6`}>
                  <Database className="text-white" size={32} />
                </div>
                <h3 className={`text-2xl font-bold ${themeConfig.text} mb-4`}>
                  {t.noUrlsYet}
                </h3>
                <p className={`${themeConfig.textSecondary} mb-6`}>
                  {t.noUrlsMessage}
                </p>
                <TouchButton
                  onClick={() => {/* Focus URL input */}}
                  variant="primary"
                  size="lg"
                  isDark={isDarkMode}
                  isThaiMode={isThaiMode}
                >
                  <Plus size={20} />
                  {t.addFirstUrl}
                </TouchButton>
              </div>
            ) : (
              Object.entries(groupedUrls).map(([category, categoryUrls]) => (
                <div key={category} className={`${themeConfig.cardBg} rounded-3xl border ${themeConfig.cardBorder} shadow-xl ${themeConfig.shadowColor} overflow-hidden`}>
                  {/* Category Header */}
                  <div className="p-6 border-b border-gray-200/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${themeConfig.accent} flex items-center justify-center`}>
                          <Tag className="text-white" size={16} />
                        </div>
                        <h3 className={`text-lg font-semibold ${themeConfig.text}`}>
                          {category}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${isDarkMode ? 'bg-gray-700/60 text-gray-300' : 'bg-gray-100/80 text-gray-600'}`}>
                          {categoryUrls.length} {t.urls}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <TouchButton
                          onClick={() => setCategoryModal({ isOpen: true, mode: 'edit', category })}
                          variant="secondary"
                          size="sm"
                          className="p-2"
                          isDark={isDarkMode}
                        >
                          <Edit3 size={16} />
                        </TouchButton>
                        
                        {category !== 'No Category' && (
                          <TouchButton
                            onClick={() => setCategoryModal({ isOpen: true, mode: 'delete', category })}
                            variant="danger"
                            size="sm"
                            className="p-2"
                            isDark={isDarkMode}
                          >
                            <Trash2 size={16} />
                          </TouchButton>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* URLs in Category */}
                  <div className="divide-y divide-gray-200/20">
                    {categoryUrls.map((url) => (
                      <div key={url.id} className="p-4 hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors duration-200">
                        <div className="flex items-center gap-4">
                          {/* Selection Checkbox */}
                          <TouchButton
                            onClick={() => toggleUrlSelection(url.id)}
                            variant="secondary"
                            size="sm"
                            className={`p-2 ${selectedUrls.includes(url.id) ? 'bg-blue-500 text-white' : ''}`}
                            isDark={isDarkMode}
                          >
                            {selectedUrls.includes(url.id) ? <Check size={16} /> : <div className="w-4 h-4 border-2 border-current rounded"></div>}
                          </TouchButton>

                          {/* URL Info */}
                          <div className="flex-1 min-w-0">
                            <h4 className={`font-semibold ${themeConfig.text} truncate`}>
                              {url.title}
                            </h4>
                            <p className={`text-sm ${themeConfig.textSecondary} truncate`}>
                              {url.url}
                            </p>
                            <p className={`text-xs ${themeConfig.textSecondary} mt-1`}>
                              <Clock size={12} className="inline mr-1" />
                              {new Date(url.addedAt).toLocaleDateString()}
                            </p>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2">
                            <TouchButton
                              onClick={() => openQRModal(url.url, url.title)}
                              variant="secondary"
                              size="sm"
                              className="p-2"
                              isDark={isDarkMode}
                              title="Show QR Code"
                            >
                              <QrCode size={16} />
                            </TouchButton>

                            <TouchButton
                              onClick={() => window.open(url.url, '_blank')}
                              variant="primary"
                              size="sm"
                              className="p-2"
                              isDark={isDarkMode}
                              isThaiMode={isThaiMode}
                            >
                              <ExternalLink size={16} />
                            </TouchButton>

                            <TouchButton
                              onClick={() => copyToClipboard(url.url)}
                              variant="secondary"
                              size="sm"
                              className="p-2"
                              isDark={isDarkMode}
                            >
                              <Copy size={16} />
                            </TouchButton>

                            <TouchButton
                              onClick={() => shareSelectedUrls([url.id])}
                              variant="secondary"
                              size="sm"
                              className="p-2"
                              isDark={isDarkMode}
                            >
                              <Share2 size={16} />
                            </TouchButton>

                            <TouchButton
                              onClick={() => {
                                setUrls(prev => prev.filter(u => u.id !== url.id));
                                showToast('URL deleted', 'success');
                              }}
                              variant="danger"
                              size="sm"
                              className="p-2"
                              isDark={isDarkMode}
                            >
                              <Trash2 size={16} />
                            </TouchButton>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Performance Stats */}
        {user && urls.length > 0 && (
          <div className={`${themeConfig.cardBg} rounded-3xl p-6 border ${themeConfig.cardBorder} shadow-xl ${themeConfig.shadowColor}`}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${themeConfig.accent} flex items-center justify-center`}>
                <BarChart3 className="text-white" size={16} />
              </div>
              <h3 className={`text-lg font-semibold ${themeConfig.text}`}>
                {t.analytics}
              </h3>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700/40' : 'bg-gray-50/80'} text-center`}>
                <div className={`text-2xl font-bold ${themeConfig.text}`}>{urls.length}</div>
                <div className={`text-sm ${themeConfig.textSecondary}`}>{t.totalUrls}</div>
              </div>
              
              <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700/40' : 'bg-gray-50/80'} text-center`}>
                <div className={`text-2xl font-bold ${themeConfig.text}`}>{categories.length}</div>
                <div className={`text-sm ${themeConfig.textSecondary}`}>Categories</div>
              </div>
              
              <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700/40' : 'bg-gray-50/80'} text-center`}>
                <div className={`text-2xl font-bold ${themeConfig.text}`}>{dataUtils.formatBytes(metrics.dataSize)}</div>
                <div className={`text-sm ${themeConfig.textSecondary}`}>{t.dataSize}</div>
              </div>
              
              <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700/40' : 'bg-gray-50/80'} text-center`}>
                <div className={`text-2xl font-bold ${themeConfig.text}`}>{metrics.compressionRatio}%</div>
                <div className={`text-sm ${themeConfig.textSecondary}`}>Compression</div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Action Bar - Fixed bottom bar for bulk actions */}
      <ActionBar
        selectedUrls={selectedUrls}
        urls={urls}
        onShare={shareSelectedUrls}
        onDelete={deleteSelectedUrls}
        onChangeCategory={changeSelectedCategory}
        categories={categories}
        t={t}
        isDark={isDarkMode}
        isThaiMode={isThaiMode}
        themeConfig={themeConfig}
      />

      {/* Category Modal */}
      <CategoryModal
        isOpen={categoryModal.isOpen}
        onClose={() => setCategoryModal({ isOpen: false, mode: 'add', category: '' })}
        mode={categoryModal.mode}
        category={categoryModal.category}
        categories={categories}
        onSave={(categoryName) => {
          if (categoryModal.mode === 'add') {
            addCategory(categoryName);
          } else if (categoryModal.mode === 'edit') {
            updateCategory(categoryModal.category, categoryName);
          }
        }}
        onDelete={() => deleteCategory(categoryModal.category)}
        t={t}
        isDark={isDarkMode}
        isThaiMode={isThaiMode}
        themeConfig={themeConfig}
      />

      {/* QR Code Modal */}
      <QRCodeModal
        isOpen={qrModal.isOpen}
        onClose={closeQRModal}
        url={qrModal.url}
        title={qrModal.title}
        t={t}
        isDark={isDarkMode}
        themeConfig={themeConfig}
      />
    </div>
  );
}

export default App;