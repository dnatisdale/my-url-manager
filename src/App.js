import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Search, X, BarChart3, FolderPlus, Check } from 'lucide-react';

// Import our modularized components and utilities
import { translations } from './constants/translations';
import { themes } from './constants/themes';
import { dataUtils } from './utils/dataUtils';
import { usePerformanceMonitor, useOfflineStatus } from './hooks/useCustomHooks';
import { LoadingSpinner, TouchButton, Toast } from './components/UI';
import { ActionBar } from './components/ActionBar';
import { CategoryModal } from './components/CategoryModal';
import { ShareModal } from './components/ShareModal';
import { ConfirmationModal } from './components/ConfirmationModal';
import { BackupExportModal } from './components/BackupExportModal';
import { HeaderSection } from './components/HeaderSection';
import { SignInSection } from './components/SignInSection';
import { URLInputSection } from './components/URLInputSection';
import { URLListSection } from './components/URLListSection';
import { firebaseSync } from './services/firebaseSync';

// NEW IMPORTS - Add these new components
import { InfoTooltip } from './components/InfoTooltip';
import { URLValidator } from './components/URLValidator';
import { ActionDropdown } from './components/ActionDropdown';
import { DownloadManager } from './components/DownloadManager';
import { PWASharing } from './components/PWASharing';

