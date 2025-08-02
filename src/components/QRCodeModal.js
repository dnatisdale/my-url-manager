import React, { useState } from 'react';
import { Info } from 'lucide-react';

export const InfoTooltip = ({ 
  content, 
  className = "",
  iconSize = 16,
  position = "top" 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 transform -translate-x-1/2 mt-2",
    left: "right-full top-1/2 transform -translate-y-1/2 mr-2",
    right: "left-full top-1/2 transform -translate-y-1/2 ml-2"
  };

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <button
        type="button"
        className="inline-flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
        style={{ width: iconSize + 8, height: iconSize + 8 }}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        aria-label="More information"
      >
        <Info 
          size={iconSize} 
          className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200" 
        />
      </button>
      
      {isVisible && (
        <div className={`absolute z-50 ${positionClasses[position]}`}>
          <div className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm rounded-lg py-2 px-3 shadow-lg border border-gray-200 dark:border-gray-700 max-w-xs whitespace-normal">
            {content}
            {/* Tooltip arrow */}
            <div 
              className={`absolute w-2 h-2 bg-gray-900 dark:bg-gray-100 border-gray-200 dark:border-gray-700 transform rotate-45 ${
                position === 'top' ? 'top-full left-1/2 -translate-x-1/2 -mt-1 border-r border-b' :
                position === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 -mb-1 border-l border-t' :
                position === 'left' ? 'left-full top-1/2 -translate-y-1/2 -ml-1 border-t border-r' :
                'right-full top-1/2 -translate-y-1/2 -mr-1 border-b border-l'
              }`}
            />
          </div>
        </div>
      )}
    </div>
  );
};