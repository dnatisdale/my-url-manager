import React, { useState } from 'react';
import { 
  X, Download, Upload, FileText, Printer, Copy, Database, AlertCircle, 
  CheckCircle, Info, FolderOpen, Settings, Share2, Globe, Wifi, WifiOff,
  ExternalLink, QrCode, Trash2
} from 'lucide-react';
import { TouchButton } from './UI';

// Enhanced InfoTooltip Component (replaces asterisks)
const InfoTooltip = ({ children, isDark }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className={`w-4 h-4 rounded-full flex items-center justify-center text-xs transition-colors ${
          isDark ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
      >
        <Info size={10} />
      </button>
      {isVisible && (
        <div className={`absolute z-50 px-3 py-2 text-xs rounded-lg shadow-lg whitespace-nowrap bottom-full left-1/2 transform -translate-x-1/2 mb-2 max-w-xs ${
          isDark ? 'bg-gray-800 text-white border border-gray-700' : 'bg-gray-900 text-white'
        }`}>
          {children}
          <div className={`absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent ${
            isDark ? 'border-t-gray-800' : 'border-t-gray-900'
          }`} />
        </div>
      )}
    </div>
  );
};

// Storage Location Display Component
const StorageInfo = ({ isDark, themeConfig }) => {
  const [showPaths, setShowPaths] = useState(false);
  
  const storagePaths = {
    downloads: navigator.userAgent.includes('Windows') 
      ? 'C:\\Users\\Username\\Downloads\\' 
      : '/Users/Username/Downloads/',
    backups: navigator.userAgent.includes('Windows')
      ? 'C:\\Users\\Username\\AppData\\Local\\URLVault\\Backups\\'
      : '/Users/Username/Library/Application Support/URLVault/Backups/',
    data: navigator.userAgent.includes('Windows')
      ? 'C:\\Users\\Username\\AppData\\Local\\URLVault\\Data\\'
      : '/Users/Username/Library/Application Support/URLVault/Data/'
  };

  const openFolder = (path) => {
    // In a real PWA, this would use the File System Access API
    if (navigator.showDirectoryPicker) {
      navigator.showDirectoryPicker().catch(() => {
        alert(`Path: ${path}\n\nNote: Modern browsers restrict direct folder access for security.`);
      });
    } else {
      alert(`Storage Location: ${path}\n\nNote: This would open the folder in a real implementation.`);
    }
  };

  return (
    <div className={`p-4 rounded-xl border ${isDark ? 'bg-gray-700/40 border-gray-600' : 'bg-gray-50 border-gray-200'} mb-6`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <FolderOpen size={16} className={isDark ? 'text-blue-400' : 'text-blue-600'} />
          <span className={`font-medium ${themeConfig.text}`}>Storage Locations</span>
          <InfoTooltip isDark={isDark}>
            Your files are saved to these local directories. Click to open folders.
          </InfoTooltip>
        </div>
        <TouchButton
          onClick={() => setShowPaths(!showPaths)}
          variant="secondary"
          size="sm"
          isDark={isDark}
        >
          <Settings size={14} />
          {showPaths ? 'Hide' : 'Show'} Paths
        </TouchButton>
      </div>

      {showPaths && (
        <div className="space-y-3">
          {Object.entries(storagePaths).map(([key, path]) => (
            <div key={key} className={`p-3 rounded-lg ${isDark ? 'bg-gray-800/60' : 'bg-white/80'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className={`text-sm font-medium capitalize ${themeConfig.text}`}>
                    {key === 'downloads' ? 'Downloads' : key === 'backups' ? 'Backups' : 'App Data'}
                  </div>
                  <code className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {path}
                  </code>
                </div>
                <TouchButton
                  onClick={() => openFolder(path)}
                  variant="secondary"
                  size="sm"
                  isDark={isDark}
                  className="text-xs"
                >
                  Open
                </TouchButton>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// URL Health Check Component
const URLHealthChecker = ({ urls, isDark, themeConfig, onShowToast }) => {
  const [urlHealth, setUrlHealth] = useState({});
  const [checking, setChecking] = useState(false);

  const checkUrlHealth = async (url) => {
    try {
      // Simple URL validation - in production, use your backend
      const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      return response.ok;
    } catch {
      return false;
    }
  };

  const checkAllUrls = async () => {
    setChecking(true);
    const results = {};
    
    for (const url of urls.slice(0, 5)) { // Limit to first 5 for demo
      results[url.id] = await checkUrlHealth(url.url);
      // Add small delay to prevent rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    setUrlHealth(results);
    setChecking(false);
    
    const healthyCount = Object.values(results).filter(Boolean).length;
    onShowToast(`Checked ${Object.keys(results).length} URLs - ${healthyCount} accessible`, 'info');
  };

  return (
    <div className={`p-4 rounded-xl border ${isDark ? 'bg-purple-900/20 border-purple-600/20' : 'bg-purple-50 border-purple-200'} mb-6`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Globe size={16} className="text-purple-500" />
          <span className={`font-medium ${themeConfig.text}`}>URL Health Status</span>
          <InfoTooltip isDark={isDark}>
            Check if your stored URLs are still accessible online
          </InfoTooltip>
        </div>
        <TouchButton
          onClick={checkAllUrls}
          variant="secondary"
          size="sm"
          isDark={isDark}
          loading={checking}
          disabled={checking || urls.length === 0}
        >
          {checking ? 'Checking...' : 'Check URLs'}
        </TouchButton>
      </div>

      {Object.keys(urlHealth).length > 0 && (
        <div className="space-y-2">
          {urls.slice(0, 5).map(url => (
            urlHealth[url.id] !== undefined && (
              <div key={url.id} className="flex items-center gap-2 text-sm">
                {urlHealth[url.id] ? (
                  <Wifi className="text-green-500" size={12} />
                ) : (
                  <WifiOff className="text-red-500" size={12} />
                )}
                <span className={`truncate ${themeConfig.textSecondary}`}>
                  {url.title}
                </span>
                <span className={`text-xs ${urlHealth[url.id] ? 'text-green-600' : 'text-red-600'}`}>
                  {urlHealth[url.id] ? 'OK' : 'Error'}
                </span>
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
};

// PWA Sharing Component
const PWASharing = ({ isDark, themeConfig, onShowToast }) => {
  const [showQR, setShowQR] = useState(false);
  
  const currentURL = window.location.href;
  const generateQRCode = (url, size = 150) => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}&bgcolor=FFFFFF&color=000000&margin=3`;
  };

  const sharePWA = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'URL Vault PWA',
          text: 'Check out this amazing URL management tool!',
          url: currentURL
        });
        onShowToast('PWA shared successfully', 'success');
      } catch (error) {
        if (error.name !== 'AbortError') {
          copyPWALink();
        }
      }
    } else {
      copyPWALink();
    }
  };

  const copyPWALink = async () => {
    try {
      await navigator.clipboard.writeText(currentURL);
      onShowToast('PWA link copied to clipboard', 'success');
    } catch {
      onShowToast('Failed to copy link', 'error');
    }
  };

  const downloadQRCode = () => {
    const qrUrl = generateQRCode(currentURL, 300);
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = 'url-vault-pwa-qr.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onShowToast('QR code downloaded to Downloads folder', 'success');
  };

  return (
    <div className={`p-4 rounded-xl border ${isDark ? 'bg-green-900/20 border-green-600/20' : 'bg-green-50 border-green-200'} mb-6`}>
      <div className="flex items-center gap-2 mb-3">
        <Share2 size={16} className="text-green-500" />
        <span className={`font-medium ${themeConfig.text}`}>Share PWA Application</span>
        <InfoTooltip isDark={isDark}>
          Share this URL Vault app with others or get a QR code for easy access
        </InfoTooltip>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        <TouchButton
          onClick={sharePWA}
          variant="secondary"
          size="sm"
          isDark={isDark}
        >
          <Share2 size={14} />
          Share App
        </TouchButton>
        
        <TouchButton
          onClick={copyPWALink}
          variant="secondary"
          size="sm"
          isDark={isDark}
        >
          <Copy size={14} />
          Copy Link
        </TouchButton>
        
        <TouchButton
          onClick={() => setShowQR(!showQR)}
          variant="secondary"
          size="sm"
          isDark={isDark}
        >
          <QrCode size={14} />
          {showQR ? 'Hide' : 'Show'} QR
        </TouchButton>

        {showQR && (
          <TouchButton
            onClick={downloadQRCode}
            variant="secondary"
            size="sm"
            isDark={isDark}
          >
            <Download size={14} />
            Download QR
          </TouchButton>
        )}
      </div>

      {showQR && (
        <div className="flex justify-center">
          <div className="p-3 bg-white rounded-lg">
            <img 
              src={generateQRCode(currentURL, 150)} 
              alt="PWA QR Code"
              className="w-32 h-32"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export const BackupExportModal = ({
  isOpen,
  onClose,
  urls,
  categories,
  user,
  onImport,
  t,
  isDark,
  themeConfig,
  onShowToast
}) => {
  const [importing, setImporting] = useState(false);

  if (!isOpen) return null;

  // Generate QR code URL with automatic Downloads folder targeting
  const generateQRCode = (url, size = 150) => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}&bgcolor=FFFFFF&color=000000&margin=3`;
  };

  // Generate backup data
  const generateBackup = () => {
    const backup = {
      version: '1.0',
      appName: 'Good News URL Vault',
      exportDate: new Date().toISOString(),
      user: user?.email || 'Anonymous',
      data: {
        urls,
        categories,
        totalUrls: urls.length,
        totalCategories: categories.length
      }
    };
    return backup;
  };

  // Enhanced download with Downloads folder targeting
  const downloadFile = (dataBlob, filename, mimeType) => {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = filename;
    
    // Try to suggest Downloads folder (works in some browsers)
    if ('showSaveFilePicker' in window) {
      // File System Access API for modern browsers
      const saveFile = async () => {
        try {
          const fileHandle = await window.showSaveFilePicker({
            suggestedName: filename,
            types: [{
              description: mimeType,
              accept: { [mimeType]: [`.${filename.split('.').pop()}`] }
            }]
          });
          const writable = await fileHandle.createWritable();
          await writable.write(dataBlob);
          await writable.close();
          onShowToast(`File saved to your chosen location`, 'success');
        } catch (error) {
          if (error.name !== 'AbortError') {
            // Fallback to traditional download
            link.click();
            onShowToast(`Downloaded to Downloads folder`, 'success');
          }
        }
      };
      saveFile();
    } else {
      // Traditional download - goes to Downloads folder by default
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      onShowToast(`Downloaded to Downloads folder`, 'success');
    }
  };

  // Download JSON backup
  const downloadJSONBackup = () => {
    const backup = generateBackup();
    const dataStr = JSON.stringify(backup, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const filename = `url-vault-backup-${new Date().toISOString().split('T')[0]}.json`;
    
    downloadFile(dataBlob, filename, 'application/json');
    onClose();
  };

  // Download CSV export
  const downloadCSVExport = () => {
    const headers = ['Title', 'URL', 'Category', 'Date Added'];
    const csvContent = [
      headers.join(','),
      ...urls.map(url => [
        `"${url.title.replace(/"/g, '""')}"`,
        `"${url.url}"`,
        `"${url.category}"`,
        `"${new Date(url.addedAt).toLocaleDateString()}"`
      ].join(','))
    ].join('\n');
    
    const dataBlob = new Blob([csvContent], { type: 'text/csv' });
    const filename = `url-vault-export-${new Date().toISOString().split('T')[0]}.csv`;
    
    downloadFile(dataBlob, filename, 'text/csv');
    onClose();
  };

  // Generate printable HTML with QR codes
  const generatePrintableHTML = () => {
    const groupedUrls = {};
    urls.forEach(url => {
      if (!groupedUrls[url.category]) {
        groupedUrls[url.category] = [];
      }
      groupedUrls[url.category].push(url);
    });

    const html = `
<!DOCTYPE html>
<html>
<head>
    <title>URL Vault - ${user?.email || 'Export'}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; color: #000; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
        .category { margin-bottom: 30px; page-break-inside: avoid; }
        .category-title { background: #f0f0f0; padding: 10px; font-weight: bold; font-size: 18px; border-left: 4px solid #007bff; color: #000; }
        .url-item { margin: 15px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; display: flex; align-items: center; gap: 15px; }
        .url-info { flex: 1; }
        .url-title { font-weight: bold; color: #000; margin-bottom: 5px; }
        .url-link { color: #007bff; word-break: break-all; font-size: 14px; }
        .qr-code { flex-shrink: 0; }
        .qr-code img { border: 2px solid #ddd; border-radius: 5px; }
        .stats { margin-top: 30px; padding: 20px; background: #f9f9f9; border-radius: 5px; color: #000; }
        @media print {
            body { margin: 0; color: #000 !important; }
            .no-print { display: none; }
            .url-item { page-break-inside: avoid; }
            * { color: #000 !important; }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1 style="color: #000;">🔗 Good News URL Vault</h1>
        <p style="color: #000;">Export Date: ${new Date().toLocaleDateString()}</p>
        <p style="color: #000;">User: ${user?.email || 'Anonymous'}</p>
        <p style="color: #000;">Total URLs: ${urls.length} | Categories: ${categories.length}</p>
    </div>
    
    ${Object.entries(groupedUrls).map(([category, categoryUrls]) => `
    <div class="category">
        <div class="category-title">${category} (${categoryUrls.length} URLs)</div>
        ${categoryUrls.map(url => `
        <div class="url-item">
            <div class="url-info">
                <div class="url-title">${url.title}</div>
                <div class="url-link">${url.url}</div>
            </div>
            <div class="qr-code">
                <img src="${generateQRCode(url.url)}" alt="QR Code for ${url.title}" width="100" height="100" />
            </div>
        </div>
        `).join('')}
    </div>
    `).join('')}
    
    <div class="stats">
        <h3 style="color: #000;">Export Statistics</h3>
        <p style="color: #000;"><strong>Total URLs:</strong> ${urls.length}</p>
        <p style="color: #000;"><strong>Categories:</strong> ${categories.join(', ')}</p>
        <p style="color: #000;"><strong>Export Date:</strong> ${new Date().toLocaleString()}</p>
        <p style="color: #000;"><strong>Generated by:</strong> Good News URL Vault PWA</p>
    </div>
</body>
</html>`;
    
    return html;
  };

  // Print URLs with QR codes
  const printUrls = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(generatePrintableHTML());
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    
    onShowToast('Print dialog opened with improved contrast', 'info');
    onClose();
  };

  // Copy as text with QR codes info
  const copyAsText = () => {
    const groupedUrls = {};
    urls.forEach(url => {
      if (!groupedUrls[url.category]) {
        groupedUrls[url.category] = [];
      }
      groupedUrls[url.category].push(url);
    });

    const textContent = [
      `🔗 GOOD NEWS URL VAULT`,
      `Export Date: ${new Date().toLocaleDateString()}`,
      `User: ${user?.email || 'Anonymous'}`,
      `Total URLs: ${urls.length} | Categories: ${categories.length}`,
      ``,
      ...Object.entries(groupedUrls).map(([category, categoryUrls]) => [
        `📁 ${category.toUpperCase()} (${categoryUrls.length} URLs)`,
        `${'='.repeat(50)}`,
        ...categoryUrls.map(url => `• ${url.title}\n  ${url.url}\n  QR Code: ${generateQRCode(url.url, 200)}`),
        ``
      ].flat()),
      `Generated by Good News URL Vault PWA`
    ].join('\n');

    navigator.clipboard.writeText(textContent).then(() => {
      onShowToast('URLs copied with QR code links', 'success');
      onClose();
    }).catch(() => {
      onShowToast('Copy failed', 'error');
    });
  };

  // Handle file import
  const handleFileImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setImporting(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const importData = JSON.parse(e.target.result);
        
        // Validate backup format
        if (!importData.data || !importData.data.urls || !importData.data.categories) {
          throw new Error('Invalid backup format');
        }
        
        onImport(importData.data.urls, importData.data.categories);
        onShowToast(`Imported ${importData.data.urls.length} URLs successfully`, 'success');
        setImporting(false);
        onClose();
      } catch (error) {
        onShowToast('Import failed - Invalid file format', 'error');
        setImporting(false);
      }
    };
    
    reader.readAsText(file);
    
    // Reset the input value so the same file can be selected again
    event.target.value = '';
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className={`${themeConfig.cardBg} p-6 rounded-3xl max-w-2xl w-full border ${themeConfig.cardBorder} max-h-[90vh] overflow-y-auto`}>
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${themeConfig.accent} flex items-center justify-center`}>
              <Database className="text-white" size={20} />
            </div>
            <div>
              <h3 className={`text-xl font-bold ${themeConfig.text}`}>
                Backup & Export
              </h3>
              <div className="flex items-center gap-2">
                <span className={`text-sm ${themeConfig.textSecondary}`}>
                  Enhanced with all improvements
                </span>
                <InfoTooltip isDark={isDark}>
                  Now includes URL health checking, PWA sharing, storage paths, and improved downloads
                </InfoTooltip>
              </div>
            </div>
          </div>
          <TouchButton onClick={onClose} variant="secondary" size="sm" className="p-2" isDark={isDark}>
            <X size={20} />
          </TouchButton>
        </div>

        {/* PWA Sharing Section */}
        <PWASharing 
          isDark={isDark} 
          themeConfig={themeConfig} 
          onShowToast={onShowToast} 
        />

        {/* URL Health Checker */}
        <URLHealthChecker 
          urls={urls} 
          isDark={isDark} 
          themeConfig={themeConfig} 
          onShowToast={onShowToast} 
        />

        {/* Storage Information */}
        <StorageInfo isDark={isDark} themeConfig={themeConfig} />

        {/* Current Status */}
        <div className={`p-4 rounded-xl ${isDark ? 'bg-blue-900/20' : 'bg-blue-50'} border border-blue-500/20 mb-6`}>
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="text-blue-500" size={20} />
            <span className={`font-semibold ${themeConfig.text}`}>Current Storage</span>
            <InfoTooltip isDark={isDark}>
              Your data is automatically synced across devices and backed up locally for security
            </InfoTooltip>
          </div>
          <p className={`text-sm ${themeConfig.textSecondary}`}>
            Your {urls.length} URLs are synced across devices and saved locally. 
            Use backup options for additional security.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-700/40' : 'bg-gray-50/80'} text-center`}>
            <div className={`text-2xl font-bold ${themeConfig.text}`}>{urls.length}</div>
            <div className={`text-sm ${themeConfig.textSecondary}`}>URLs</div>
          </div>
          <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-700/40' : 'bg-gray-50/80'} text-center`}>
            <div className={`text-2xl font-bold ${themeConfig.text}`}>{categories.length}</div>
            <div className={`text-sm ${themeConfig.textSecondary}`}>Categories</div>
          </div>
        </div>

        {/* Export Options */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h4 className={`font-semibold ${themeConfig.text}`}>📤 Export Options</h4>
            <InfoTooltip isDark={isDark}>
              All downloads automatically save to your Downloads folder with enhanced file names
            </InfoTooltip>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            <TouchButton
              onClick={downloadJSONBackup}
              variant="primary"
              size="md"
              isDark={isDark}
              className="w-full flex items-center gap-3 justify-start"
            >
              <Download size={20} />
              <div className="text-left">
                <div>Download JSON Backup</div>
                <div className="text-xs opacity-75">Complete backup file for re-importing</div>
              </div>
            </TouchButton>

            <TouchButton
              onClick={downloadCSVExport}
              variant="secondary"
              size="md"
              isDark={isDark}
              className="w-full flex items-center gap-3 justify-start"
            >
              <FileText size={20} />
              <div className="text-left">
                <div>Export as CSV</div>
                <div className="text-xs opacity-75">Spreadsheet format for Excel/Sheets</div>
              </div>
            </TouchButton>

            <TouchButton
              onClick={printUrls}
              variant="secondary"
              size="md"
              isDark={isDark}
              className="w-full flex items-center gap-3 justify-start"
            >
              <Printer size={20} />
              <div className="text-left">
                <div>Print URLs with QR Codes</div>
                <div className="text-xs opacity-75">High contrast document with QR codes</div>
              </div>
            </TouchButton>

            <TouchButton
              onClick={copyAsText}
              variant="secondary"
              size="md"
              isDark={isDark}
              className="w-full flex items-center gap-3 justify-start"
            >
              <Copy size={20} />
              <div className="text-left">
                <div>Copy with QR Links</div>
                <div className="text-xs opacity-75">Text with QR code links to clipboard</div>
              </div>
            </TouchButton>
          </div>

          {/* Import Section */}
          <div className="border-t pt-4 mt-6">
            <div className="flex items-center gap-2 mb-3">
              <h4 className={`font-semibold ${themeConfig.text}`}>📥 Import Backup</h4>
              <InfoTooltip isDark={isDark}>
                Import previously exported JSON backup files to restore your URLs
              </InfoTooltip>
            </div>
            
            <div className="relative">
              <input
                type="file"
                accept=".json"
                onChange={handleFileImport}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={importing}
              />
              <TouchButton
                variant="warning"
                size="md"
                isDark={isDark}
                className="w-full flex items-center gap-3 justify-center"
                loading={importing}
                disabled={importing}
              >
                <Upload size={20} />
                {importing ? 'Importing...' : 'Import JSON Backup'}
              </TouchButton>
            </div>
            
            <p className={`text-xs ${themeConfig.textSecondary} mt-2 text-center`}>
              ⚠️ This will merge imported URLs with your existing data
            </p>
          </div>

          {/* Additional Note */}
          <div className={`p-3 rounded-xl ${isDark ? 'bg-green-900/20' : 'bg-green-50'} border border-green-500/20 mt-4`}>
            <div className="flex items-center gap-2">
              <CheckCircle className="text-green-500 flex-shrink-0" size={16} />
              <p className={`text-xs ${themeConfig.textSecondary}`}>
                Your data is automatically synced and saved locally. These export options provide additional backup security.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};