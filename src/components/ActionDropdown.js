// This entire code goes into: src/components/ActionDropdown.js

import React, { useState, useRef, useEffect } from 'react';
import { 
  MoreHorizontal, 
  ExternalLink, 
  Trash2, 
  Share2, 
  Copy, 
  Download,
  QrCode,
  Edit,
  FolderOpen,
  CheckSquare
} from 'lucide-react';

export const ActionDropdown = ({ 
  url, 
  isSelected, 
  onToggleSelect,
  onOpen,
  onDelete,
  onShare,
  onCopy,
  onDownloadQR,
  onShowQR,
  onEdit,
  onMoveToCategory,
  categories = [],
  isDark = false,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showShareSubmenu, setShowShareSubmenu] = useState(false);
  const [showCategorySubmenu, setShowCategorySubmenu] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setShowShareSubmenu(false);
        setShowCategorySubmenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAction = (actionFn, ...args) => {
    actionFn?.(...args);
    setIsOpen(false);
    setShowShareSubmenu(false);
    setShowCategorySubmenu(false);
  };

  const baseButtonClass = `
    w-full flex items-center gap-3 px-4 py-3 text-left transition-colors duration-150
    ${isDark 
      ? 'hover:bg-purple-500/10 text-purple-100' 
      : 'hover:bg-blue-50 text-gray-700'
    }
  `;

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          p-2 rounded-lg transition-colors duration-200
          ${isDark 
            ? 'hover:bg-purple-500/20 text-purple-300' 
            : 'hover:bg-blue-100 text-gray-600'
          }
        `}
      >
        <MoreHorizontal size={16} />
      </button>

      {isOpen && (
        <div className={`
          absolute right-0 top-full mt-2 w-56 rounded-xl shadow-lg z-50
          border backdrop-blur-sm
          ${isDark 
            ? 'bg-gray-800/95 border-purple-500/30' 
            : 'bg-white/95 border-blue-200'
          }
        `}>
          <div className="py-2">
            {/* Select/Deselect */}
            <button
              onClick={() => handleAction(onToggleSelect)}
              className={baseButtonClass}
            >
              <CheckSquare size={16} />
              {isSelected ? 'Deselect' : 'Select'}
            </button>

            {/* Open URL */}
            <button
              onClick={() => handleAction(onOpen)}
              className={baseButtonClass}
            >
              <ExternalLink size={16} />
              Open URL
            </button>

            {/* Share Submenu */}
            <div className="relative">
              <button
                onMouseEnter={() => setShowShareSubmenu(true)}
                className={baseButtonClass}
              >
                <Share2 size={16} />
                Share
                <span className="ml-auto">›</span>
              </button>

              {showShareSubmenu && (
                <div className={`
                  absolute left-full top-0 ml-1 w-48 rounded-lg shadow-lg
                  border backdrop-blur-sm
                  ${isDark 
                    ? 'bg-gray-800/95 border-purple-500/30' 
                    : 'bg-white/95 border-blue-200'
                  }
                `}>
                  <div className="py-2">
                    <button
                      onClick={() => handleAction(onShare, 'native')}
                      className={baseButtonClass}
                    >
                      <Share2 size={14} />
                      Share URL
                    </button>
                    <button
                      onClick={() => handleAction(onCopy)}
                      className={baseButtonClass}
                    >
                      <Copy size={14} />
                      Copy URL
                    </button>
                    <button
                      onClick={() => handleAction(onShowQR)}
                      className={baseButtonClass}
                    >
                      <QrCode size={14} />
                      Share QR Code
                    </button>
                    <button
                      onClick={() => handleAction(onDownloadQR)}
                      className={baseButtonClass}
                    >
                      <Download size={14} />
                      Download QR
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Move to Category Submenu */}
            {categories.length > 0 && (
              <div className="relative">
                <button
                  onMouseEnter={() => setShowCategorySubmenu(true)}
                  className={baseButtonClass}
                >
                  <FolderOpen size={16} />
                  Move to Category
                  <span className="ml-auto">›</span>
                </button>

                {showCategorySubmenu && (
                  <div className={`
                    absolute left-full top-0 ml-1 w-48 rounded-lg shadow-lg
                    border backdrop-blur-sm max-h-64 overflow-y-auto
                    ${isDark 
                      ? 'bg-gray-800/95 border-purple-500/30' 
                      : 'bg-white/95 border-blue-200'
                    }
                  `}>
                    <div className="py-2">
                      {categories.map((category) => (
                        <button
                          key={category}
                          onClick={() => handleAction(onMoveToCategory, category)}
                          className={baseButtonClass}
                        >
                          <FolderOpen size={14} />
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Edit */}
            <button
              onClick={() => handleAction(onEdit)}
              className={baseButtonClass}
            >
              <Edit size={16} />
              Edit URL
            </button>

            {/* Delete */}
            <button
              onClick={() => handleAction(onDelete)}
              className={`${baseButtonClass} text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10`}
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};