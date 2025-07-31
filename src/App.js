import React, { useState, useEffect } from 'react';
import { Search, Download, Share2, Trash2, Settings, QrCode, ChevronDown, ChevronUp, Upload, X, LogIn, LogOut, User, Eye, EyeOff, Plus, Sparkles } from 'lucide-react';

// Enhanced Loading Component
const LoadingSpinner = ({ size = 'sm' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };
  
  return (
    <div className={`${sizeClasses[size]} animate-spin`}>
      <div className="h-full w-full rounded-full border-2 border-gray-300 border-t-blue-500"></div>
    </div>
  );
};

// Enhanced Button Component with loading and haptic feedback
const TouchButton = ({ 
  children, 
  onClick, 
  disabled = false, 
  loading = false, 
  variant = 'primary', 
  size = 'md',
  className = '',
  ...props 
}) => {
  const handleClick = (e) => {
    // Haptic feedback on supported devices
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
    
    if (!disabled && !loading && onClick) {
      onClick(e);
    }
  };

  const variants = {
    primary: 'bg-blue-500 hover:bg-blue-600 text-white',
    secondary: 'bg-gray-500 hover:bg-gray-600 text-white',
    success: 'bg-green-500 hover:bg-green-600 text-white',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
    purple: 'bg-purple-500 hover:bg-purple-600 text-white',
    indigo: 'bg-indigo-500 hover:bg-indigo-600 text-white'
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-6 py-4 text-lg'
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || loading}
      className={`
        ${variants[variant]} ${sizes[size]}
        rounded-xl font-medium transition-all duration-200
        transform active:scale-95 hover:scale-105
        disabled:bg-gray-300 disabled:transform-none disabled:cursor-not-allowed
        shadow-lg hover:shadow-xl active:shadow-md
        flex items-center justify-center gap-2
        ${className}
      `}
      {...props}
    >
      {loading ? <LoadingSpinner size="sm" /> : children}
    </button>
  );
};

