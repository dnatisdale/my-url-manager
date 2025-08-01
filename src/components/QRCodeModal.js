import React, { useState } from 'react';
import { X, Share2, Copy, Mail, MessageCircle, Download } from 'lucide-react';
import { TouchButton } from './UI';

export const QRCodeModal = ({
  isOpen,
  onClose,
  url,
  title,
  t,
  isDark,
  themeConfig
}) => {
  const [qrSize] = useState(300); // Large QR code
  const [showShareMenu, setShowShareMenu] = useState(false);

  if (!isOpen || !url) return null;

  // Generate QR code URL with white border
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=${encodeURIComponent(url)}&bgcolor=FFFFFF&color=000000&margin=5`;

  const handleShare = async (platform) => {
    const shareData = {
      title: title || 'Shared URL',
      text: `Check out this link: ${title}`,
      url: url
    };

    switch (platform) {
      case 'native':
        if (navigator.share) {
          try {
            await navigator.share(shareData);
          } catch (error) {
            console.log('Share cancelled');
          }
        }
        break;
      
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(`${title}: ${url}`)}`);
        break;
      
      case 'line':
        window.open(`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}`);
        break;
      
      case 'messenger':
        window.open(`https://www.messenger.com/t/?link=${encodeURIComponent(url)}`);
        break;
      
      case 'email':
        window.open(`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`Check out this link: ${url}`)}`);
        break;
      
      case 'clipboard':
        try {
          await navigator.clipboard.writeText(url);
          // Show success toast
        } catch (error) {
          console.error('Copy failed');
        }
        break;
    }
    setShowShareMenu(false);
  };

  const downloadQR = () => {
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = `qr-${title || 'url'}.png`;
    link.click();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className={`${themeConfig.cardBg} p-6 rounded-3xl max-w-md w-full shadow-2xl border ${themeConfig.cardBorder}`}>
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className={`text-xl font-bold ${themeConfig.text}`}>
            QR Code
          </h3>
          <TouchButton onClick={onClose} variant="secondary" size="sm" className="p-2" isDark={isDark}>
            <X size={20} />
          </TouchButton>
        </div>

        {/* QR Code */}
        <div className="text-center mb-6">
          <div className="inline-block p-4 bg-white rounded-2xl shadow-lg">
            <img 
              src={qrUrl} 
              alt={`QR Code for ${title}`}
              className="block mx-auto"
              style={{ width: qrSize, height: qrSize }}
            />
          </div>
          <p className={`mt-4 text-sm ${themeConfig.textSecondary} break-all`}>
            {title}
          </p>
          <p className={`text-xs ${themeConfig.textSecondary} break-all`}>
            {url}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Main Share Button */}
          <TouchButton
            onClick={() => setShowShareMenu(!showShareMenu)}
            variant="primary"
            size="lg"
            className="w-full"
            isDark={isDark}
          >
            <Share2 size={20} />
            Share QR Code
          </TouchButton>

          {/* Share Menu */}
          {showShareMenu && (
            <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-700/40' : 'bg-gray-50/80'} space-y-2`}>
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
              
              <TouchButton
                onClick={() => handleShare('clipboard')}
                variant="secondary"
                size="sm"
                isDark={isDark}
                className="w-full flex items-center gap-2"
              >
                <Copy size={16} />
                Copy URL to Clipboard
              </TouchButton>
            </div>
          )}

          {/* Download Button */}
          <TouchButton
            onClick={downloadQR}
            variant="secondary"
            size="md"
            className="w-full"
            isDark={isDark}
          >
            <Download size={20} />
            Download QR Code
          </TouchButton>
        </div>
      </div>
    </div>
  );
};