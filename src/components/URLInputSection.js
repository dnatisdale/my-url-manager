import React from 'react';
import { Save } from 'lucide-react';
import { TouchButton } from './UI';

export const URLInputSection = ({
  t,
  themeConfig,
  isDarkMode,
  isThaiMode,
  currentUrl,
  setCurrentUrl,
  addUrl,
  handleUrlKeyPress
}) => {
  return (
    <div className={`${themeConfig.cardBg} rounded-3xl p-6 border ${themeConfig.cardBorder}`}>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${themeConfig.accent} flex items-center justify-center`}>
            <Save className="text-white" size={20} />
          </div>
          <div>
            <h3 className={`text-lg font-semibold ${themeConfig.text}`}>
              {t.addUrl}
            </h3>
            <p className={`text-sm ${themeConfig.textSecondary}`}>
              {isThaiMode ? t.savedLocally : t.syncedToCloud}
            </p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <span className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${themeConfig.textSecondary} opacity-60 font-medium`}>
              https://
            </span>
            <input
              type="text"
              value={currentUrl}
              onChange={(e) => setCurrentUrl(e.target.value)}
              onKeyPress={handleUrlKeyPress}
              placeholder="example.com"
              className={`
                w-full pl-20 pr-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent
                transition-all duration-300 font-medium
                ${isDarkMode 
                  ? 'border-purple-500/30 focus:ring-purple-500/30 bg-gray-800/40 text-purple-100 placeholder-purple-300/60' 
                  : isThaiMode 
                  ? 'border-blue-200/50 focus:ring-blue-500/30 bg-white/60 text-blue-900 placeholder-blue-500/60'
                  : 'border-blue-200/50 focus:ring-blue-500/30 bg-white/60 text-blue-900 placeholder-blue-500/60'
                }
              `}
            />
          </div>
          <TouchButton
            onClick={addUrl}
            variant="primary"
            size="md"
            isDark={isDarkMode}
            isThaiMode={isThaiMode}
            disabled={!currentUrl.trim()}
          >
            <Save size={20} />
            {t.add}
          </TouchButton>
        </div>
      </div>
    </div>
  );
};