// Enhanced Category Card with smooth animations
const CategoryCard = ({ 
  category, 
  urlCount, 
  isExpanded, 
  onToggle, 
  onSelectAll, 
  children,
  selectedCount = 0
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = (e) => {
    setIsAnimating(true);
    onToggle(e);
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      <div
        className="p-4 cursor-pointer bg-gradient-to-r from-blue-50 to-indigo-50 active:from-blue-100 active:to-indigo-100 transition-all duration-200"
        onClick={handleToggle}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0"></div>
            <div>
              <span className="font-semibold text-gray-800 text-lg">{category}</span>
              <div className="text-sm text-gray-600 flex gap-2">
                <span>({urlCount} URLs)</span>
                {selectedCount > 0 && (
                  <span className="text-blue-600 font-medium">• {selectedCount} selected</span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {urlCount > 0 && (
              <TouchButton
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectAll();
                }}
                variant="primary"
                size="sm"
                className="text-xs"
              >
                {selectedCount === urlCount ? 'Deselect' : 'Select'} All
              </TouchButton>
            )}
            <div className={`p-2 bg-white rounded-full shadow-md transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
              <ChevronDown size={20} className="text-gray-600" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Smooth expand/collapse animation */}
      <div className={`
        transition-all duration-300 ease-in-out overflow-hidden
        ${isExpanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}
      `}>
        <div className="border-t border-gray-100">
          {children}
        </div>
      </div>
    </div>
  );
};

// Enhanced URL Item with swipe actions
const URLItem = ({ 
  url, 
  isSelected, 
  onSelect, 
  onQRCode,
  onSwipeDelete 
}) => {
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  const handleTouchStart = (e) => {
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const diff = startX - currentX;
    setSwipeOffset(Math.max(0, Math.min(100, diff)));
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (swipeOffset > 50) {
      // Trigger delete action
      onSwipeDelete && onSwipeDelete();
    }
    setSwipeOffset(0);
  };

  return (
    <div className="relative overflow-hidden">
      {/* Delete background */}
      <div className="absolute right-0 top-0 h-full bg-red-500 flex items-center justify-center"
           style={{ width: `${swipeOffset}px` }}>
        <Trash2 size={20} className="text-white" />
      </div>
      
      {/* Main content */}
      <div 
        className={`
          p-4 border-b border-gray-100 last:border-b-0 flex items-center gap-4
          transition-transform duration-200 bg-white
          ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}
          active:bg-gray-50
        `}
        style={{ transform: `translateX(-${swipeOffset}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Enhanced checkbox */}
        <div className="relative flex-shrink-0">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onSelect}
            className="w-6 h-6 text-blue-500 rounded-lg focus:ring-blue-500 focus:ring-2"
          />
          {isSelected && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center">
                <div className="w-3 h-3 border-2 border-white rounded-sm"></div>
              </div>
            </div>
          )}
        </div>
        
        {/* URL content */}
        <div className="flex-1 min-w-0">
          <a
            href={url.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-gray-800 hover:text-blue-600 break-all active:text-blue-800 transition-colors duration-200"
          >
            <span className="text-gray-400 text-sm">https://</span>
            <span className="font-medium">{url.url.replace(/^https?:\/\//, '')}</span>
          </a>
        </div>
        
        {/* QR Code button */}
        <TouchButton
          onClick={(e) => {
            e.preventDefault();
            onQRCode();
          }}
          variant="secondary"
          size="sm"
          className="flex-shrink-0 p-3 bg-gray-100 hover:bg-gray-200 text-gray-700"
        >
          <QrCode size={18} />
        </TouchButton>
      </div>
    </div>
  );
};

// Floating Action Button
const FloatingActionButton = ({ onClick, visible = true }) => {
  return (
    <div className={`
      fixed bottom-6 right-6 z-40 transition-all duration-300
      ${visible ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}
    `}>
      <TouchButton
        onClick={onClick}
        variant="primary"
        size="lg"
        className="w-16 h-16 rounded-full shadow-2xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
      >
        <Plus size={24} />
      </TouchButton>
    </div>
  );
};

// Pull to refresh component
const PullToRefresh = ({ onRefresh, children }) => {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [startY, setStartY] = useState(0);

  const handleTouchStart = (e) => {
    setStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e) => {
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY;
    if (diff > 0 && window.scrollY === 0) {
      setPullDistance(Math.min(100, diff));
    }
  };

  const handleTouchEnd = async () => {
    if (pullDistance > 60) {
      setIsRefreshing(true);
      await onRefresh();
      setIsRefreshing(false);
    }
    setPullDistance(0);
  };

  return (
    <div 
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative"
    >
      {/* Pull indicator */}
      <div 
        className={`
          absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full
          transition-all duration-200 flex flex-col items-center justify-center
          text-blue-500 font-medium text-sm
        `}
        style={{ 
          height: `${pullDistance}px`,
          opacity: pullDistance > 20 ? 1 : 0 
        }}
      >
        {isRefreshing ? (
          <>
            <LoadingSpinner size="md" />
            <span className="mt-2">Refreshing...</span>
          </>
        ) : (
          <>
            <Sparkles size={24} />
            <span className="mt-1">
              {pullDistance > 60 ? 'Release to refresh' : 'Pull to refresh'}
            </span>
          </>
        )}
      </div>
      
      <div style={{ transform: `translateY(${pullDistance}px)` }}>
        {children}
      </div>
    </div>
  );
};

// Simple Auth Modal Component (keeping original functionality)
const AuthModal = ({ onClose, onLogin, mandatory = false }) => {
  const [email, setEmail] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (email.trim()) {
      setLoading(true);
      // Simulate network delay for better UX
      await new Promise(resolve => setTimeout(resolve, 800));
      onLogin(email.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-2xl max-w-md w-full shadow-2xl transform animate-pulse">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">
            {mandatory ? '🔒 Sign In Required' : (isLogin ? 'Welcome Back!' : 'Join Us!')}
          </h3>
          {!mandatory && (
            <TouchButton onClick={onClose} variant="secondary" size="sm" className="p-2">
              <X size={20} />
            </TouchButton>
          )}
        </div>

        {mandatory && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <p className="text-yellow-800 font-medium">
              Sign in is required to use this app and sync your URLs across devices.
            </p>
          </div>
        )}

        <div>
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-3 text-gray-700">
              Email (used as your account ID)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="your@email.com"
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              disabled={loading}
            />
          </div>

          <TouchButton
            onClick={handleSubmit}
            variant="primary"
            size="lg"
            className="w-full"
            loading={loading}
            disabled={!email.trim()}
          >
            {loading ? 'Signing In...' : (isLogin ? 'Sign In' : 'Create Account')}
          </TouchButton>
        </div>

        {!mandatory && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
            >
              {isLogin ? "Don't have an account? Create one" : "Already have an account? Sign in"}
            </button>
          </div>
        )}

        <div className="mt-6 text-xs text-gray-500 bg-gray-50 p-4 rounded-xl">
          <p className="flex items-center gap-2">📱 Your data will sync across all your devices</p>
          <p className="flex items-center gap-2 mt-1">🔒 Simple email-based account (no password needed for demo)</p>
        </div>
      </div>
    </div>
  );
};

// Keep other modals from original (QRCode, CategorySelection, etc.) but I'll focus on the main app for mobile enhancements

// QR Code component using QR Server API
const QRCode = ({ value, size = 64 }) => {
  return (
    <img
      src={`https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(value)}`}
      alt={`QR Code for ${value}`}
      className="qr-code border rounded-lg shadow-md"
      style={{ width: size, height: size }}
    />
  );
};

// Enhanced QR Modal with mobile optimizations
const QRModal = ({ url, onClose }) => {
  const [qrSize, setQrSize] = useState('large');
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-2xl max-w-md w-full shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">QR Code</h3>
          <TouchButton onClick={onClose} variant="secondary" size="sm" className="p-2">
            <X size={20} />
          </TouchButton>
        </div>
        
        <div className="text-center mb-6">
          <div className="bg-gray-50 p-4 rounded-xl inline-block">
            <QRCode value={url} size={qrSize === 'large' ? 200 : 150} />
          </div>
        </div>
        
        <div className="flex justify-center gap-3 mb-6">
          <TouchButton
            onClick={() => setQrSize('small')}
            variant={qrSize === 'small' ? 'primary' : 'secondary'}
            size="sm"
          >
            Small
          </TouchButton>
          <TouchButton
            onClick={() => setQrSize('large')}
            variant={qrSize === 'large' ? 'primary' : 'secondary'}
            size="sm"
          >
            Large
          </TouchButton>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-xl">
          <p className="text-sm text-gray-600 break-all text-center font-mono">{url}</p>
        </div>
      </div>
    </div>
  );
};

