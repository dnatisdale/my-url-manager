import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { AddURLForm } from './components/AddURLForm';
import { SearchAndFilters } from './components/SearchAndFilters';
import { URLList } from './components/URLList';
import { CategoryManager } from './components/CategoryManager';
import { ExportImport } from './components/ExportImport';
import { HealthMonitor } from './components/HealthMonitor';
import { Footer } from './components/Footer';
import { urlHealthService } from './services/URLHealthService';

function App() {
  // State management
  const [urls, setUrls] = useState([]);
  const [categories, setCategories] = useState(['General', 'Work', 'Personal', 'Resources']);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('newest');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Load data from localStorage
  useEffect(() => {
    try {
      const savedUrls = localStorage.getItem('urls');
      const savedCategories = localStorage.getItem('categories');
      
      if (savedUrls) {
        const parsedUrls = JSON.parse(savedUrls);
        setUrls(parsedUrls);
        
        // Initialize health service with existing URLs
        parsedUrls.forEach(url => {
          if (url.healthData) {
            urlHealthService.healthCache.set(url.url, {
              ...url.healthData,
              lastChecked: url.lastHealthCheck || new Date().toISOString()
            });
          }
        });
      }
      
      if (savedCategories) {
        setCategories(JSON.parse(savedCategories));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('urls', JSON.stringify(urls));
      localStorage.setItem('categories', JSON.stringify(categories));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }, [urls, categories]);

  // URL Management Functions
  const addUrl = (urlData) => {
    // Auto-HTTPS functionality
    let formattedUrl = urlData.url.trim();
    if (!formattedUrl.match(/^https?:\/\//)) {
      formattedUrl = 'https://' + formattedUrl;
    }

    // Handle custom category
    let finalCategory = urlData.category;
    if (urlData.customCategory?.trim()) {
      finalCategory = urlData.customCategory.trim();
      if (!categories.includes(finalCategory)) {
        setCategories(prev => [...prev, finalCategory].sort());
      }
    }
    
    const newUrl = {
      id: Date.now(),
      url: formattedUrl,
      title: urlData.title.trim() || formattedUrl,
      category: finalCategory,
      added: new Date().toLocaleDateString(),
      timestamp: Date.now(),
      // NEW: Initialize health data
      isHealthy: null,
      lastHealthCheck: null,
      healthData: null
    };
    
    setUrls(prev => [newUrl, ...prev]);
    
    // NEW: Automatically check health of new URL
    setTimeout(() => {
      urlHealthService.checkURL(formattedUrl);
    }, 1000);
  };

  const deleteUrl = (id) => {
    if (window.confirm('Are you sure you want to delete this URL?')) {
      const urlToDelete = urls.find(url => url.id === id);
      if (urlToDelete) {
        // Remove from health monitoring
        urlHealthService.removeFromCache(urlToDelete.url);
      }
      setUrls(prev => prev.filter(url => url.id !== id));
    }
  };

  const copyUrl = async (urlToCopy) => {
    try {
      await navigator.clipboard.writeText(urlToCopy);
      alert('URL copied to clipboard! 📋');
    } catch (error) {
      const textArea = document.createElement('textarea');
      textArea.value = urlToCopy;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('URL copied to clipboard! 📋');
    }
  };

  // NEW: Handle health updates
  const handleHealthUpdate = (url, healthData) => {
    setUrls(prev => prev.map(urlItem => 
      urlItem.url === url 
        ? {
            ...urlItem,
            isHealthy: healthData.isHealthy,
            lastHealthCheck: healthData.lastChecked,
            healthData: healthData
          }
        : urlItem
    ));
  };

  // Category Management
  const deleteCategory = (categoryToDelete) => {
    if (window.confirm(`Delete category "${categoryToDelete}"? URLs in this category will be moved to "General".`)) {
      setUrls(prev => prev.map(url => 
        url.category === categoryToDelete 
          ? { ...url, category: 'General' }
          : url
      ));
      setCategories(prev => prev.filter(cat => cat !== categoryToDelete));
      if (categoryFilter === categoryToDelete) {
        setCategoryFilter('all');
      }
    }
  };

  // Import Data Function
  const handleImportData = (importedData) => {
    try {
      // Set imported URLs
      if (importedData.urls && Array.isArray(importedData.urls)) {
        const validUrls = importedData.urls.map(url => ({
          id: url.id || Date.now() + Math.random(),
          url: url.url,
          title: url.title || url.url,
          category: url.category || 'General',
          added: url.added || new Date().toLocaleDateString(),
          timestamp: url.timestamp || Date.now(),
          // Preserve health data if available
          isHealthy: url.isHealthy || null,
          lastHealthCheck: url.lastHealthCheck || null,
          healthData: url.healthData || null
        }));
        setUrls(validUrls);

        // Import health data into service
        if (importedData.healthData) {
          urlHealthService.importHealthData(importedData.healthData);
        }
      }

      // Set imported categories
      if (importedData.categories && Array.isArray(importedData.categories)) {
        const defaultCategories = ['General', 'Work', 'Personal', 'Resources'];
        const allCategories = [...new Set([...defaultCategories, ...importedData.categories])];
        setCategories(allCategories);
      }

      // Reset filters
      setSearchTerm('');
      setCategoryFilter('all');
      setSortOption('newest');

      console.log('Import successful:', {
        urls: importedData.urls?.length || 0,
        categories: importedData.categories?.length || 0
      });

    } catch (error) {
      console.error('Error processing imported data:', error);
      throw new Error('Failed to process imported data');
    }
  };

  // Search and Filter Functions
  const clearSearch = () => {
    setSearchTerm('');
  };

  // Filter and sort URLs
  const getFilteredAndSortedUrls = () => {
    const filtered = urls.filter(url => {
      const matchesSearch = url.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           url.url.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || url.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });

    return filtered.sort((a, b) => {
      switch (sortOption) {
        case 'newest':
          return b.timestamp - a.timestamp;
        case 'oldest':
          return a.timestamp - b.timestamp;
        case 'alphabetical':
          return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
        case 'url':
          return a.url.toLowerCase().localeCompare(b.url.toLowerCase());
        case 'category':
          return a.category.localeCompare(b.category);
        case 'health': // NEW: Sort by health status
          const aHealth = a.isHealthy === true ? 2 : a.isHealthy === false ? 0 : 1;
          const bHealth = b.isHealthy === true ? 2 : b.isHealthy === false ? 0 : 1;
          return bHealth - aHealth;
        default:
          return 0;
      }
    });
  };

  // Get URL counts by category
  const getUrlCountsByCategory = () => {
    const counts = {};
    urls.forEach(url => {
      counts[url.category] = (counts[url.category] || 0) + 1;
    });
    return counts;
  };

  const filteredAndSortedUrls = getFilteredAndSortedUrls();
  const urlCountsByCategory = getUrlCountsByCategory();

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      
      <Header 
        categoriesCount={categories.length}
        urlsCount={urls.length}
      />

      <AddURLForm 
        categories={categories}
        onAddUrl={addUrl}
      />

      {/* NEW: Health Monitor Component */}
      <HealthMonitor
        urls={urls}
        onHealthUpdate={handleHealthUpdate}
      />

      {/* Export/Import Component */}
      <ExportImport
        urls={urls}
        categories={categories}
        onImportData={handleImportData}
      />

      {urls.length > 0 && (
        <>
          <SearchAndFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            sortOption={sortOption}
            setSortOption={setSortOption}
            categories={categories}
            urlCountsByCategory={urlCountsByCategory}
            urls={urls}
            filteredUrls={filteredAndSortedUrls}
            onClearSearch={clearSearch}
            hasHealthSorting={true} // NEW: Enable health sorting
          />

          <URLList 
            urls={filteredAndSortedUrls}
            allUrls={urls}
            onDeleteUrl={deleteUrl}
            onCopyUrl={copyUrl}
            showHealthIndicators={true} // NEW: Show health indicators in list
          />

          <CategoryManager
            categories={categories}
            urlCountsByCategory={urlCountsByCategory}
            onDeleteCategory={deleteCategory}
          />
        </>
      )}

      <Footer phase="3" feature="URL Health Monitoring" />
    </div>
  );
}

export default App;