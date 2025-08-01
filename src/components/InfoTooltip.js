// This entire code goes into: src/components/InfoTooltip.js

import React, { useState } from 'react';
import { Info } from 'lucide-react';

export const InfoTooltip = ({ message, isDark = false, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className={`
          w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold
          transition-all duration-200 hover:scale-110
          ${isDark 
            ? 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30' 
            : 'bg-blue-500/20 text-blue-600 hover:bg-blue-500/30'
          }
        `}
      >
        <Info size={10} />
      </button>
      
      {isVisible && (
        <div className={`
          absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 
          text-xs rounded-lg shadow-lg z-50 whitespace-nowrap max-w-xs
          ${isDark 
            ? 'bg-gray-800 text-purple-100 border border-purple-500/30' 
            : 'bg-white text-gray-800 border border-blue-200 shadow-md'
          }
        `}>
          {message}
          <div className={`
            absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0
            border-l-4 border-r-4 border-t-4 border-transparent
            ${isDark ? 'border-t-gray-800' : 'border-t-white'}
          `} />
        </div>
      )}
    </div>
  );
};