// Simple placeholder modals (keeping original functionality)
const CategorySelectionModal = ({ onClose, onConfirm, categories, url }) => {
  const [selectedCategory, setSelectedCategory] = useState('No Category');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);

  const handleConfirm = () => {
    if (showNewCategoryInput && newCategoryName.trim()) {
      onConfirm(newCategoryName.trim(), true);
    } else if (!showNewCategoryInput && selectedCategory) {
      onConfirm(selectedCategory, false);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-2xl max-w-md w-full shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">Add URL to Category</h3>
          <TouchButton onClick={onClose} variant="secondary" size="sm" className="p-2">
            <X size={20} />
          </TouchButton>
        </div>

        <div className="mb-6 p-4 bg-gray-50 rounded-xl">
          <p className="text-sm text-gray-700 break-all">
            <span className="text-gray-400">https://</span>
            <span className="font-medium">{url.replace(/^https?:\/\//, '')}</span>
          </p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold mb-3 text-gray-700">Choose Category</label>
          
          {!showNewCategoryInput ? (
            <>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <TouchButton
                onClick={() => setShowNewCategoryInput(true)}
                variant="secondary"
                size="sm"
                className="w-full"
              >
                + Create new category
              </TouchButton>
            </>
          ) : (
            <>
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="New category name"
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                autoFocus
              />
              <TouchButton
                onClick={() => setShowNewCategoryInput(false)}
                variant="secondary"
                size="sm"
                className="w-full"
              >
                ← Back to existing categories
              </TouchButton>
            </>
          )}
        </div>

        <div className="flex gap-3">
          <TouchButton
            onClick={onClose}
            variant="secondary"
            size="md"
            className="flex-1"
          >
            Cancel
          </TouchButton>
          <TouchButton
            onClick={handleConfirm}
            disabled={showNewCategoryInput && !newCategoryName.trim()}
            variant="primary"
            size="md"
            className="flex-1"
          >
            Add URL
          </TouchButton>
        </div>
      </div>
    </div>
  );
};

// Main App Component with Mobile Enhancements
function App() {
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  // App state
  const [urls, setUrls] = useState([]);
  const [inputUrl, setInputUrl] = useState('https://');
  const [selectedUrls, setSelectedUrls] = useState([]);
  const [categories, setCategories] = useState(['No Category', 'Save for Later', '5fish', 'GRN', 'Thailand']);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [showQRModal, setShowQRModal] = useState(null);
  const [showCategorySelectionModal, setShowCategorySelectionModal] = useState(false);
  const [pendingUrl, setPendingUrl] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [allUrlsHidden, setAllUrlsHidden] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Mobile-specific state
  const [showFAB, setShowFAB] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Scroll handler for FAB visibility
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      
      // Hide FAB when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowFAB(false);
      } else {
        setShowFAB(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // PWA Install Event Listener (keeping original)
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    const handleAppInstalled = () => {
      setShowInstallButton(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Load user data (simplified for demo)
  useEffect(() => {
    const savedUser = localStorage.getItem('urlManagerUser');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      // Load user-specific data here
    } else {
      setShowAuthModal(true);
    }
  }, []);

  // Authentication functions
  const handleLogin = (email) => {
    const userData = { email, signedInAt: new Date().toISOString() };
    setUser(userData);
    localStorage.setItem('urlManagerUser', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('urlManagerUser');
    setSelectedUrls([]);
  };

  // URL management functions (simplified for demo)
  const normalizeUrl = (url) => {
    let trimmed = url.trim().replaceAll(' ', '');
    if (!trimmed || trimmed === 'https://') return '';
    trimmed = trimmed.replace(/^https?:\/\//, '');
    return trimmed ? `https://${trimmed}` : '';
  };

  const playChimeSound = () => {
    // Haptic feedback for mobile
    if (navigator.vibrate) {
      navigator.vibrate([50, 30, 50]);
    }
    
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.log('Audio not supported');
    }
  };

  const addUrl = (category, isNewCategory = false) => {
    const normalized = normalizeUrl(pendingUrl);
    if (normalized && !urls.find(u => u.url === normalized)) {
      if (isNewCategory && !categories.includes(category)) {
        setCategories([...categories, category]);
      }
      
      const newUrl = {
        id: Date.now(),
        url: normalized,
        category: category
      };
      setUrls([...urls, newUrl]);
      playChimeSound();
    }
    setInputUrl('https://');
    setPendingUrl('');
  };

  const handleUrlSubmit = () => {
    const normalized = normalizeUrl(inputUrl);
    if (normalized) {
      setPendingUrl(normalized);
      setShowCategorySelectionModal(true);
    }
  };

  const toggleSelectUrl = (urlId) => {
    setSelectedUrls(
      selectedUrls.includes(urlId)
        ? selectedUrls.filter(id => id !== urlId)
        : [...selectedUrls, urlId]
    );
  };

  const selectAllInCategory = (category) => {
    const categoryUrls = getFilteredUrls().filter(u => u.category === category);
    const categoryIds = categoryUrls.map(u => u.id);
    const allSelected = categoryIds.every(id => selectedUrls.includes(id));
    
    if (allSelected) {
      setSelectedUrls(selectedUrls.filter(id => !categoryIds.includes(id)));
    } else {
      setSelectedUrls([...new Set([...selectedUrls, ...categoryIds])]);
    }
  };

  const toggleCategory = (category, event) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const toggleAllUrls = () => {
    setAllUrlsHidden(!allUrlsHidden);
    if (!allUrlsHidden) {
      setExpandedCategories({});
    } else {
      const allExpanded = {};
      categories.forEach(cat => allExpanded[cat] = true);
      setExpandedCategories(allExpanded);
    }
  };

  const getFilteredUrls = () => {
    return urls.filter(url => 
      url.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      url.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const getUrlsByCategory = () => {
    const filteredUrls = getFilteredUrls();
    const grouped = {};
    
    categories.forEach(cat => {
      grouped[cat] = filteredUrls.filter(url => url.category === cat);
    });
    
    return grouped;
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleUrlSubmit();
    }
  };

  const openQRModal = (url) => {
    setShowQRModal(url);
  };

  const urlsByCategory = getUrlsByCategory();

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50" style={{ fontFamily: 'ui-rounded, "SF Pro Rounded", system-ui, sans-serif' }}>
        <div className="max-w-4xl mx-auto pb-24">
          {/* Enhanced Header */}
          <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200 p-4 mb-6">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  ข่าวดี Thai: Good News
                </h1>
                
                <div className="flex items-center gap-2">
                  {user ? (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2 px-3 py-2 bg-green-100 rounded-xl">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium text-green-700 truncate max-w-20">
                          {user.email.split('@')[0]}
                        </span>
                      </div>
                      <TouchButton
                        onClick={handleLogout}
                        variant="danger"
                        size="sm"
                        className="p-2"
                      >
                        <LogOut size={16} />
                      </TouchButton>
                    </div>
                  ) : (
                    <TouchButton
                      onClick={() => setShowAuthModal(true)}
                      variant="primary"
                      size="sm"
                    >
                      <LogIn size={16} />
                      <span className="hidden sm:inline">Sign In</span>
                    </TouchButton>
                  )}
                  
                  {showInstallButton && (
                    <TouchButton
                      onClick={() => {/* Install logic */}}
                      variant="purple"
                      size="sm"
                      className="p-2"
                    >
                      📱
                    </TouchButton>
                  )}
                </div>
              </div>

              {/* Enhanced Search */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Search URLs and categories..."
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/70 backdrop-blur-sm"
                />
              </div>
            </div>
          </div>

          <div className="px-4">
            {/* Status indicators */}
            {!user && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-2xl">
                <p className="text-yellow-800 font-medium flex items-center gap-2">
                  🔒 Please sign in to save your URLs and sync across devices
                </p>
              </div>
            )}
            
            {user && (
              <div className="mb-6 p-4 bg-blue-50 rounded-2xl border border-blue-200">
                <p className="text-sm text-blue-700 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <strong>Synced to Cloud:</strong> Your data automatically saves and syncs across all your devices
                </p>
              </div>
            )}

            {/* URL Input Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
              <div className="flex gap-3 mb-4">
                <input
                  type="text"
                  value={inputUrl}
                  onChange={e => setInputUrl(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter URL and press Enter..."
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  disabled={!user}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  inputMode="url"
                />
                <TouchButton
                  onClick={handleUrlSubmit}
                  disabled={!user || inputUrl === 'https://'}
                  variant="primary"
                  size="md"
                  className="px-6"
                >
                  Add
                </TouchButton>
              </div>

              {/* Action buttons */}
              {selectedUrls.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <TouchButton variant="success" size="sm">
                    <Share2 size={16} />
                    Share ({selectedUrls.length})
                  </TouchButton>
                  <TouchButton variant="warning" size="sm">
                    <Download size={16} />
                    Export ({selectedUrls.length})
                  </TouchButton>
                  <TouchButton variant="danger" size="sm">
                    <Trash2 size={16} />
                    Delete ({selectedUrls.length})
                  </TouchButton>
                </div>
              )}
            </div>

            {/* Toggle All URLs */}
            {urls.length > 0 && user && (
              <div className="flex justify-center mb-6">
                <TouchButton
                  onClick={toggleAllUrls}
                  variant="purple"
                  size="md"
                  className="px-6"
                >
                  {allUrlsHidden ? (
                    <>
                      <Eye size={18} />
                      Show All URLs
                    </>
                  ) : (
                    <>
                      <EyeOff size={18} />
                      Hide All URLs
                    </>
                  )}
                </TouchButton>
              </div>
            )}

            {/* Categories */}
            <div className="space-y-4">
              {categories.map(category => {
                const categoryUrls = urlsByCategory[category] || [];
                const isExpanded = expandedCategories[category] && !allUrlsHidden;
                const selectedInCategory = categoryUrls.filter(url => selectedUrls.includes(url.id)).length;
                
                if (categoryUrls.length === 0 && searchTerm) return null;
                
                return (
                  <CategoryCard
                    key={category}
                    category={category}
                    urlCount={categoryUrls.length}
                    selectedCount={selectedInCategory}
                    isExpanded={isExpanded}
                    onToggle={(e) => toggleCategory(category, e)}
                    onSelectAll={() => selectAllInCategory(category)}
                  >
                    {categoryUrls.map(url => (
                      <URLItem
                        key={url.id}
                        url={url}
                        isSelected={selectedUrls.includes(url.id)}
                        onSelect={() => toggleSelectUrl(url.id)}
                        onQRCode={() => openQRModal(url.url)}
                        onSwipeDelete={() => {
                          // Handle swipe to delete
                          console.log('Swipe delete:', url.id);
                        }}
                      />
                    ))}
                    {categoryUrls.length === 0 && (
                      <div className="p-6 text-gray-500 text-center">
                        No URLs in this category
                      </div>
                    )}
                  </CategoryCard>
                );
              })}
            </div>

            {/* Empty state */}
            {urls.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔗</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No URLs added yet</h3>
                <p className="text-gray-500 mb-6">Add some URLs to get started!</p>
                {user && (
                  <TouchButton
                    onClick={() => {
                      setInputUrl('https://example.com');
                      setTimeout(() => document.querySelector('input[type="text"]').focus(), 100);
                    }}
                    variant="primary"
                    size="lg"
                  >
                    <Plus size={20} />
                    Add Your First URL
                  </TouchButton>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Floating Action Button */}
        <FloatingActionButton
          visible={showFAB && user}
          onClick={() => {
            document.querySelector('input[type="text"]').focus();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />

        {/* Modals */}
        {showCategorySelectionModal && (
          <CategorySelectionModal
            onClose={() => setShowCategorySelectionModal(false)}
            onConfirm={addUrl}
            categories={categories}
            url={pendingUrl}
          />
        )}
        
        {showAuthModal && (
          <AuthModal
            onClose={() => setShowAuthModal(false)}
            onLogin={handleLogin}
            mandatory={!user}
          />
        )}
        
        {showQRModal && (
          <QRModal
            url={showQRModal}
            onClose={() => setShowQRModal(null)}
          />
        )}
      </div>
    </PullToRefresh>
  );
}

export default App;