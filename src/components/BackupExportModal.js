import React, { useState } from 'react';
import { X, Download, Upload, FileText, Printer, Copy, Database, AlertCircle, CheckCircle } from 'lucide-react';
import { TouchButton } from './UI';

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

  // Generate QR code URL
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

  // Download JSON backup
  const downloadJSONBackup = () => {
    const backup = generateBackup();
    const dataStr = JSON.stringify(backup, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `url-vault-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    onShowToast('JSON backup downloaded', 'success');
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
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `url-vault-export-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    onShowToast('CSV export downloaded', 'success');
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
        body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
        .category { margin-bottom: 30px; page-break-inside: avoid; }
        .category-title { background: #f0f0f0; padding: 10px; font-weight: bold; font-size: 18px; border-left: 4px solid #007bff; }
        .url-item { margin: 15px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; display: flex; align-items: center; gap: 15px; }
        .url-info { flex: 1; }
        .url-title { font-weight: bold; color: #333; margin-bottom: 5px; }
        .url-link { color: #007bff; word-break: break-all; font-size: 14px; }
        .qr-code { flex-shrink: 0; }
        .qr-code img { border: 2px solid #ddd; border-radius: 5px; }
        .stats { margin-top: 30px; padding: 20px; background: #f9f9f9; border-radius: 5px; }
        @media print {
            body { margin: 0; }
            .no-print { display: none; }
            .url-item { page-break-inside: avoid; }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🔗 Good News URL Vault</h1>
        <p>Export Date: ${new Date().toLocaleDateString()}</p>
        <p>User: ${user?.email || 'Anonymous'}</p>
        <p>Total URLs: ${urls.length} | Categories: ${categories.length}</p>
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
        <h3>Export Statistics</h3>
        <p><strong>Total URLs:</strong> ${urls.length}</p>
        <p><strong>Categories:</strong> ${categories.join(', ')}</p>
        <p><strong>Export Date:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>Generated by:</strong> Good News URL Vault PWA</p>
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
    
    onShowToast('Print dialog opened with QR codes', 'info');
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
      <div className={`${themeConfig.cardBg} p-6 rounded-3xl max-w-lg w-full border ${themeConfig.cardBorder} max-h-[90vh] overflow-y-auto`}>
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${themeConfig.accent} flex items-center justify-center`}>
              <Database className="text-white" size={20} />
            </div>
            <h3 className={`text-xl font-bold ${themeConfig.text}`}>
              Backup & Export
            </h3>
          </div>
          <TouchButton onClick={onClose} variant="secondary" size="sm" className="p-2" isDark={isDark}>
            <X size={20} />
          </TouchButton>
        </div>

        {/* Current Status */}
        <div className={`p-4 rounded-xl ${isDark ? 'bg-blue-900/20' : 'bg-blue-50'} border border-blue-500/20 mb-6`}>
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="text-blue-500" size={20} />
            <span className={`font-semibold ${themeConfig.text}`}>Current Storage</span>
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
          <h4 className={`font-semibold ${themeConfig.text} mb-3`}>📤 Export Options</h4>
          
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
                <div className="text-xs opacity-75">Formatted document with QR codes for each URL</div>
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
            <h4 className={`font-semibold ${themeConfig.text} mb-3`}>📥 Import Backup</h4>
            
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