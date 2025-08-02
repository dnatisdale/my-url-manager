import React, { useState, useEffect, useCallback } from 'react';
import { HeaderSection } from './components/HeaderSection';
import { SignInSection } from './components/SignInSection';
import { URLInputSection } from './components/URLInputSection';
import { URLListSection } from './components/URLListSection';
import { ActionBar } from './components/ActionBar';
import { CategoryModal } from './components/CategoryModal';
import { BackupExportModal } from './components/BackupExportModal';
import { QRCodeModal } from './components/QRCodeModal';
import { ShareModal } from './components/ShareModal';
import { ConfirmationModal } from './components/ConfirmationModal';
import { PWASharing } from './components/PWASharing';
import { DownloadManager } from './components/DownloadManager';
import { urlHealthService } from './services/URLHealthService';
import { translations } from './constants/translations';

function App() {
  // Core state
  const [urls, setUrls] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  // UI state
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('en');
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal state
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  
  // Current data for modals
  const [currentURL, setCurrentURL] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [editingURL, setEditingURL] = useState(null);
  
  // User state (for future authentication)
  const [user, setUser] = useState(null);
  const [isSignedIn, setIsSignedIn] = useState(false);

  // Get current translations
  const t = translations[language] || translations.en;

  // Initialize app
  useEffect(() => {
    initializeApp();
  }, []);

  // Initialize health monitoring
  useEffect(() => {
    // Start periodic health checks every 30 minutes
    urlHealthService.startPeriodicChecks(30);
    
    // Subscribe to health updates to sync with URL data
    const unsubscribe = urlHealthService.subscribe((url, healthData) => {
      setUrls(prevUrls => 
        prevUrls.map(urlItem => 
          urlItem.url === url 
            ? {
                ...urlItem,
                isHealthy: healthData.isHealthy,
                lastHealthCheck: healthData.lastChecked,
                healthData: healthData
              }
            : urlItem
        )
      );
    });
    
    // Cleanup on unmount
    return () => {
      urlHealthService.stopPeriodicChecks();
      unsubscribe();
    };
  }, []);

  // Load data from localStorage
  const initializeApp = async () => {
    try {
      setIsLoading(true);
      
      // Load theme preference
      const savedTheme = localStorage.getItem('url-manager-theme') || 'light';
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
      
      // Load language preference
      const savedLanguage = localStorage.getItem('url-manager-language') || 'en';
      setLanguage(savedLanguage);
      
      // Load URLs from localStorage
      const savedUrls = localStorage.getItem('url-manager-urls');
      if (savedUrls) {
        const parsedUrls = JSON.parse(savedUrls);
        setUrls(parsedUrls);
        
        // Initialize health service with existing health data
        parsedUrls.forEach(url => {
          if (url.healthData) {
            urlHealthService.healthCache.set(url.url, {
              ...url.healthData,
              lastChecked: url.lastHealthCheck || new Date().toISOString()
            });
          }
        });
      }
      
      // Load categories
      const savedCategories = localStorage.getItem('url-manager-categories');
      if (savedCategories) {
        setCategories(JSON.parse(savedCategories));
      }
      
    } catch (error) {
      console.error('Error initializing app:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Save data to localStorage
  const saveToLocalStorage = useCallback((updatedUrls = urls, updatedCategories = categories) => {
    try {
      localStorage.setItem('url-manager-urls', JSON.stringify(updatedUrls));
      localStorage.setItem('url-manager-categories', JSON.stringify(updatedCategories));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [urls, categories]);

  // Theme management
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    localStorage.setItem('url-manager-theme', newTheme);
  };

  // Language management
  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'th' : 'en';
    setLanguage(newLanguage);
    localStorage.setItem('url-manager-language', newLanguage);
  };

  // URL management
  const handleAddURL = async (urlData) => {
    try {
      // Ensure URL has an ID
      const newURL = {
        ...urlData,
        id: urlData.id || Date.now().toString(),
        dateAdded: urlData.dateAdded || new Date().toISOString()
      };

      const updatedUrls = [newURL, ...urls];
      setUrls(updatedUrls);
      
      // Update categories if new category was added
      if (newURL.category && !categories.includes(newURL.category)) {
        const updatedCategories = [...categories, newURL.category].sort();
        setCategories(updatedCategories);
        saveToLocalStorage(updatedUrls, updatedCategories);
      } else {
        saveToLocalStorage(updatedUrls);
      }
      
    } catch (error) {
      console.error('Error adding URL:', error);
    }
  };

  const handleEditURL = (url) => {
    setEditingURL(url);
    setCurrentURL(url);
    setShowCategoryModal(true);
  };

  const handleUpdateURL = async (updatedURL) => {
    try {
      const updatedUrls = urls.map(url => 
        url.id === updatedURL.id ? { ...updatedURL, dateModified: new Date().toISOString() } : url
      );
      setUrls(updatedUrls);
      
      // Update categories if needed
      const newCategory = updatedURL.category;
      if (newCategory && !categories.includes(newCategory)) {
        const updatedCategories = [...categories, newCategory].sort();
        setCategories(updatedCategories);
        saveToLocalStorage(updatedUrls, updatedCategories);
      } else {
        saveToLocalStorage(updatedUrls);
      }
      
      setEditingURL(null);
      setCurrentURL(null);
      
    } catch (error) {
      console.error('Error updating URL:', error);
    }
  };

  const handleDeleteURL = (urlId) => {
    const urlToDelete = urls.find(url => url.id === urlId);
    setCurrentURL(urlToDelete);
    setConfirmAction({
      type: 'delete',
      title: t.confirmDelete || 'Delete URL',
      message: `${t.aboutToDelete || 'Are you sure you want to delete'}: "${urlToDelete?.title}"?`,
      confirmText: t.delete || 'Delete',
      onConfirm: () => confirmDeleteURL(urlId)
    });
    setShowConfirmModal(true);
  };

  const confirmDeleteURL = async (urlId) => {
    try {
      const urlToDelete = urls.find(url => url.id === urlId);
      const updatedUrls = urls.filter(url => url.id !== urlId);
      setUrls(updatedUrls);
      saveToLocalStorage(updatedUrls);
      
      // Remove from health monitoring
      if (urlToDelete) {
        urlHealthService.removeFromCache(urlToDelete.url);
      }
      
      setShowConfirmModal(false);
      setCurrentURL(null);
      setConfirmAction(null);
    } catch (error) {
      console.error('Error deleting URL:', error);
    }
  };

  // Category management
  const handleAddCategory = async (categoryName) => {
    if (!categoryName.trim() || categories.includes(categoryName.trim())) {
      return;
    }
    
    const updatedCategories = [...categories, categoryName.trim()].sort();
    setCategories(updatedCategories);
    saveToLocalStorage(urls, updatedCategories);
  };

  const handleDeleteCategory = (categoryName) => {
    setConfirmAction({
      type: 'deleteCategory',
      title: t.deleteCategory || 'Delete Category',
      message: `${t.confirmDeleteCategory || 'Delete category'}: "${categoryName}"?`,
      confirmText: t.delete || 'Delete',
      onConfirm: () => confirmDeleteCategory(categoryName)
    });
    setShowConfirmModal(true);
  };

  const confirmDeleteCategory = async (categoryName) => {
    try {
      const updatedCategories = categories.filter(cat => cat !== categoryName);
      setCategories(updatedCategories);
      
      // Remove category from URLs
      const updatedUrls = urls.map(url => 
        url.category === categoryName ? { ...url, category: null } : url
      );
      setUrls(updatedUrls);
      
      saveToLocalStorage(updatedUrls, updatedCategories);
      
      setShowConfirmModal(false);
      setConfirmAction(null);
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  // Export/Import functionality
  const handleExport = async (exportData) => {
    try {
      const dataToExport = {
        urls: urls,
        categories: categories,
        exportDate: new Date().toISOString(),
        version: '1.0',
        includeMetadata: exportData.includeMetadata,
        includeHealthStatus: exportData.includeHealthStatus,
        healthData: exportData.includeHealthStatus ? urlHealthService.exportHealthData() : null
      };

      // Filter data based on export options
      if (!exportData.includeMetadata) {
        dataToExport.urls = urls.map(({ id, url, title, category }) => ({ id, url, title, category }));
      }

      const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `url-manager-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      setShowBackupModal(false);
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  const handleImport = async (importData) => {
    try {
      if (importData.urls && Array.isArray(importData.urls)) {
        setUrls(importData.urls);
      }
      
      if (importData.categories && Array.isArray(importData.categories)) {
        setCategories(importData.categories);
      }
      
      // Import health data if available
      if (importData.healthData) {
        urlHealthService.importHealthData(importData.healthData);
      }
      
      saveToLocalStorage(importData.urls || urls, importData.categories || categories);
    } catch (error) {
      console.error('Error importing data:', error);
    }
  };

  // QR Code and sharing
  const handleGenerateQR = (url) => {
    setCurrentURL(url);
    setShowQRModal(true);
  };

  const handleShare = (url) => {
    setCurrentURL(url);
    setShowShareModal(true);
  };

  // Search and filter
  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading URL Manager...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-200 ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          {/* Header */}
          <HeaderSection
            theme={theme}
            language={language}
            onToggleTheme={toggleTheme}
            onToggleLanguage={toggleLanguage}
            translations={t}
            urlCount={urls.length}
            categoryCount={categories.length}
            healthStats={urlHealthService.getHealthStats()}
          />

          {/* Main Content */}
          <div className="space-y-6">
            {/* URL Input */}
            <URLInputSection
              onAddURL={handleAddURL}
              categories={categories}
              translations={t}
              theme={theme}
            />

            {/* Action Bar */}
            <ActionBar
              urls={urls}
              categories={categories}
              searchTerm={searchTerm}
              selectedCategory={selectedCategory}
              onSearch={handleSearch}
              onCategoryFilter={handleCategoryFilter}
              onShowCategories={() => setShowCategoryModal(true)}
              onShowBackup={() => setShowBackupModal(true)}
              translations={t}
              theme={theme}
            />

            {/* URL List */}
            <URLListSection
              urls={urls}
              onEditURL={handleEditURL}
              onDeleteURL={handleDeleteURL}
              onGenerateQR={handleGenerateQR}
              searchTerm={searchTerm}
              selectedCategory={selectedCategory}
              translations={t}
              theme={theme}
            />
          </div>

          {/* PWA Sharing */}
          <PWASharing translations={t} />
        </div>

        {/* Modals */}
        <CategoryModal
          isOpen={showCategoryModal}
          onClose={() => {
            setShowCategoryModal(false);
            setEditingURL(null);
            setCurrentURL(null);
          }}
          categories={categories}
          onAddCategory={handleAddCategory}
          onDeleteCategory={handleDeleteCategory}
          editingURL={editingURL}
          onUpdateURL={handleUpdateURL}
          translations={t}
        />

        <BackupExportModal
          isOpen={showBackupModal}
          onClose={() => setShowBackupModal(false)}
          urls={urls}
          onExport={handleExport}
          onImport={handleImport}
          translations={t}
        />

        <QRCodeModal
          isOpen={showQRModal}
          onClose={() => setShowQRModal(false)}
          url={currentURL?.url}
          title={currentURL?.title}
        />

        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          url={currentURL}
          translations={t}
        />

        <ConfirmationModal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          title={confirmAction?.title}
          message={confirmAction?.message}
          confirmText={confirmAction?.confirmText}
          onConfirm={confirmAction?.onConfirm}
          type={confirmAction?.type}
        />

        {/* Download Manager */}
        <DownloadManager />
      </div>
    </div>
  );
}

export default App;