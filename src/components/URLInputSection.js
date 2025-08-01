import React, { useState } from 'react';
import { Save, ChevronDown } from 'lucide-react';
import { TouchButton } from './UI';

export const URLInputSection = ({
  t,
  themeConfig,
  isDarkMode,
  isThaiMode,
  currentUrl,
  setCurrentUrl,
  addUrl,
  handleUrlKeyPress,
  categories,
  selectedCategory,
  setSelectedCategory
}) => {
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  // Play success sound
  const playSuccessSound = () => {
    try {
      // Create audio context for chime sound
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Create pleasant chime sound
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.log('Audio not available');
    }
  };

  const handleAddUrl = () => {
    if (!selectedCategory) {
      alert(t.selectCategoryFirst);
      return;
    }
    addUrl(selectedCategory);
    playSuccessSound();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddUrl();
    }
  };

  // Filter out 'No Category' from dropdown
  const availableCategories = categories.filter(cat => cat !== 'No Category');

  return (
    <div className={`${themeConfig.cardBg} rounded-3xl p-6 border ${themeConfig.cardBorder}`}>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${themeConfig.accent} flex items-center justify-center`}>
            <Save className="text-white" size={20} />
          </div>
          <div>
            <h3 className={`text-lg font-semibold ${themeConfig.text}`}>
              {t.enterUrlHere}
            </h3>
            <p className={`text-sm ${themeConfig.textSecondary}`}>
              {isThaiMode ? t.savedLocally : t.syncedToCloud}
            </p>
          </div>
        </div>

        {/* Category Selection */}
        <div className="relative">
          <label className={`block text-sm font-medium ${themeConfig.text} mb-2`}>
            {t.selectCategory} *
          </label>
          <div className="relative">
            <TouchButton
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              variant="secondary"
              size="md"
              isDark={isDarkMode}
              className={`w-full justify-between ${!selectedCategory ? 'border-red-300' : ''}`}
            >
              <span>{selectedCategory || t.selectCategory}</span>
              <ChevronDown size={16} />
            </TouchButton>

            {/* Category Dropdown */}
            {showCategoryDropdown && (
              <div className={`
                absolute top-full mt-2 left-0 right-0 z-50
                ${themeConfig.cardBg} rounded-xl border ${themeConfig.cardBorder}
                max-h-48 overflow-y-auto
              `}>
                {availableCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category);
                      setShowCategoryDropdown(false);
                    }}
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
              onKeyPress={handleKeyPress}
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
            onClick={handleAddUrl}
            variant="primary"
            size="md"
            isDark={isDarkMode}
            isThaiMode={isThaiMode}
            disabled={!currentUrl.trim() || !selectedCategory}
          >
            <Save size={20} />
            {t.add}
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