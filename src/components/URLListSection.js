import React, { useState } from 'react';
import { 
  ExternalLink, 
  Edit, 
  Trash2, 
  Copy, 
  QrCode,
  RefreshCw,
  Filter,
  Search,
  AlertTriangle,
  CheckCircle2,
  Loader2  // Added this import to fix the error
} from 'lucide-react';

export const URLListSection = ({ 
  urls = [], 
  onEditURL, 
  onDeleteURL, 
  onGenerateQR,
  searchTerm = '',
  selectedCategory = '',
  translations = {},
  theme = 'light'
}) => {
  const [sortBy, setSortBy] = useState('dateAdded');
  const [sortOrder, setSortOrder] = useState('desc');
  const [isCheckingAll, setIsCheckingAll] = useState(false);

  // Filter and sort URLs
  const filteredAndSortedUrls = React.useMemo(() => {
    let filtered = urls.filter(url => {
      // Text search
      const matchesSearch = !searchTerm || 
        url.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        url.url?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (url.description && url.description.toLowerCase().includes(searchTerm.toLowerCase()));

      // Category filter
      const matchesCategory = !selectedCategory || url.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    // Sort URLs
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'title':
          aValue = a.title?.toLowerCase() || '';
          bValue = b.title?.toLowerCase() || '';
          break;
        case 'category':
          aValue = a.category || '';
          bValue = b.category || '';
          break;
        case 'dateAdded':
        default:
          aValue = new Date(a.dateAdded || 0);
          bValue = new Date(b.dateAdded || 0);
          break;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [urls, searchTerm, selectedCategory, sortBy, sortOrder]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleCopyURL = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      // You might want to show a toast notification here
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  };

  const handleOpenURL = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-4">
      {/* Header with Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold text-black dark:text-white">
              {translations.urls || 'URLs'} ({filteredAndSortedUrls.length})
            </h3>
          </div>

          {/* Sort Options */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {translations.sortBy || 'Sort by'}:
            </span>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field);
                setSortOrder(order);
              }}
              className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 bg-white dark:bg-gray-700 text-black dark:text-white"
            >
              <option value="dateAdded-desc">{translations.newestFirst || 'Newest First'}</option>
              <option value="dateAdded-asc">{translations.oldestFirst || 'Oldest First'}</option>
              <option value="title-asc">{translations.titleAZ || 'Title A-Z'}</option>
              <option value="title-desc">{translations.titleZA || 'Title Z-A'}</option>
              <option value="category-asc">{translations.categoryAZ || 'Category A-Z'}</option>
            </select>
          </div>
        </div>
      </div>

      {/* URL List */}
      {filteredAndSortedUrls.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
          <Search size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-black dark:text-white mb-2">
            {translations.noUrlsFound || 'No URLs found'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {searchTerm || selectedCategory
              ? (translations.tryAdjustingFilters || 'Try adjusting your filters or search terms')
              : (translations.addFirstUrl || 'Start building your URL collection by adding your first URL above')
            }
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filteredAndSortedUrls.map((url) => (
            <div
              key={url.id}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3">
                {/* URL Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      {/* Title */}
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-lg font-medium text-black dark:text-white truncate">
                          {url.title || url.url}
                        </h4>
                      </div>

                      {/* URL */}
                      <div className="flex items-center gap-2 mb-2">
                        <button
                          onClick={() => handleOpenURL(url.url)}
                          className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm truncate flex-1 text-left hover:underline"
                        >
                          {url.url}
                        </button>
                        <ExternalLink size={12} className="text-gray-400 flex-shrink-0" />
                      </div>

                      {/* Category and Description */}
                      <div className="space-y-1">
                        {url.category && (
                          <span className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full">
                            {url.category}
                          </span>
                        )}
                        
                        {url.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {url.description}
                          </p>
                        )}
                      </div>

                      {/* Metadata */}
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                        <span>
                          {translations.added || 'Added'}: {new Date(url.dateAdded).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => handleCopyURL(url.url)}
                        className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        title={translations.copyUrl || "Copy URL"}
                      >
                        <Copy size={16} />
                      </button>

                      {onGenerateQR && (
                        <button
                          onClick={() => onGenerateQR(url)}
                          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          title={translations.showQrCode || "Generate QR Code"}
                        >
                          <QrCode size={16} />
                        </button>
                      )}

                      {onEditURL && (
                        <button
                          onClick={() => onEditURL(url)}
                          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          title={translations.editUrl || "Edit URL"}
                        >
                          <Edit size={16} />
                        </button>
                      )}

                      {onDeleteURL && (
                        <button
                          onClick={() => onDeleteURL(url.id)}
                          className="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title={translations.deleteUrl || "Delete URL"}
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Loading indicator for future health checks */}
      {isCheckingAll && (
        <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 min-w-[250px]">
          <div className="flex items-center gap-3">
            <Loader2 size={20} className="animate-spin text-blue-500" />
            <div>
              <p className="text-sm font-medium text-black dark:text-white">
                {translations.checkingUrls || 'Checking URLs'}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {translations.pleaseWait || 'Please wait...'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};