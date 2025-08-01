import React, { useState } from 'react';
import { X, Share2, Copy, Mail, MessageCircle, Download, QrCode } from 'lucide-react';
import { TouchButton } from './UI';

export const ShareModal = ({
  isOpen,
  onClose,
  url,
  title,
  showQR = false,
  t,
  isDark,
  themeConfig,
  onShowToast
}) => {
  const [qrSize] = useState(300);

  if (!isOpen || !url) return null;

  // Generate QR code URL with white border
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=${encodeURIComponent(url)}&bgcolor=FFFFFF&color=000000&margin=5`;

  const handleShare = async (platform) => {
    const shareData = {
      title: title || 'Shared URL',
      text: `Check out this link: ${title}`,
      url: url
    };

    try {
      switch (platform) {
        case 'native':
          if (navigator.share) {
            await navigator.share(shareData);
            onShowToast('Shared successfully', 'success');
          }
          break;
        
        case 'whatsapp':
          window.open(`https://wa.me/?text=${encodeURIComponent(`${title}: ${url}`)}`);
          onShowToast('Opening WhatsApp...', 'info');
          break;
        
        case 'line':
          window.open(`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}`);
          onShowToast('Opening LINE...', 'info');
          break;
        
        case 'messenger':
          window.open(`https://www.messenger.com/t/?link=${encodeURIComponent(url)}`);
          onShowToast('Opening Messenger...', 'info');
          break;
        
        case 'email':
          window.open(`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`Check out this link: ${url}`)}`);
          onShowToast('Opening Email...', 'info');
          break;
        
        case 'clipboard':
          await navigator.clipboard.writeText(url);
          onShowToast('URL copied to clipboard', 'success');
          break;

        case 'clipboard-qr':
          // Copy QR image to clipboard (if supported)
          if (navigator.clipboard && window.ClipboardItem) {
            const response = await fetch(qrUrl);
            const blob = await response.blob();
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob })
            ]);
            onShowToast('QR Code copied to clipboard', 'success');
          } else {
            onShowToast('QR copy not supported - use download instead', 'warning');
          }
          break;
      }
    } catch (error) {
      console.error('Share failed:', error);
      if (platform === 'clipboard' || platform === 'clipboard-qr') {
        onShowToast('Copy failed', 'error');
      }
    }
    
    onClose();
  };

  const downloadQR = () => {
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = `qr-${title || 'url'}.png`;
    link.click();
    onShowToast('QR Code downloaded', 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className={`${themeConfig.cardBg} p-6 rounded-3xl max-w-md w-full shadow-2xl border ${themeConfig.cardBorder}`}>
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className={`text-xl font-bold ${themeConfig.text}`}>
            {showQR ? 'QR Code' : 'Share URL'}
          </h3>
          <TouchButton onClick={onClose} variant="secondary" size="sm" className="p-2" isDark={isDark}>
            <X size={20} />
          </TouchButton>
        </div>

        {/* QR Code Display (if showing QR) */}
        {showQR && (
          <div className="text-center mb-6">
            <img 
              src={qrUrl} 
              alt={`QR Code for ${title}`}
              className="block mx-auto rounded-2xl shadow-lg"
              style={{ width: qrSize, height: qrSize }}
            />
          </div>
        )}

        {/* URL Info */}
        <div className="mb-6 text-center">
          <p className={`font-semibold ${themeConfig.text} mb-2`}>
            {title}
          </p>
          <p className={`text-sm ${themeConfig.textSecondary} break-all`}>
            {url}
          </p>
        </div>

        {/* Share Options */}
        <div className="space-y-4">
          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            <TouchButton
              onClick={() => handleShare('clipboard')}
              variant="primary"
              size="md"
              isDark={isDark}
              className="flex items-center gap-2"
            >
              <Copy size={16} />
              Copy URL
            </TouchButton>
            
            {showQR && (
              <TouchButton
                onClick={downloadQR}
                variant="primary"
                size="md"
                isDark={isDark}
                className="flex items-center gap-2"
              >
                <Download size={16} />
                Download QR
              </TouchButton>
            )}
            
            {!showQR && navigator.share && (
              <TouchButton
                onClick={() => handleShare('native')}
                variant="primary"
                size="md"
                isDark={isDark}
                className="flex items-center gap-2"
              >
                <Share2 size={16} />
                Share
              </TouchButton>
            )}
          </div>

          {/* Platform-specific sharing */}
          <div className="space-y-3">
            <p className={`text-sm font-medium ${themeConfig.textSecondary}`}>
              Share via:
            </p>
            
            <div className="grid grid-cols-2 gap-2">
              <TouchButton
                onClick={() => handleShare('whatsapp')}
                variant="secondary"
                size="sm"
                isDark={isDark}
                className="flex items-center gap-2"
              >
                <MessageCircle size={16} />
                WhatsApp
              </TouchButton>
              
              <TouchButton
                onClick={() => handleShare('line')}
                variant="secondary"
                size="sm"
                isDark={isDark}
                className="flex items-center gap-2"
              >
                <MessageCircle size={16} />
                LINE
              </TouchButton>
              
              <TouchButton
                onClick={() => handleShare('messenger')}
                variant="secondary"
                size="sm"
                isDark={isDark}
                className="flex items-center gap-2"
              >
                <MessageCircle size={16} />
                Messenger
              </TouchButton>
              
              <TouchButton
                onClick={() => handleShare('email')}
                variant="secondary"
                size="sm"
                isDark={isDark}
                className="flex items-center gap-2"
              >
                <Mail size={16} />
                Email
              </TouchButton>
            </div>

            {/* QR-specific options */}
            {showQR && (
              <TouchButton
                onClick={() => handleShare('clipboard-qr')}
                variant="secondary"
                size="sm"
                isDark={isDark}
                className="w-full flex items-center gap-2"
              >
                <Copy size={16} />
                Copy QR to Clipboard
              </TouchButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};