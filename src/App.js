import React, { useState, useEffect } from 'react';

// Import only your essential components - remove any that might not exist
let HeaderSection, URLInputSection, URLListSection, ActionBar;

try {
  HeaderSection = require('./components/HeaderSection').HeaderSection;
} catch (e) {
  console.warn('HeaderSection not found');
  HeaderSection = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg border p-4 mb-6">
      <h1 className="text-2xl font-bold text-black dark:text-white">URL Manager</h1>
    </div>
  );
}

try {
  URLInputSection = require('./components/URLInputSection').URLInputSection;
} catch (e) {
  console.warn('URLInputSection not found');
  URLInputSection = ({ onAddURL }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg border p-4 mb-6">
      <input 
        type="text" 
        placeholder="Enter URL here..." 
        className="w-full p-2 border rounded"
        onKeyPress={(e) => {
          if (e.key === 'Enter' && e.target.value) {
            onAddURL({
              id: Date.now().toString(),
              url: e.target.value,
              title: e.target.value,
              dateAdded: new Date().toISOString()
            });
            e.target.value = '';
          }
        }}
      />
    </div>
  );
}

try {
  URLListSection = require('./components/URLListSection').URLListSection;
} catch (e) {
  console.warn('URLListSection not found');
  URLListSection = ({ urls = [], onDeleteURL }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg border p-4">
      <h3 className="text-lg font-semibold mb-4 text-black dark:text-white">URLs ({urls.length})</h3>
      {urls.length === 0 ? (
        <p className="text-gray-500">No URLs added yet. Add one above!</p>
      ) : (
        <div className="space-y-2">
          {urls.map(url => (
            <div key={url.id} className="flex items-center justify-between p-2 border rounded">
              <div>
                <div className="font-medium text-black dark:text-white">{url.title}</div>
                <div className="text-sm text-blue-600">{url.url}</div>
              </div>
              <button 
                onClick={() => onDeleteURL(url.id)}
                className="text-red-500 hover:text-red-700 px-2 py-1"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

try {
  ActionBar = require('./components/ActionBar').ActionBar;
} catch (e) {
  console.warn('ActionBar not found');
  ActionBar = ({ searchTerm, onSearch }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg border p-4 mb-6">
      <input 
        type="text"
        placeholder="Search URLs..."
        value={searchTerm}
        onChange={(e) => onSearch(e.target.value)}
        className="w-full p-2 border rounded"
      />
    </div>
  );
}

// Import translations safely
let translations = {
  en: { appTitle: 'URL Manager' },
  th: { appTitle: 'จัดการ URL' }
};

try {
  const importedTranslations = require('./constants/translations').translations;
  translations = importedTranslations;
} catch (e) {
  console.warn('Translations not found, using defaults');
}

function App() {
  const [urls, setUrls] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('en');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get translations
  const t = translations[language] || translations.en;

  // Initialize app
  useEffect(() => {
    try {
      console.log('Initializing app...');
      
      // Load theme
      const savedTheme = localStorage.getItem('url-manager-theme') || 'light';
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
      
      // Load language
      const savedLanguage = localStorage.getItem('url-manager-language') || 'en';
      setLanguage(savedLanguage);
      
      // Load URLs
      const savedUrls = localStorage.getItem('url-manager-urls');
      if (savedUrls) {
        const parsedUrls = JSON.parse(savedUrls);
        setUrls(parsedUrls);
        console.log('Loaded URLs:', parsedUrls.length);
      }
      
      setIsLoading(false);
      console.log('App initialized successfully');
      
    } catch (error) {
      console.error('Error initializing app:', error);
      setError(error.message);
      setIsLoading(false);
    }
  }, []);

  // Save to localStorage
  const saveToLocalStorage = (updatedUrls) => {
    try {
      localStorage.setItem('url-manager-urls', JSON.stringify(updatedUrls));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  // Add URL
  const handleAddURL = (urlData) => {
    try {
      console.log('Adding URL:', urlData);
      const newURL = {
        ...urlData,
        id: urlData.id || Date.now().toString(),
        dateAdded: urlData.dateAdded || new Date().toISOString()
      };
      
      const updatedUrls = [newURL, ...urls];
      setUrls(updatedUrls);
      saveToLocalStorage(updatedUrls);
      console.log('URL added successfully');
    } catch (error) {
      console.error('Error adding URL:', error);
      setError(error.message);
    }
  };

  // Delete URL
  const handleDeleteURL = (urlId) => {
    try {
      console.log('Deleting URL:', urlId);
      const updatedUrls = urls.filter(url => url.id !== urlId);
      setUrls(updatedUrls);
      saveToLocalStorage(updatedUrls);
      console.log('URL deleted successfully');
    } catch (error) {
      console.error('Error deleting URL:', error);
      setError(error.message);
    }
  };

  // Filter URLs
  const filteredUrls = urls.filter(url => 
    !searchTerm || 
    url.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    url.url?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Theme toggle
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    localStorage.setItem('url-manager-theme', newTheme);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-red-800 mb-4">Error</h1>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-200 ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          
          {/* Debug Info */}
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
            <strong>Debug Info:</strong> App loaded successfully. URLs: {urls.length}, Theme: {theme}, Language: {language}
          </div>

          {/* Theme Toggle */}
          <div className="mb-4">
            <button 
              onClick={toggleTheme}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Toggle {theme === 'light' ? 'Dark' : 'Light'} Mode
            </button>
          </div>

          {/* Header */}
          <HeaderSection
            theme={theme}
            language={language}
            onToggleTheme={toggleTheme}
            translations={t}
            urlCount={urls.length}
          />

          {/* URL Input */}
          <URLInputSection
            onAddURL={handleAddURL}
            translations={t}
            theme={theme}
          />

          {/* Action Bar */}
          <ActionBar
            searchTerm={searchTerm}
            onSearch={setSearchTerm}
            translations={t}
            theme={theme}
          />

          {/* URL List */}
          <URLListSection
            urls={filteredUrls}
            onDeleteURL={handleDeleteURL}
            translations={t}
            theme={theme}
          />

        </div>
      </div>
    </div>
  );
}

export default App;