function App() {
  // Core state
  const [urls, setUrls] = useState([]);
  const [selectedUrls, setSelectedUrls] = useState([]);
  const [categories, setCategories] = useState(['Save for Later', 'Thailand']);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentUrl, setCurrentUrl] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isThaiMode, setIsThaiMode] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  
  // NEW STATE - Add these for the new components
  const [urlValidation, setUrlValidation] = useState(null);
  
  // PWA Install
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  
  // Modal states
  const [categoryModal, setCategoryModal] = useState({
    isOpen: false,
    mode: 'add',
    category: ''
  });
  
  const [shareModal, setShareModal] = useState({
    isOpen: false,
    url: '',
    title: '',
    showQR: false
  });
  
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    type: 'danger',
    urlsToDelete: null
  });

  const [backupModal, setBackupModal] = useState(false);
  
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

  // Define showToast first
  const showToast = (message, type = 'info') => {
  // Your showToast function code goes here
};

  // NEW - Initialize DownloadManager (moved after showToast is defined)
  const downloadManager = DownloadManager({ isDark: isDarkMode, onShowToast: showToast });
  // Get current translations and theme
  const t = translations[isThaiMode ? 'th' : 'en'];
  const themeKey = isDarkMode ? (isThaiMode ? 'thaiDark' : 'dark') : (isThaiMode ? 'thai' : 'light');
  const themeConfig = themes[themeKey];

  // PWA Install Prompt Detection
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowInstallButton(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Handle PWA Install
  const handleInstallPWA = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      showToast('App installed successfully!', 'success');
    }
    
    setDeferredPrompt(null);
    setShowInstallButton(false);
  };

  // Load data on component mount
  useEffect(() => {
    loadData();
    updateMemoryUsage();
    
    const savedEmail = localStorage.getItem('goodNewsRememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, [updateMemoryUsage]);

  // Update performance metrics when URLs change
  useEffect(() => {
    updateDataMetrics(urls);
  }, [urls, updateDataMetrics]);

  // Auto-sync when user changes and online
  useEffect(() => {
    if (user && isOnline && urls.length > 0) {
      syncToCloud();
    }
  }, [user, isOnline]);

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

  // Save data to localStorage and sync to cloud
  const saveData = useCallback(async () => {
    try {
      localStorage.setItem('goodNewsUrls', JSON.stringify(urls));
      localStorage.setItem('goodNewsCategories', JSON.stringify(categories));
      localStorage.setItem('goodNewsUser', JSON.stringify(user));
      localStorage.setItem('goodNewsTheme', isDarkMode ? 'dark' : 'light');
      localStorage.setItem('goodNewsLanguage', isThaiMode ? 'th' : 'en');
      
      if (user && isOnline && urls.length > 0) {
        await syncToCloud();
      }
    } catch (error) {
      console.error('Error saving data:', error);
      showToast('Error saving data', 'error');
    }
  }, [urls, categories, user, isDarkMode, isThaiMode, isOnline]);

  // Cloud sync function
  const syncToCloud = async () => {
    if (!user || isSyncing) return;
    
    setIsSyncing(true);
    const syncData = { urls, categories };
    const result = await firebaseSync.syncToCloud(user.email, syncData);
    
    if (result.success) {
      showToast(t.syncComplete, 'success');
    } else {
      showToast(t.syncFailed, 'warning');
    }
    
    setIsSyncing(false);
  };

  // Load from cloud on sign in
  const loadFromCloud = async (userEmail) => {
    setIsSyncing(true);
    const result = await firebaseSync.fetchFromCloud(userEmail);
    
    if (result.success && result.data) {
      setUrls(result.data.urls || []);
      setCategories(result.data.categories || ['Save for Later', 'Thailand']);
      showToast('Data loaded from cloud', 'success');
    } else if (result.success && !result.data) {
      showToast('No cloud data found - first time login', 'info');
    } else {
      showToast('Failed to load cloud data', 'error');
    }
    
    setIsSyncing(false);
  };

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

  // URL validation function - UPDATED to use validation result
  const isValidUrl = (string) => {
    try {
      if (string.includes('.') && !string.includes(' ') && string.length > 3) {
        new URL('https://' + string);
        return true;
      }
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  // Open Share modal
  const openShareModal = (url, title, showQR = false) => {
    setShareModal({ isOpen: true, url, title, showQR });
  };

  // Close Share modal
  const closeShareModal = () => {
    setShareModal({ isOpen: false, url: '', title: '', showQR: false });
  };

  // Open confirmation modal
  const openConfirmModal = (title, message, onConfirm, type = 'danger', urlsToDelete = null) => {
    setConfirmModal({ isOpen: true, title, message, onConfirm, type, urlsToDelete });
  };

  // Close confirmation modal
  const closeConfirmModal = () => {
    setConfirmModal({ isOpen: false, title: '', message: '', onConfirm: null, type: 'danger', urlsToDelete: null });
  };

  // Handle import
  const handleImport = (importedUrls, importedCategories) => {
    setUrls(importedUrls);
    setCategories(importedCategories);
  };

  // Sign in function
  const handleSignIn = async () => {
    if (!email.trim()) return;
    
    setIsSigningIn(true);
    
    localStorage.setItem('goodNewsRememberedEmail', email.trim());
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser = {
      email: email.trim(),
      signedInAt: new Date().toISOString()
    };
    
    setUser(newUser);
    
    await loadFromCloud(email.trim());
    
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

  // NEW HELPER FUNCTIONS for ActionDropdown
  const deleteUrl = (urlId) => {
    setUrls(prev => prev.filter(url => url.id !== urlId));
    showToast('URL deleted', 'success');
  };

  const editUrl = (urlId) => {
    const url = urls.find(u => u.id === urlId);
    if (url) {
      setCurrentUrl(url.url);
      // You might want to scroll to the input or focus it
    }
  };

  const moveUrlToCategory = (urlId, newCategory) => {
    setUrls(prev => prev.map(url => 
      url.id === urlId ? { ...url, category: newCategory } : url
    ));
    showToast(`URL moved to ${newCategory}`, 'success');
  };

  // UPDATED Add URL function with validation
  const addUrl = (category) => {
    if (!currentUrl.trim()) return;
    
    // Use validation result if available
    const finalUrl = urlValidation?.processedUrl || currentUrl.trim();
    
    // Check validation if we have it
    if (urlValidation && !urlValidation.isValid) {
      showToast('Please enter a valid URL', 'error');
      return;
    }
    
    // Fallback to original validation if no URLValidator result
    let url = finalUrl;
    if (!urlValidation) {
      if (!isValidUrl(url)) {
        showToast(t.invalidUrl + ': ' + t.pleaseEnterValidUrl, 'error');
        return;
      }
      
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
    }

    const newUrl = {
      id: Date.now(),
      url,
      title: extractDomain(url),
      category: category,
      addedAt: new Date().toISOString(),
      isSelected: false
    };

    setUrls(prev => [newUrl, ...prev]);
    setCurrentUrl('');
    setSelectedCategory('');
    setUrlValidation(null); // Reset validation
    showToast(t.urlAdded, 'success');
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

  // Delete selected URLs with confirmation and URL list
  const deleteSelectedUrls = () => {
    const count = selectedUrls.length;
    const urlsToDelete = urls.filter(url => selectedUrls.includes(url.id));
    
    openConfirmModal(
      'Delete URLs',
      `Are you sure you want to delete ${count} selected URL${count > 1 ? 's' : ''}? This action cannot be undone.`,
      () => {
        setUrls(prev => prev.filter(url => !selectedUrls.includes(url.id)));
        setSelectedUrls([]);
        showToast(`${count} URL${count > 1 ? 's' : ''} deleted`, 'success');
      },
      'danger',
      urlsToDelete
    );
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

  // Delete category with confirmation
  const deleteCategory = (categoryName) => {
    const urlCount = urls.filter(url => url.category === categoryName).length;
    openConfirmModal(
      'Delete Category',
      `Are you sure you want to delete "${categoryName}"? ${urlCount > 0 ? `${urlCount} URL${urlCount > 1 ? 's' : ''} will be moved to "Save for Later".` : 'This action cannot be undone.'}`,
      () => {
        setCategories(prev => prev.filter(cat => cat !== categoryName));
        setUrls(prev => prev.map(url => 
          url.category === categoryName ? { ...url, category: 'Save for Later' } : url
        ));
        showToast(t.categoryDeleted, 'success');
      }
    );
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
      if (selectedCategory) {
        addUrl(selectedCategory);
      }
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

  return (
    <div className={`min-h-screen bg-gradient-to-br ${themeConfig.bg} transition-all duration-500`}>
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />

      <HeaderSection
        t={t}
        themeConfig={themeConfig}
        isDarkMode={isDarkMode}
        isThaiMode={isThaiMode}
        toggleTheme={toggleTheme}
        toggleLanguage={toggleLanguage}
        user={user}
        handleSignOut={handleSignOut}
        showInstallButton={showInstallButton}
        handleInstallPWA={handleInstallPWA}
        isOnline={isOnline}
        isSyncing={isSyncing}
        // NEW - Add PWA Sharing to header
        pwaSharing={<PWASharing isDark={isDarkMode} onShowToast={showToast} />}
      />

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {!user && (
          <SignInSection
            t={t}
            themeConfig={themeConfig}
            isDarkMode={isDarkMode}
            isThaiMode={isThaiMode}
            email={email}
            setEmail={setEmail}
            isSigningIn={isSigningIn}
            handleSignIn={handleSignIn}
            handleEmailKeyPress={handleEmailKeyPress}
          />
        )}

        {user && (
          <div>
            <URLInputSection
              t={t}
              themeConfig={themeConfig}
              isDarkMode={isDarkMode}
              isThaiMode={isThaiMode}
              currentUrl={currentUrl}
              setCurrentUrl={setCurrentUrl}
              addUrl={addUrl}
              handleUrlKeyPress={handleUrlKeyPress}
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
            
            {/* NEW - Add URL Validator below input */}
            <URLValidator 
              url={currentUrl}
              onValidationChange={setUrlValidation}
              isDark={isDarkMode}
              themeConfig={themeConfig}
              onShowToast={showToast}
            />
          </div>
        )}

        {user && urls.length > 0 && (
          <div className={`${themeConfig.cardBg} rounded-3xl p-6 border ${themeConfig.cardBorder}`}>
            <div className="space-y-4">
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
                  {/* NEW - Replace * with InfoTooltip */}
                  <InfoTooltip 
                    message="Create a new category to organize your URLs"
                    isDark={isDarkMode}
                  />
                </TouchButton>
              </div>
            </div>
          </div>
        )}

        {user && (
          <URLListSection
            groupedUrls={groupedUrls}
            selectedUrls={selectedUrls}
            t={t}
            themeConfig={themeConfig}
            isDarkMode={isDarkMode}
            isThaiMode={isThaiMode}
            toggleUrlSelection={toggleUrlSelection}
            openShareModal={openShareModal}
            copyToClipboard={copyToClipboard}
            openConfirmModal={openConfirmModal}
            setUrls={setUrls}
            showToast={showToast}
            setCategoryModal={setCategoryModal}
            // NEW - Pass ActionDropdown props
            ActionDropdown={ActionDropdown}
            deleteUrl={deleteUrl}
            editUrl={editUrl}
            moveUrlToCategory={moveUrlToCategory}
            categories={categories}
            downloadManager={downloadManager}
          />
        )}

        {user && urls.length > 0 && (
          <div className="flex justify-center gap-3">
            <TouchButton
              onClick={() => setShowAnalytics(!showAnalytics)}
              variant="secondary"
              size="md"
              isDark={isDarkMode}
              className="flex items-center gap-2"
            >
              <BarChart3 size={20} />
              {showAnalytics ? 'Hide Analytics' : 'Show Analytics'}
            </TouchButton>
            
            <TouchButton
              onClick={() => setBackupModal(true)}
              variant="primary"
              size="md"
              isDark={isDarkMode}
              isThaiMode={isThaiMode}
              className="flex items-center gap-2"
            >
              <BarChart3 size={20} />
              Backup & Export
            </TouchButton>
          </div>
        )}

        {user && urls.length > 0 && showAnalytics && (
          <div className={`${themeConfig.cardBg} rounded-3xl p-6 border ${themeConfig.cardBorder}`}>
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

            {/* NEW - Add download location display */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <downloadManager.DownloadLocationDisplay />
            </div>
          </div>
        )}
      </main>

      {/* Action Bar for Selected URLs */}
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

      {/* Category Management Modal */}
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

      {/* Share Modal with QR Codes */}
      <ShareModal
        isOpen={shareModal.isOpen}
        onClose={closeShareModal}
        url={shareModal.url}
        title={shareModal.title}
        showQR={shareModal.showQR}
        t={t}
        isDark={isDarkMode}
        themeConfig={themeConfig}
        onShowToast={showToast}
      />

      {/* Confirmation Modal for Deletions */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={closeConfirmModal}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        type={confirmModal.type}
        urlsToDelete={confirmModal.urlsToDelete}
        confirmText="Delete"
        cancelText="Cancel"
        t={t}
        isDark={isDarkMode}
        themeConfig={themeConfig}
      />

      {/* Backup and Export Modal */}
      <BackupExportModal
        isOpen={backupModal}
        onClose={() => setBackupModal(false)}
        urls={urls}
        categories={categories}
        user={user}
        onImport={handleImport}
        t={t}
        isDark={isDarkMode}
        isThaiMode={isThaiMode}
        themeConfig={themeConfig}
        onShowToast={showToast}
        downloadManager={downloadManager}
      />

      {/* Loading spinner overlay when syncing */}
      {isSyncing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`${themeConfig.cardBg} rounded-2xl p-6 border ${themeConfig.cardBorder} flex flex-col items-center gap-4`}>
            <LoadingSpinner size="lg" color={isDarkMode ? 'purple' : 'blue'} />
            <div className={`${themeConfig.text} font-medium`}>
              {t.syncing || 'Syncing data...'}
            </div>
          </div>
        </div>
      )}

      {/* Offline indicator */}
      {!isOnline && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-auto z-40">
          <div className={`
            px-4 py-2 rounded-lg border flex items-center gap-2 text-sm font-medium
            ${isDarkMode 
              ? 'bg-gray-800 border-gray-700 text-gray-300' 
              : 'bg-white border-gray-200 text-gray-700'
            }
          `}>
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            {t.offline || 'Offline'}
          </div>
        </div>
      )}

      {/* Performance monitoring in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-4 right-4 z-50">
          <div className={`
            px-3 py-2 rounded-lg text-xs font-mono border
            ${isDarkMode 
              ? 'bg-gray-800 border-gray-700 text-gray-300' 
              : 'bg-white border-gray-200 text-gray-700'
            }
          `}>
            <div>URLs: {urls.length}</div>
            <div>Memory: {dataUtils.formatBytes(metrics.memoryUsage)}</div>
            <div>Size: {dataUtils.formatBytes(metrics.dataSize)}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;