import React, { useState } from 'react';
import { Download, FolderOpen, Settings } from 'lucide-react';
import { InfoTooltip } from './InfoTooltip';

export const DownloadManager = ({ isDark = false, onShowToast }) => {
  const [downloadPath, setDownloadPath] = useState(null);

  // Get the default download path
  const getDownloadPath = () => {
    // This is a simplified version - in a real app, you'd detect the OS
    const userAgent = navigator.userAgent;
    const username = 'User'; // In practice, you can't get the actual username
    
    if (userAgent.includes('Mac')) {
      return `/Users/${username}/Downloads`;
    } else if (userAgent.includes('Windows')) {
      return `C:\\Users\\${username}\\Downloads`;
    } else {
      return `~/Downloads`;
    }
  };

  const handleDownloadQR = async (url, filename = 'qr-code.png') => {
    try {
      // Generate QR code (you'll need to implement QR generation)
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 256;
      canvas.height = 256;
      
      // Placeholder - replace with actual QR code generation
      ctx.fillStyle = isDark ? '#ffffff' : '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Convert canvas to blob
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        onShowToast?.(`Downloaded to ${getDownloadPath()}/${filename}`, 'success');
      }, 'image/png');
      
    } catch (error) {
      onShowToast?.('Download failed', 'error');
    }
  };

  const openDownloadsFolder = () => {
    // This only works in Electron or similar environments
    // For web browsers, we can only show the path
    onShowToast?.(`Downloads saved to: ${getDownloadPath()}`, 'info');
  };

  return {
    downloadPath: getDownloadPath(),
    handleDownloadQR,
    openDownloadsFolder,
    DownloadLocationDisplay: () => (
      <div className="flex items-center gap-2 text-sm">
        <span className={isDark ? 'text-purple-300' : 'text-gray-600'}>
          Downloads: {getDownloadPath()}
        </span>
        <InfoTooltip 
          message="QR codes and exports will be saved to your default Downloads folder"
          isDark={isDark}
        />
        <button
          onClick={openDownloadsFolder}
          className={`
            p-1 rounded transition-colors
            ${isDark 
              ? 'hover:bg-purple-500/20 text-purple-300' 
              : 'hover:bg-blue-100 text-blue-600'
            }
          `}
        >
          <FolderOpen size={14} />
        </button>
      </div>
    )
  };
};