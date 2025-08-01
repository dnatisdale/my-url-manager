import React, { useState } from 'react';
import { Database, Tag, Edit3, Trash2, QrCode, ExternalLink, Copy, Share2, Check, X, Save } from 'lucide-react';
import { TouchButton } from './UI';

export const URLListSection = ({
  // Data
  groupedUrls,
  selectedUrls,
  t,
  themeConfig,
  isDarkMode,
  isThaiMode,
  
  // URL actions
  toggleUrlSelection,
  openShareModal,
  copyToClipboard,
  openConfirmModal,
  setUrls,
  showToast,
  
  // Category actions
  setCategoryModal
}) => {
  
  const [editingUrl, setEditingUrl] = useState(null);
  const [editValue, setEditValue] = useState('');

  const handleEditUrl = (url) => {
    setEditingUrl(url.id);
    setEditValue(url.url);
  };

  const handleSaveEdit = (urlId) => {
    setUrls(prev => prev.map(url => 
      url.id === urlId 
        ? { ...url, url: editValue, title: extractDomain(editValue) }
        : url
    ));
    setEditingUrl(null);
    setEditValue('');
    showToast('URL updated successfully', 'success');
  };

  const handleCancelEdit = () => {
    setEditingUrl(null);
    setEditValue('');
  };

  const extractDomain = (url) => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return url;
    }
  };

  const handleDeleteUrl = (url) => {
    openConfirmModal(
      'Delete URL',
      `Are you sure you want to delete "${url.title}"? This action cannot be undone.`,
      () => {
        setUrls(prev => prev.filter(u => u.id !== url.id));
        showToast('URL deleted', 'success');
      }
    );
  };

  return (
    <div className="space-y-4">
      {Object.keys(groupedUrls).length === 0 ? (
        // Empty State
        <div className={`${themeConfig.cardBg} rounded-3xl p-12 border ${themeConfig.cardBorder} text-center`}>
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
            onClick={() => {}}
            variant="primary"
            size="lg"
            isDark={isDarkMode}
            isThaiMode={isThaiMode}
          >
            <Database size={20} />
            {t.addFirstUrl}
          </TouchButton>
        </div>
      ) : (
        // URLs Grouped by Categories
        Object.entries(groupedUrls).map(([category, categoryUrls]) => (
          <div key={category} className={`${themeConfig.cardBg} rounded-3xl border ${themeConfig.cardBorder} overflow-hidden`}>
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
                    title={t.editCategory}
                  >
                    <Edit3 size={16} />
                  </TouchButton>
                  
                  <TouchButton
                    onClick={() => setCategoryModal({ isOpen: true, mode: 'delete', category })}
                    variant="danger"
                    size="sm"
                    className="p-2"
                    isDark={isDarkMode}
                    title={t.deleteCategory}
                  >
                    <Trash2 size={16} />
                  </TouchButton>
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
                      className={`p-2 ${selectedUrls.includes(url.id) ? (isDarkMode ? 'bg-blue-500 text-white' : 'bg-blue-500 text-white') : ''}`}
                      isDark={isDarkMode}
                    >
                      {selectedUrls.includes(url.id) ? (
                        <Check size={16} className="text-white" />
                      ) : (
                        <div className={`w-4 h-4 border-2 rounded ${isDarkMode ? 'border-gray-400' : 'border-gray-600'}`}></div>
                      )}
                    </TouchButton>

                    {/* URL Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-semibold ${themeConfig.text} truncate`}>
                        {url.title}
                      </h4>
                      {editingUrl === url.id ? (
                        <div className="flex gap-2 mt-2">
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className={`flex-1 p-2 border rounded ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') handleSaveEdit(url.id);
                              if (e.key === 'Escape') handleCancelEdit();
                            }}
                            autoFocus
                          />
                          <TouchButton
                            onClick={() => handleSaveEdit(url.id)}
                            variant="success"
                            size="sm"
                            isDark={isDarkMode}
                            title="Save"
                          >
                            <Save size={16} />
                          </TouchButton>
                          <TouchButton
                            onClick={handleCancelEdit}
                            variant="secondary"
                            size="sm"
                            isDark={isDarkMode}
                            title="Cancel"
                          >
                            <X size={16} />
                          </TouchButton>
                        </div>
                      ) : (
                        <p className={`text-sm ${themeConfig.textSecondary} truncate`}>
                          {url.url}
                        </p>
                      )}
                    </div>

                    {/* Action Buttons */}
                    {editingUrl !== url.id && (
                      <div className="flex items-center gap-2">
                        <TouchButton
                          onClick={() => handleEditUrl(url)}
                          variant="secondary"
                          size="sm"
                          className="p-2"
                          isDark={isDarkMode}
                          title={t.editUrl}
                        >
                          <Edit3 size={16} />
                        </TouchButton>

                        <TouchButton
                          onClick={() => openShareModal(url.url, url.title, true)}
                          variant="secondary"
                          size="sm"
                          className="p-2"
                          isDark={isDarkMode}
                          title={t.showQrCode}
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
                          title={t.openUrl}
                        >
                          <ExternalLink size={16} />
                        </TouchButton>

                        <TouchButton
                          onClick={() => copyToClipboard(url.url)}
                          variant="secondary"
                          size="sm"
                          className="p-2"
                          isDark={isDarkMode}
                          title={t.copyUrl}
                        >
                          <Copy size={16} />
                        </TouchButton>

                        <TouchButton
                          onClick={() => openShareModal(url.url, url.title, false)}
                          variant="secondary"
                          size="sm"
                          className="p-2"
                          isDark={isDarkMode}
                          title={t.shareUrl}
                        >
                          <Share2 size={16} />
                        </TouchButton>

                        <TouchButton
                          onClick={() => handleDeleteUrl(url)}
                          variant="danger"
                          size="sm"
                          className="p-2"
                          isDark={isDarkMode}
                          title={t.deleteUrl}
                        >
                          <Trash2 size={16} />
                        </TouchButton>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};