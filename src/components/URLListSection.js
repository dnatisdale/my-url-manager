import React, { useState, useEffect } from 'react';
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
  CheckCircle2
} from 'lucide-react';
import { URLHealthIndicator, URLHealthBadge } from './URLHealthIndicator';
import { urlHealthService, useURLHealth } from '../services/URLHealthService';
import { InfoTooltip } from './InfoTooltip';

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
  const [healthFilter, setHealthFilter] = useState('all'); // all, healthy, unhealthy, unknown
  const [isCheckingAll, setIsCheckingAll] = useState(false);
  const [lastBulkCheck, setLastBulkCheck] = useState(null);

  // Get health data for all URLs
  const urlList = urls.map(url => url.url);
  const { healthData, isChecking, checkURL, checkAllURLs, getHealthStats } = useURLHealth(urlList);

  // Initialize health service with existing URLs
  useEffect(() => {
    urls.forEach(url => {
      if (url.healthData && !urlHealthService.healthCache.has(url.url)) {
        urlHealthService.healthCache.set(url.url, {
          ...url.healthData,
          lastChecked: url.lastHealthCheck || new Date().toISOString()
        });
      }
    });
  }, [urls]);

  // Filter and sort URLs
  const filteredAndSortedUrls = React.useMemo(() => {
    let filtered = urls.filter(url => {
      // Text search
      const matchesSearch = !searchTerm || 
        url.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        url.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (url.description && url.description.toLowerCase().includes(searchTerm.toLowerCase()));

      // Category filter
      const matchesCategory = !selectedCategory || url.category === selectedCategory;

      // Health filter
      const urlHealth = healthData.get(url.url);
      const matchesHealth = healthFilter === 'all' || 
        (healthFilter === 'healthy' && urlHealth?.isHealthy === true) ||
        (healthFilter === 'unhealthy' && urlHealth?.isHealthy === false) ||
        (healthFilter === 'unknown' && (!urlHealth || urlHealth.isHealthy === null));

      return matchesSearch && matchesCategory && matchesHealth;
    });

    // Sort URLs
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'category':
          aValue = a.category || '';
          bValue = b.category || '';
          break;
        case 'health':
          const aHealth = healthData.get(a.url);
          const bHealth = healthData.get(b.url);
          aValue = aHealth?.isHealthy === true ? 2 : aHealth?.isHealthy === false ? 0 : 1;
          bValue = bHealth?.isHealthy === true ? 2 : bHealth?.isHealthy === false ? 0 : 1;
          break;
        case 'responseTime':
          const aTime = healthData.get(a.url)?.responseTime || 9999;
          const bTime = healthData.get(b.url)?.responseTime || 9999;
          aValue = aTime;
          bValue = bTime;
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
  }, [urls, searchTerm, selectedCategory, healthFilter, sortBy, sortOrder, healthData]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleBulkHealthCheck = async () => {
    if (isCheckingAll || urlList.length === 0) return;

    setIsCheckingAll(true);
    try {
      await checkAllURLs();
      setLastBulkCheck(new Date());
    } finally {
      setIsCheckingAll(false);
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

  const healthStats = getHealthStats();

  return (
    <div className="space-y-4">
      {/* Header with Stats and Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Health Statistics */}
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold text-black dark:text-white">
              URL Collection ({filteredAndSortedUrls.length})
            </h3>
            
            {healthStats.total > 0 && (
              <div className="flex items-center gap-3 text-sm">
                <div className="flex items-center gap-1">
                  <CheckCircle2 size={14} className="text-green-500" />
                  <span className="text-green-600 dark:text-green-400 font-medium">
                    {healthStats.healthy}
                  </span>
                  <InfoTooltip content="Healthy URLs that are accessible" iconSize={12} />
                </div>
                
                <div className="flex items-center gap-1">
                  <AlertTriangle size={14} className="text-red-500" />
                  <span className="text-red-600 dark:text-red-400 font-medium">
                    {healthStats.unhealthy}
                  </span>
                  <InfoTooltip content="URLs with accessibility issues" iconSize={12} />
                </div>

                <div className="text-gray-600 dark:text-gray-400">
                  ({healthStats.healthyPercentage}% healthy)
                </div>
              </div>
            )}
          </div>

          {/* Bulk Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleBulkHealthCheck}
              disabled={isCheckingAll || urlList.length === 0}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors text-sm font-medium"
            >
              <RefreshCw size={16} className={isCheckingAll ? 'animate-spin' : ''} />
              {isCheckingAll ? 'Checking...' : 'Check All URLs'}
            </button>

            {lastBulkCheck && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Last checked: {lastBulkCheck.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>

        {/* Filters and Sorting */}
        <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          {/* Health Filter */}
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-500" />
            <select
              value={healthFilter}
              onChange={(e) => setHealthFilter(e.target.value)}
              className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 bg-white dark:bg-gray-700 text-black dark:text-white"
            >
              <option value="all">All URLs</option>
              <option value="healthy">Healthy Only</option>
              <option value="unhealthy">Issues Only</option>
              <option value="unknown">Unknown Status</option>
            </select>
          </div>

          {/* Sort Options */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Sort by:</span>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field);
                setSortOrder(order);
              }}
              className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 bg-white dark:bg-gray-700 text-black dark:text-white"
            >
              <option value="dateAdded-desc">Newest First</option>
              <option value="dateAdded-asc">Oldest First</option>
              <option value="title-asc">Title A-Z</option>
              <option value="title-desc">Title Z-A</option>
              <option value="health-desc">Healthy First</option>
              <option value="health-asc">Issues First</option>
              <option value="responseTime-asc">Fastest Response</option>
              <option value="responseTime-desc">Slowest Response</option>
              <option value="category-asc">Category A-Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* URL List */}
      {filteredAndSortedUrls.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
          <Search size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-black dark:text-white mb-2">
            No URLs found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {searchTerm || selectedCategory || healthFilter !== 'all'
              ? 'Try adjusting your filters or search terms'
              : 'Start building your URL collection by adding your first URL above'}
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filteredAndSortedUrls.map((url) => {
            const urlHealth = healthData.get(url.url);
            
            return (
              <div
                key={url.id}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-3">
                  {/* Health Indicator */}
                  <div className="flex-shrink-0 pt-1">
                    <URLHealthIndicator
                      url={url.url}
                      healthData={urlHealth}
                      onRecheck={checkURL}
                      size="md"
                      showDetails={false}
                      showLastChecked={true}
                    />
                  </div>

                  {/* URL Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        {/* Title and Health Badge */}
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-lg font-medium text-black dark:text-white truncate">
                            {url.title}
                          </h4>
                          <URLHealthBadge healthData={urlHealth} size="sm" />
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
                          <span>Added: {new Date(url.dateAdded).toLocaleDateString()}</span>
                          
                          {urlHealth?.responseTime && (
                            <span>Response: {urlHealth.responseTime}ms</span>
                          )}
                          
                          {urlHealth?.lastChecked && (
                            <span>
                              Checked: {new Date(urlHealth.lastChecked).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          onClick={() => handleCopyURL(url.url)}
                          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          title="Copy URL"
                        >
                          <Copy size={16} />
                        </button>

                        <button
                          onClick={() => onGenerateQR?.(url)}
                          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          title="Generate QR Code"
                        >
                          <QrCode size={16} />
                        </button>

                        <button
                          onClick={() => onEditURL?.(url)}
                          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          title="Edit URL"
                        >
                          <Edit size={16} />
                        </button>

                        <button
                          onClick={() => onDeleteURL?.(url.id)}
                          className="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Delete URL"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Detailed Health Info (Expandable) */}
                    {urlHealth && urlHealth.isHealthy === false && (
                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                        <URLHealthIndicator
                          url={url.url}
                          healthData={urlHealth}
                          onRecheck={checkURL}
                          size="sm"
                          showDetails={true}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Health Check Progress */}
      {(isChecking || isCheckingAll) && (
        <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 min-w-[250px]">
          <div className="flex items-center gap-3">
            <Loader2 size={20} className="animate-spin text-blue-500" />
            <div>
              <p className="text-sm font-medium text-black dark:text-white">
                Checking URL Health
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Please wait while we verify URL accessibility...
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};