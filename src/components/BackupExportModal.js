import React, { useState } from 'react';
import { X, Download, FileText, Database, Printer } from 'lucide-react';
import { InfoTooltip } from './InfoTooltip';

export const BackupExportModal = ({ 
  isOpen, 
  onClose, 
  urls, 
  onExport,
  translations 
}) => {
  const [exportFormat, setExportFormat] = useState('json');
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [includeHealthStatus, setIncludeHealthStatus] = useState(true);

  if (!isOpen) return null;

  const handleExport = () => {
    const exportData = {
      format: exportFormat,
      includeMetadata,
      includeHealthStatus,
      timestamp: new Date().toISOString(),
      urls: urls
    };
    
    onExport(exportData);
  };

  const getHealthyUrlsCount = () => {
    return urls.filter(url => url.isHealthy !== false).length;
  };

  const getUnhealthyUrlsCount = () => {
    return urls.filter(url => url.isHealthy === false).length;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-lg w-full mx-4 shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-black dark:text-white">
            {translations?.backup?.title || 'Backup & Export'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Data Overview */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Database size={18} className="text-blue-600 dark:text-blue-400" />
              <h3 className="font-medium text-black dark:text-white">
                Data Overview
              </h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">Total URLs:</span>
                <span className="ml-2 font-medium text-black dark:text-white">
                  {urls.length}
                </span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Categories:</span>
                <span className="ml-2 font-medium text-black dark:text-white">
                  {new Set(urls.map(url => url.category).filter(Boolean)).size}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-gray-600 dark:text-gray-400">Healthy:</span>
                <span className="ml-2 font-medium text-green-600 dark:text-green-400">
                  {getHealthyUrlsCount()}
                </span>
                <InfoTooltip 
                  content="URLs that are accessible and responding correctly"
                  iconSize={14}
                />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-gray-600 dark:text-gray-400">Issues:</span>
                <span className="ml-2 font-medium text-red-600 dark:text-red-400">
                  {getUnhealthyUrlsCount()}
                </span>
                <InfoTooltip 
                  content="URLs that may be inaccessible or have connection issues"
                  iconSize={14}
                />
              </div>
            </div>
          </div>

          {/* Export Format */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FileText size={18} className="text-purple-600 dark:text-purple-400" />
              <label className="font-medium text-black dark:text-white">
                Export Format
              </label>
              <InfoTooltip 
                content="Choose the file format for your exported data. JSON preserves all data structure, CSV is spreadsheet-friendly."
                iconSize={14}
              />
            </div>
            
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="format"
                  value="json"
                  checked={exportFormat === 'json'}
                  onChange={(e) => setExportFormat(e.target.value)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <div className="font-medium text-black dark:text-white">JSON</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Complete data with all metadata and structure
                  </div>
                </div>
              </label>
              
              <label className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="format"
                  value="csv"
                  checked={exportFormat === 'csv'}
                  onChange={(e) => setExportFormat(e.target.value)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <div className="font-medium text-black dark:text-white">CSV</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Spreadsheet format for easy analysis
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Export Options */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <h3 className="font-medium text-black dark:text-white">
                Export Options
              </h3>
            </div>
            
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeMetadata}
                  onChange={(e) => setIncludeMetadata(e.target.checked)}
                  className="text-blue-600 focus:ring-blue-500 rounded"
                />
                <span className="text-black dark:text-white">Include metadata</span>
                <InfoTooltip 
                  content="Includes creation dates, tags, notes, and other additional information"
                  iconSize={14}
                />
              </label>
              
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeHealthStatus}
                  onChange={(e) => setIncludeHealthStatus(e.target.checked)}
                  className="text-blue-600 focus:ring-blue-500 rounded"
                />
                <span className="text-black dark:text-white">Include health status</span>
                <InfoTooltip 
                  content="Includes URL accessibility status and last check timestamp"
                  iconSize={14}
                />
              </label>
            </div>
          </div>

          {/* Storage Location Info */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <Download size={16} className="text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                  Download Location
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-400">
                  Files will be saved to your Downloads folder automatically
                </p>
              </div>
            </div>
          </div>

          {/* Print Option */}
          <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <Printer size={16} className="text-gray-600 dark:text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-black dark:text-white">
                  Print-Friendly Format
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Exported files use high-contrast black text for better printing
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 rounded-lg transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
          >
            <Download size={18} />
            Export Data
          </button>
        </div>
      </div>
    </div>
  );
};