import React, { useState } from 'react';
import { Share2, Trash2, ChevronDown, Tag } from 'lucide-react';
import { TouchButton } from './UI';

export const ActionBar = ({
  selectedUrls,
  urls,
  onShare,
  onDelete,
  onChangeCategory,
  categories,
  t,
  isDark,
  isThaiMode,
  themeConfig
}) => {
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  // Don't show action bar if no URLs are selected
  if (selectedUrls.length === 0) {
    return null;
  }

  const handleCategoryChange = (category) => {
    onChangeCategory(category);
    setShowCategoryDropdown(false);
  };

  return (
    <div className={`
      fixed bottom-4 left-4 right-4 z-40 max-w-4xl mx-auto
      ${themeConfig.cardBg} rounded-2xl p-4 border ${themeConfig.cardBorder} 
      shadow-2xl backdrop-blur-xl
    `}>
      <div className="flex items-center justify-between">
        {/* Selected count */}
        <div className="flex items-center gap-3">
          <div className={`
            w-10 h-10 rounded-xl bg-gradient-to-r ${themeConfig.accent} 
            flex items-center justify-center text-white font-bold
          `}>
            {selectedUrls.length}
          </div>
          <div>
            <p className={`font-semibold ${themeConfig.text}`}>
              {selectedUrls.length} {t.selected}
            </p>
            <p className={`text-sm ${themeConfig.textSecondary}`}>
              {t.actions}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {/* Category change dropdown */}
          <div className="relative">
            <TouchButton
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              variant="secondary"
              size="sm"
              isDark={isDark}
              className="flex items-center gap-2"
            >
              <Tag size={16} />
              {t.changeCategory}
              <ChevronDown size={16} />
            </TouchButton>

            {/* Category dropdown */}
            {showCategoryDropdown && (
              <div className={`
                absolute bottom-full mb-2 left-0 min-w-48
                ${themeConfig.cardBg} rounded-xl border ${themeConfig.cardBorder}
                shadow-xl backdrop-blur-xl z-50 max-h-48 overflow-y-auto
              `}>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className={`
                      w-full text-left px-4 py-3 hover:bg-gray-50/50 dark:hover:bg-gray-700/30
                      transition-colors duration-200 first:rounded-t-xl last:rounded-b-xl
                      ${themeConfig.text}
                    `}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Share button */}
          <TouchButton
            onClick={onShare}
            variant="primary"
            size="sm"
            isDark={isDark}
            isThaiMode={isThaiMode}
          >
            <Share2 size={16} />
            {t.share}
          </TouchButton>

          {/* Delete button */}
          <TouchButton
            onClick={onDelete}
            variant="danger"
            size="sm"
            isDark={isDark}
          >
            <Trash2 size={16} />
            {t.delete}
          </TouchButton>
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {showCategoryDropdown && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => setShowCategoryDropdown(false)}
        />
      )}
    </div>
  );
};