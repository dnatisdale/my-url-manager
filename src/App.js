import React, { useState, useEffect } from 'react';
import { Search, Download, Share2, Trash2, Settings, QrCode, ChevronDown, ChevronUp, Upload, X, LogIn, LogOut, User, Eye, EyeOff, Plus, Sparkles, Globe } from 'lucide-react';

// Thai translations object
const translations = {
  th: {
    // Header
    appTitle: "ข่าวดี: คลังเก็บลิงก์",
    appSubtitle: "Thai Good News URL Vault",
    
    // Authentication
    signInRequired: "🔒 ต้องเข้าสู่ระบบ",
    welcomeBack: "ยินดีต้อนรับกลับ!",
    joinUs: "เข้าร่วมกับเรา!",
    signIn: "เข้าสู่ระบบ",
    signOut: "ออกจากระบบ",
    createAccount: "สร้างบัญชี",
    email: "อีเมล (ใช้เป็น ID บัญชี)",
    emailPlaceholder: "your@email.com",
    signingIn: "กำลังเข้าสู่ระบบ...",
    noAccount: "ไม่มีบัญชี? สร้างใหม่",
    hasAccount: "มีบัญชีแล้ว? เข้าสู่ระบบ",
    
    // Status messages
    signInMessage: "กรุณาเข้าสู่ระบบเพื่อบันทึกลิงก์และซิงค์ข้อมูลระหว่างอุปกรณ์",
    syncedToCloud: "ซิงค์กับคลาวด์: ข้อมูลของคุณบันทึกและซิงค์อัตโนมัติในทุกอุปกรณ์",
    dataWillSync: "📱 ข้อมูลจะซิงค์ในทุกอุปกรณ์ของคุณ",
    simpleAccount: "🔒 บัญชีแบบง่าย (ไม่ต้องใช้รหัสผ่านสำหรับการทดลอง)",
    
    // URL management
    enterUrl: "ป้อนลิงก์และกด Enter...",
    addUrl: "เพิ่มลิงก์",
    searchPlaceholder: "ค้นหาลิงก์และหมวดหมู่...",
    noUrlsYet: "ยังไม่มีลิงก์",
    noUrlsMessage: "เพิ่มลิงก์เพื่อเริ่มต้น!",
    addFirstUrl: "เพิ่มลิงก์แรกของคุณ",
    
    // Categories
    addToCategory: "เพิ่มลิงก์ไปยังหมวดหมู่",
    chooseCategory: "เลือกหมวดหมู่",
    createNewCategory: "+ สร้างหมวดหมู่ใหม่",
    newCategoryName: "ชื่อหมวดหมู่ใหม่",
    backToExisting: "← กลับไปหมวดหมู่ที่มี",
    noCategory: "ไม่มีหมวดหมู่",
    saveForLater: "เก็บไว้ดูทีหลัง",
    thailand: "ประเทศไทย",
    
    // Actions
    share: "แชร์",
    export: "ส่งออก",
    delete: "ลบ",
    cancel: "ยกเลิก",
    confirm: "ยืนยัน",
    selectAll: "เลือกทั้งหมด",
    deselectAll: "ยกเลิกการเลือก",
    moveTo: "ย้ายไป...",
    showAllUrls: "แสดงลิงก์ทั้งหมด",
    hideAllUrls: "ซ่อนลิงก์ทั้งหมด",
    
    // QR Code
    qrCode: "คิวอาร์โค้ด",
    small: "เล็ก",
    large: "ใหญ่",
    
    // Import/Export
    import: "นำเข้า",
    importUrls: "นำเข้าลิงก์",
    uploadCsv: "อัปโหลดไฟล์ CSV",
    pasteUrls: "หรือวางลิงก์ (หนึ่งบรรทัดต่อหนึ่งลิงก์)",
    category: "หมวดหมู่",
    existing: "ที่มีอยู่",
    new: "ใหม่",
    preview: "ดูตัวอย่าง",
    urls: "ลิงก์",
    selected: "เลือกแล้ว",
    importing: "กำลังนำเข้า",
    
    // Management
    manage: "จัดการ",
    manageCategories: "จัดการหมวดหมู่",
    searchCategories: "ค้นหาหมวดหมู่...",
    add: "เพิ่ม",
    
    // Messages
    noUrlsInCategory: "ไม่มีลิงก์ในหมวดหมู่นี้",
    deleteConfirm: "คุณแน่ใจหรือไม่ที่จะลบลิงก์ที่เลือก?",
    refreshing: "กำลังรีเฟรช...",
    pullToRefresh: "ดึงลงเพื่อรีเฟรช",
    releaseToRefresh: "ปล่อยเพื่อรีเฟรช",
    
    // Install
    installApp: "ติดตั้งแอป",
    
    // Numbers
    and: "และ",
    more: "เพิ่มเติม"
  },
  en: {
    // Header
    appTitle: "Good News: URL Vault",
    appSubtitle: "ข่าวดี Thai Good News",
    
    // Authentication
    signInRequired: "🔒 Sign In Required",
    welcomeBack: "Welcome Back!",
    joinUs: "Join Us!",
    signIn: "Sign In",
    signOut: "Sign Out",
    createAccount: "Create Account",
    email: "Email (used as your account ID)",
    emailPlaceholder: "your@email.com",
    signingIn: "Signing In...",
    noAccount: "Don't have an account? Create one",
    hasAccount: "Already have an account? Sign in",
    
    // Status messages
    signInMessage: "Please sign in to save your URLs and sync across devices",
    syncedToCloud: "Synced to Cloud: Your data automatically saves and syncs across all your devices",
    dataWillSync: "📱 Your data will sync across all your devices",
    simpleAccount: "🔒 Simple email-based account (no password needed for demo)",
    
    // URL management
    enterUrl: "Enter URL and press Enter...",
    addUrl: "Add URL",
    searchPlaceholder: "Search URLs and categories...",
    noUrlsYet: "No URLs added yet",
    noUrlsMessage: "Add some URLs to get started!",
    addFirstUrl: "Add Your First URL",
    
    // Categories
    addToCategory: "Add URL to Category",
    chooseCategory: "Choose Category",
    createNewCategory: "+ Create new category",
    newCategoryName: "New category name",
    backToExisting: "← Back to existing categories",
    noCategory: "No Category",
    saveForLater: "Save for Later",
    thailand: "Thailand",
    
    // Actions
    share: "Share",
    export: "Export",
    delete: "Delete",
    cancel: "Cancel",
    confirm: "Confirm",
    selectAll: "Select All",
    deselectAll: "Deselect",
    moveTo: "Move to...",
    showAllUrls: "Show All URLs",
    hideAllUrls: "Hide All URLs",
    
    // QR Code
    qrCode: "QR Code",
    small: "Small",
    large: "Large",
    
    // Import/Export
    import: "Import",
    importUrls: "Import URLs",
    uploadCsv: "Upload CSV File",
    pasteUrls: "Or paste URLs (one per line)",
    category: "Category",
    existing: "Existing",
    new: "New",
    preview: "Preview",
    urls: "URLs",
    selected: "selected",
    importing: "Import",
    
    // Management
    manage: "Manage",
    manageCategories: "Manage Categories",
    searchCategories: "Search categories...",
    add: "Add",
    
    // Messages
    noUrlsInCategory: "No URLs in this category",
    deleteConfirm: "Are you sure you want to delete the selected URLs?",
    refreshing: "Refreshing...",
    pullToRefresh: "Pull to refresh",
    releaseToRefresh: "Release to refresh",
    
    // Install
    installApp: "Install App",
    
    // Numbers
    and: "and",
    more: "more"
  }
};

