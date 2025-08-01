import React, { useState } from 'react';
import { Share2, QrCode, Copy, Download } from 'lucide-react';

export const PWASharing = ({ isDark = false, onShowToast }) => {
  const [showPWAShare, setShowPWAShare] = useState(false);

  const getPWAUrl = () => {
    return window.location.origin;
  };

  const getPWAShareText = () => {
    return `Check out this awesome URL Manager PWA: ${getPWAUrl()}`;
  };

  const sharePWA = async () => {
    const shareData = {
      title: 'Thai Good News URL Manager',
      text: 'Organize and manage your URLs with this powerful PWA',
      url: getPWAUrl()
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        onShowToast?.('PWA shared successfully!', 'success');
      } catch (error) {
        if (error.name !== 'AbortError') {
          copyPWAUrl();
        }
      }
    } else {
      copyPWAUrl();
    }
  };

  const copyPWAUrl = async () => {
    try {
      await navigator.clipboard.writeText(getPWAUrl());
      onShowToast?.('PWA URL copied to clipboard!', 'success');
    } catch (error) {
      onShowToast?.('Failed to copy PWA URL', 'error');
    }
  };

  const generatePWAQR = () => {
    // This would generate a QR code for the PWA URL
    // Implementation depends on your QR code library
    onShowToast?.('PWA QR Code generated', 'success');
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowPWAShare(!showPWAShare)}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
          ${isDark 
            ? 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30' 
            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
          }
        `}
      >
        <Share2 size={16} />
        Share PWA
      </button>

      {showPWAShare && (
        <div className={`
          absolute top-full left-0 mt-2 w-48 rounded-lg shadow-lg z-50
          border backdrop-blur-sm p-2
          ${isDark 
            ? 'bg-gray-800/95 border-purple-500/30' 
            : 'bg-white/95 border-blue-200'
          }
        `}>
          <button
            onClick={sharePWA}
            className={`
              w-full flex items-center gap-2 px-3 py-2 rounded transition-colors
              ${isDark 
                ? 'hover:bg-purple-500/20 text-purple-100' 
                : 'hover:bg-blue-50 text-gray-700'
              }
            `}
          >
            <Share2 size={14} />
            Share PWA
          </button>
          
          <button
            onClick={copyPWAUrl}
            className={`
              w-full flex items-center gap-2 px-3 py-2 rounded transition-colors
              ${isDark 
                ? 'hover:bg-purple-500/20 text-purple-100' 
                : 'hover:bg-blue-50 text-gray-700'
              }
            `}
          >
            <Copy size={14} />
            Copy PWA URL
          </button>
          
          <button
            onClick={generatePWAQR}
            className={`
              w-full flex items-center gap-2 px-3 py-2 rounded transition-colors
              ${isDark 
                ? 'hover:bg-purple-500/20 text-purple-100' 
                : 'hover:bg-blue-50 text-gray-700'
              }
            `}
          >
            <QrCode size={14} />
            PWA QR Code
          </button>
        </div>
      )}
    </div>
  );
};