// Thai-specific cultural colors
const thaiColors = {
  royal: {
    primary: '#002868', // Thai Royal Blue
    secondary: '#FFD700', // Thai Gold
    accent: '#DC143C' // Thai Red
  },
  traditional: {
    primary: '#8B4513', // Thai Brown
    secondary: '#228B22', // Thai Green
    accent: '#FF6347' // Thai Orange
  },
  modern: {
    primary: '#4A90E2', // Modern Blue
    secondary: '#F39C12', // Modern Gold
    accent: '#E74C3C' // Modern Red
  }
};

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
    indigo: 'bg-indigo-500 hover:bg-indigo-600 text-white',
    thai: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
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

// Language Toggle Component
const LanguageToggle = ({ currentLang, onToggle }) => {
  return (
    <TouchButton
      onClick={onToggle}
      variant="secondary"
      size="sm"
      className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/20"
    >
      <Globe size={16} />
      <span className="font-medium">
        {currentLang === 'th' ? 'ไทย' : 'EN'}
      </span>
    </TouchButton>
  );
};

// Enhanced Category Card with Thai styling
const CategoryCard = ({ 
  category, 
  urlCount, 
  isExpanded, 
  onToggle, 
  onSelectAll, 
  children,
  selectedCount = 0,
  t,
  isThaiMode
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = (e) => {
    setIsAnimating(true);
    onToggle(e);
    setTimeout(() => setIsAnimating(false), 300);
  };

  // Thai-specific styling
  const thaiCategoryStyle = isThaiMode ? 'font-thai' : '';

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      <div
        className={`
          p-4 cursor-pointer bg-gradient-to-r from-blue-50 to-indigo-50 
          active:from-blue-100 active:to-indigo-100 transition-all duration-200
          ${isThaiMode ? 'bg-gradient-to-r from-yellow-50 to-orange-50 active:from-yellow-100 active:to-orange-100' : ''}
        `}
        onClick={handleToggle}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className={`
              w-3 h-3 rounded-full flex-shrink-0
              ${isThaiMode ? 'bg-gradient-to-r from-yellow-500 to-orange-500' : 'bg-blue-500'}
            `}></div>
            <div className={thaiCategoryStyle}>
              <span className="font-semibold text-gray-800 text-lg">{category}</span>
              <div className="text-sm text-gray-600 flex gap-2">
                <span>({urlCount} {t.urls})</span>
                {selectedCount > 0 && (
                  <span className="text-blue-600 font-medium">• {selectedCount} {t.selected}</span>
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
                variant={isThaiMode ? "thai" : "primary"}
                size="sm"
                className="text-xs"
              >
                {selectedCount === urlCount ? t.deselectAll : t.selectAll}
              </TouchButton>
            )}
            <div className={`
              p-2 bg-white rounded-full shadow-md transition-transform duration-300 
              ${isExpanded ? 'rotate-180' : ''}
              ${isThaiMode ? 'bg-gradient-to-r from-yellow-100 to-orange-100' : ''}
            `}>
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

// Enhanced URL Item with Thai support
const URLItem = ({ 
  url, 
  isSelected, 
  onSelect, 
  onQRCode,
  onSwipeDelete,
  isThaiMode
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
      onSwipeDelete && onSwipeDelete();
    }
    setSwipeOffset(0);
  };

  return (
    <div className="relative overflow-hidden">
      {/* Delete background with Thai styling */}
      <div className={`
        absolute right-0 top-0 h-full flex items-center justify-center
        ${isThaiMode ? 'bg-gradient-to-l from-red-500 to-orange-500' : 'bg-red-500'}
      `}
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
          ${isThaiMode ? 'hover:bg-gradient-to-r hover:from-yellow-50 hover:to-orange-50' : ''}
        `}
        style={{ transform: `translateX(-${swipeOffset}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Enhanced checkbox with Thai styling */}
        <div className="relative flex-shrink-0">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onSelect}
            className="w-6 h-6 text-blue-500 rounded-lg focus:ring-blue-500 focus:ring-2"
          />
          {isSelected && (
            <div className="absolute inset-0 pointer-events-none">
              <div className={`
                w-6 h-6 rounded-lg flex items-center justify-center
                ${isThaiMode ? 'bg-gradient-to-r from-yellow-500 to-orange-500' : 'bg-blue-500'}
              `}>
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
        
        {/* QR Code button with Thai styling */}
        <TouchButton
          onClick={(e) => {
            e.preventDefault();
            onQRCode();
          }}
          variant="secondary"
          size="sm"
          className={`
            flex-shrink-0 p-3 text-gray-700
            ${isThaiMode ? 'bg-gradient-to-r from-yellow-100 to-orange-100 hover:from-yellow-200 hover:to-orange-200' : 'bg-gray-100 hover:bg-gray-200'}
          `}
        >
          <QrCode size={18} />
        </TouchButton>
      </div>
    </div>
  );
};

// Floating Action Button with Thai styling
const FloatingActionButton = ({ onClick, visible = true, isThaiMode }) => {
  return (
    <div className={`
      fixed bottom-6 right-6 z-40 transition-all duration-300
      ${visible ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}
    `}>
      <TouchButton
        onClick={onClick}
        variant="primary"
        size="lg"
        className={`
          w-16 h-16 rounded-full shadow-2xl
          ${isThaiMode 
            ? 'bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700' 
            : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'
          }
        `}
      >
        <Plus size={24} />
      </TouchButton>
    </div>
  );
};

// Pull to refresh component with Thai text
const PullToRefresh = ({ onRefresh, children, t }) => {
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
            <span className="mt-2">{t.refreshing}</span>
          </>
        ) : (
          <>
            <Sparkles size={24} />
            <span className="mt-1">
              {pullDistance > 60 ? t.releaseToRefresh : t.pullToRefresh}
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

// Enhanced Auth Modal with Thai support
const AuthModal = ({ onClose, onLogin, mandatory = false, t, isThaiMode }) => {
  const [email, setEmail] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (email.trim()) {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      onLogin(email.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`
        bg-white p-6 rounded-2xl max-w-md w-full shadow-2xl transform animate-pulse
        ${isThaiMode ? 'bg-gradient-to-br from-white to-yellow-50' : ''}
      `}>
        <div className="flex justify-between items-center mb-6">
          <h3 className={`
            text-xl font-bold text-gray-800
            ${isThaiMode ? 'font-thai' : ''}
          `}>
            {mandatory ? t.signInRequired : (isLogin ? t.welcomeBack : t.joinUs)}
          </h3>
          {!mandatory && (
            <TouchButton onClick={onClose} variant="secondary" size="sm" className="p-2">
              <X size={20} />
            </TouchButton>
          )}
        </div>

        {mandatory && (
          <div className={`
            mb-6 p-4 border rounded-xl
            ${isThaiMode ? 'bg-yellow-50 border-yellow-200' : 'bg-yellow-50 border-yellow-200'}
          `}>
            <p className={`
              font-medium
              ${isThaiMode ? 'text-yellow-800 font-thai' : 'text-yellow-800'}
            `}>
              {t.signInMessage}
            </p>
          </div>
        )}

        <div>
          <div className="mb-6">
            <label className={`
              block text-sm font-semibold mb-3 text-gray-700
              ${isThaiMode ? 'font-thai' : ''}
            `}>
              {t.email}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder={t.emailPlaceholder}
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              disabled={loading}
            />
          </div>

          <TouchButton
            onClick={handleSubmit}
            variant={isThaiMode ? "thai" : "primary"}
            size="lg"
            className="w-full"
            loading={loading}
            disabled={!email.trim()}
          >
            {loading ? t.signingIn : (isLogin ? t.signIn : t.createAccount)}
          </TouchButton>
        </div>

        {!mandatory && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className={`
                text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200
                ${isThaiMode ? 'font-thai' : ''}
              `}
            >
              {isLogin ? t.noAccount : t.hasAccount}
            </button>
          </div>
        )}

        <div className={`
          mt-6 text-xs text-gray-500 p-4 rounded-xl
          ${isThaiMode ? 'bg-yellow-50 font-thai' : 'bg-gray-50'}
        `}>
          <p className="flex items-center gap-2">{t.dataWillSync}</p>
          <p className="flex items-center gap-2 mt-1">{t.simpleAccount}</p>
        </div>
      </div>
    </div>
  );
};

// QR Code component
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

// Enhanced QR Modal with Thai support
const QRModal = ({ url, onClose, t, isThaiMode }) => {
  const [qrSize, setQrSize] = useState('large');
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`
        bg-white p-6 rounded-2xl max-w-md w-full shadow-2xl
        ${isThaiMode ? 'bg-gradient-to-br from-white to-yellow-50' : ''}
      `}>
        <div className="flex justify-between items-center mb-6">
          <h3 className={`
            text-xl font-bold text-gray-800
            ${isThaiMode ? 'font-thai' : ''}
          `}>
            {t.qrCode}
          </h3>
          <TouchButton onClick={onClose} variant="secondary" size="sm" className="p-2">
            <X size={20} />
          </TouchButton>
        </div>
        
        <div className="text-center mb-6">
          <div className={`
            p-4 rounded-xl inline-block
            ${isThaiMode ? 'bg-gradient-to-br from-yellow-50 to-orange-50' : 'bg-gray-50'}
          `}>
            <QRCode value={url} size={qrSize === 'large' ? 200 : 150} />
          </div>
        </div>
        
        <div className="flex justify-center gap-3 mb-6">
          <TouchButton
            onClick={() => setQrSize('small')}
            variant={qrSize === 'small' ? (isThaiMode ? 'thai' : 'primary') : 'secondary'}
            size="sm"
          >
            {t.small}
          </TouchButton>
          <TouchButton
            onClick={() => setQrSize('large')}
            variant={qrSize === 'large' ? (isThaiMode ? 'thai' : 'primary') : 'secondary'}
            size="sm"
          >
            {t.large}
          </TouchButton>
        </div>
        
        <div className={`
          p-4 rounded-xl
          ${isThaiMode ? 'bg-gradient-to-br from-yellow-50 to-orange-50' : 'bg-gray-50'}
        `}>
          <p className="text-sm text-gray-600 break-all text-center font-mono">{url}</p>
        </div>
      </div>
    </div>
  );
};

// Category Selection Modal with Thai support
const CategorySelectionModal = ({ onClose, onConfirm, categories, url, t, isThaiMode }) => {
  const [selectedCategory, setSelectedCategory] = useState(t.noCategory);
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
      <div className={`
        bg-white p-6 rounded-2xl max-w-md w-full shadow-2xl
        ${isThaiMode ? 'bg-gradient-to-br from-white to-yellow-50' : ''}
      `}>
        <div className="flex justify-between items-center mb-6">
          <h3 className={`
            text-xl font-bold text-gray-800
            ${isThaiMode ? 'font-thai' : ''}
          `}>
            {t.addToCategory}
          </h3>
          <TouchButton onClick={onClose} variant="secondary" size="sm" className="p-2">
            <X size={20} />
          </TouchButton>
        </div>

        <div className={`
          mb-6 p-4 rounded-xl
          ${isThaiMode ? 'bg-gradient-to-br from-yellow-50 to-orange-50' : 'bg-gray-50'}
        `}>
          <p className="text-sm text-gray-700 break-all">
            <span className="text-gray-400">https://</span>
            <span className="font-medium">{url.replace(/^https?:\/\//, '')}</span>
          </p>
        </div>

        <div className="mb-6">
          <label className={`
            block text-sm font-semibold mb-3 text-gray-700
            ${isThaiMode ? 'font-thai' : ''}
          `}>
            {t.chooseCategory}
          </label>
          
          {!showNewCategoryInput ? (
            <>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={`
                  w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3
                  ${isThaiMode ? 'font-thai' : ''}
                `}
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
                {t.createNewCategory}
              </TouchButton>
            </>
          ) : (
            <>
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder={t.newCategoryName}
                className={`
                  w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3
                  ${isThaiMode ? 'font-thai' : ''}
                `}
                autoFocus
              />
              <TouchButton
                onClick={() => setShowNewCategoryInput(false)}
                variant="secondary"
                size="sm"
                className="w-full"
              >
                {t.backToExisting}
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
            {t.cancel}
          </TouchButton>
          <TouchButton
            onClick={handleConfirm}
            disabled={showNewCategoryInput && !newCategoryName.trim()}
            variant={isThaiMode ? "thai" : "primary"}
            size="md"
            className="flex-1"
          >
            {t.addUrl}
          </TouchButton>
        </div>
      </div>
    </div>
  );
};

// Main App Component with Thai Enhancement
function App() {
  // Language state
  const [language, setLanguage] = useState('en');
  const [isThaiMode, setIsThaiMode] = useState(false);
  
  // App state
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [urls, setUrls] = useState([]);
  const [inputUrl, setInputUrl] = useState('https://');
  const [selectedUrls, setSelectedUrls] = useState([]);
  
  // Thai-enhanced categories
  const [categories, setCategories] = useState([
    language === 'th' ? 'ไม่มีหมวดหมู่' : 'No Category',
    language === 'th' ? 'เก็บไว้ดูทีหลัง' : 'Save for Later',
    '5fish',
    'GRN',
    language === 'th' ? 'ประเทศไทย' : 'Thailand'
  ]);
  
  const [expandedCategories, setExpandedCategories] = useState({});
  const [showQRModal, setShowQRModal] = useState(null);
  const [showCategorySelectionModal, setShowCategorySelectionModal] = useState(false);
  const [pendingUrl, setPendingUrl] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [allUrlsHidden, setAllUrlsHidden] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showFAB, setShowFAB] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Get current translations
  const t = translations[language];

  // Language toggle handler
  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'th' : 'en';
    setLanguage(newLang);
    setIsThaiMode(newLang === 'th');
    
    // Update categories with translated names
    setCategories(prev => prev.map(cat => {
      if (cat === 'No Category' || cat === 'ไม่มีหมวดหมู่') {
        return newLang === 'th' ? 'ไม่มีหมวดหมู่' : 'No Category';
      }
      if (cat === 'Save for Later' || cat === 'เก็บไว้ดูทีหลัง') {
        return newLang === 'th' ? 'เก็บไว้ดูทีหลัง' : 'Save for Later';
      }
      if (cat === 'Thailand' || cat === 'ประเทศไทย') {
        return newLang === 'th' ? 'ประเทศไทย' : 'Thailand';
      }
      return cat;
    }));
  };

  // Scroll handler for FAB visibility
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      
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

  // PWA Install Event Listener
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

  // Load user data
  useEffect(() => {
    const savedUser = localStorage.getItem('urlManagerUser');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
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

  // URL management functions
  const normalizeUrl = (url) => {
    let trimmed = url.trim().replaceAll(' ', '');
    if (!trimmed || trimmed === 'https://') return '';
    trimmed = trimmed.replace(/^https?:\/\//, '');
    return trimmed ? `https://${trimmed}` : '';
  };

  const playChimeSound = () => {
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
    <>
      {/* Google Fonts for Thai typography */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=Sarabun:wght@400;500;600;700&family=Noto+Sans+Thai:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      
      <style jsx>{`
        .font-thai {
          font-family: 'Sarabun', 'Noto Sans Thai', system-ui, sans-serif;
        }
      `}</style>

      <PullToRefresh onRefresh={handleRefresh} t={t}>
        <div className={`
          min-h-screen pb-24
          ${isThaiMode 
            ? 'bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 font-thai' 
            : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50'
          }
        `} style={{ fontFamily: isThaiMode ? "'Sarabun', 'Noto Sans Thai', system-ui, sans-serif" : "'ui-rounded', 'SF Pro Rounded', system-ui, sans-serif" }}>
          <div className="max-w-4xl mx-auto">
            {/* Enhanced Header with Thai styling */}
            <div className={`
              sticky top-0 z-30 backdrop-blur-md border-b p-4 mb-6
              ${isThaiMode 
                ? 'bg-gradient-to-r from-yellow-100/80 to-orange-100/80 border-orange-200' 
                : 'bg-white/80 border-gray-200'
              }
            `}>
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <h1 className={`
                      text-xl sm:text-2xl font-bold
                      ${isThaiMode 
                        ? 'bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent font-thai' 
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent'
                      }
                    `}>
                      {t.appTitle}
                    </h1>
                    <p className={`
                      text-sm opacity-75
                      ${isThaiMode ? 'text-orange-700 font-thai' : 'text-blue-700'}
                    `}>
                      {t.appSubtitle}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <LanguageToggle currentLang={language} onToggle={toggleLanguage} />
                    
                    {user ? (
                      <div className="flex items-center gap-2">
                        <div className={`
                          flex items-center gap-2 px-3 py-2 rounded-xl
                          ${isThaiMode ? 'bg-orange-100' : 'bg-green-100'}
                        `}>
                          <div className={`
                            w-2 h-2 rounded-full animate-pulse
                            ${isThaiMode ? 'bg-orange-500' : 'bg-green-500'}
                          `}></div>
                          <span className={`
                            text-sm font-medium truncate max-w-20
                            ${isThaiMode ? 'text-orange-700 font-thai' : 'text-green-700'}
                          `}>
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
                        variant={isThaiMode ? "thai" : "primary"}
                        size="sm"
                      >
                        <LogIn size={16} />
                        <span className="hidden sm:inline">{t.signIn}</span>
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

                {/* Enhanced Search with Thai styling */}
                <div className="relative">
                  <Search className={`
                    absolute left-4 top-1/2 transform -translate-y-1/2
                    ${isThaiMode ? 'text-orange-400' : 'text-gray-400'}
                  `} size={18} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder={t.searchPlaceholder}
                    className={`
                      w-full pl-12 pr-4 py-3 border-2 rounded-2xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 backdrop-blur-sm
                      ${isThaiMode 
                        ? 'border-orange-200 focus:ring-orange-500 bg-white/70 font-thai' 
                        : 'border-gray-200 focus:ring-blue-500 bg-white/70'
                      }
                    `}
                  />
                </div>
              </div>
            </div>

            <div className="px-4">
              {/* Status indicators with Thai styling */}
              {!user && (
                <div className={`
                  mb-6 p-4 border rounded-2xl
                  ${isThaiMode ? 'bg-yellow-50 border-yellow-200' : 'bg-yellow-50 border-yellow-200'}
                `}>
                  <p className={`
                    font-medium flex items-center gap-2
                    ${isThaiMode ? 'text-yellow-800 font-thai' : 'text-yellow-800'}
                  `}>
                    🔒 {t.signInMessage}
                  </p>
                </div>
              )}
              
              {user && (
                <div className={`
                  mb-6 p-4 rounded-2xl border
                  ${isThaiMode ? 'bg-orange-50 border-orange-200' : 'bg-blue-50 border-blue-200'}
                `}>
                  <p className={`
                    text-sm flex items-center gap-2
                    ${isThaiMode ? 'text-orange-700 font-thai' : 'text-blue-700'}
                  `}>
                    <div className={`
                      w-2 h-2 rounded-full animate-pulse
                      ${isThaiMode ? 'bg-orange-500' : 'bg-blue-500'}
                    `}></div>
                    <strong>{t.syncedToCloud}</strong>
                  </p>
                </div>
              )}

              {/* URL Input Card with Thai styling */}
              <div className={`
                bg-white rounded-2xl shadow-lg p-6 mb-6 border
                ${isThaiMode ? 'border-orange-100 bg-gradient-to-br from-white to-yellow-50' : 'border-gray-100'}
              `}>
                <div className="flex gap-3 mb-4">
                  <input
                    type="text"
                    value={inputUrl}
                    onChange={e => setInputUrl(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={t.enterUrl}
                    className={`
                      flex-1 px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200
                      ${isThaiMode 
                        ? 'border-orange-200 focus:ring-orange-500 font-thai' 
                        : 'border-gray-200 focus:ring-blue-500'
                      }
                    `}
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
                    variant={isThaiMode ? "thai" : "primary"}
                    size="md"
                    className="px-6"
                  >
                    {t.addUrl}
                  </TouchButton>
                </div>

                {/* Action buttons with Thai styling */}
                {selectedUrls.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    <TouchButton variant="success" size="sm">
                      <Share2 size={16} />
                      {t.share} ({selectedUrls.length})
                    </TouchButton>
                    <TouchButton variant="warning" size="sm">
                      <Download size={16} />
                      {t.export} ({selectedUrls.length})
                    </TouchButton>
                    <TouchButton variant="danger" size="sm">
                      <Trash2 size={16} />
                      {t.delete} ({selectedUrls.length})
                    </TouchButton>
                  </div>
                )}
              </div>

              {/* Toggle All URLs with Thai styling */}
              {urls.length > 0 && user && (
                <div className="flex justify-center mb-6">
                  <TouchButton
                    onClick={toggleAllUrls}
                    variant={isThaiMode ? "thai" : "purple"}
                    size="md"
                    className="px-6"
                  >
                    {allUrlsHidden ? (
                      <>
                        <Eye size={18} />
                        {t.showAllUrls}
                      </>
                    ) : (
                      <>
                        <EyeOff size={18} />
                        {t.hideAllUrls}
                      </>
                    )}
                  </TouchButton>
                </div>
              )}

              {/* Categories with Thai styling */}
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
                      t={t}
                      isThaiMode={isThaiMode}
                    >
                      {categoryUrls.map(url => (
                        <URLItem
                          key={url.id}
                          url={url}
                          isSelected={selectedUrls.includes(url.id)}
                          onSelect={() => toggleSelectUrl(url.id)}
                          onQRCode={() => openQRModal(url.url)}
                          onSwipeDelete={() => {
                            console.log('Swipe delete:', url.id);
                          }}
                          isThaiMode={isThaiMode}
                        />
                      ))}
                      {categoryUrls.length === 0 && (
                        <div className={`
                          p-6 text-center
                          ${isThaiMode ? 'text-orange-500 font-thai' : 'text-gray-500'}
                        `}>
                          {t.noUrlsInCategory}
                        </div>
                      )}
                    </CategoryCard>
                  );
                })}
              </div>

              {/* Empty state with Thai styling */}
              {urls.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔗</div>
                  <h3 className={`
                    text-xl font-semibold mb-2
                    ${isThaiMode ? 'text-orange-700 font-thai' : 'text-gray-700'}
                  `}>
                    {t.noUrlsYet}
                  </h3>
                  <p className={`
                    mb-6
                    ${isThaiMode ? 'text-orange-500 font-thai' : 'text-gray-500'}
                  `}>
                    {t.noUrlsMessage}
                  </p>
                  {user && (
                    <TouchButton
                      onClick={() => {
                        setInputUrl('https://example.com');
                        setTimeout(() => document.querySelector('input[type="text"]').focus(), 100);
                      }}
                      variant={isThaiMode ? "thai" : "primary"}
                      size="lg"
                    >
                      <Plus size={20} />
                      {t.addFirstUrl}
                    </TouchButton>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Floating Action Button with Thai styling */}
          <FloatingActionButton
            visible={showFAB && user}
            onClick={() => {
              document.querySelector('input[type="text"]').focus();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            isThaiMode={isThaiMode}
          />

          {/* Modals with Thai support */}
          {showCategorySelectionModal && (
            <CategorySelectionModal
              onClose={() => setShowCategorySelectionModal(false)}
              onConfirm={addUrl}
              categories={categories}
              url={pendingUrl}
              t={t}
              isThaiMode={isThaiMode}
            />
          )}
          
          {showAuthModal && (
            <AuthModal
              onClose={() => setShowAuthModal(false)}
              onLogin={handleLogin}
              mandatory={!user}
              t={t}
              isThaiMode={isThaiMode}
            />
          )}
          
          {showQRModal && (
            <QRModal
              url={showQRModal}
              onClose={() => setShowQRModal(null)}
              t={t}
              isThaiMode={isThaiMode}
            />
          )}
        </div>
      </PullToRefresh>
    </>
  );
}

export default App;