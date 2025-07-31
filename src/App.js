import React, { useState, useEffect } from 'react';
import { Search, Download, Share2, Trash2, Settings, QrCode, ChevronDown, ChevronUp, Upload, X, LogIn, LogOut, User, Eye, EyeOff, Plus, Sparkles, Globe, Moon, Sun, Palette } from 'lucide-react';

// Thai translations object (keeping from Chapter 2)
const translations = {
  th: {
    appTitle: "ข่าวดี: คลังเก็บลิงก์",
    appSubtitle: "Thai Good News URL Vault",
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
    signInMessage: "กรุณาเข้าสู่ระบบเพื่อบันทึกลิงก์และซิงค์ข้อมูลระหว่างอุปกรณ์",
    syncedToCloud: "ซิงค์กับคลาวด์: ข้อมูลของคุณบันทึกและซิงค์อัตโนมัติในทุกอุปกรณ์",
    dataWillSync: "📱 ข้อมูลจะซิงค์ในทุกอุปกรณ์ของคุณ",
    simpleAccount: "🔒 บัญชีแบบง่าย (ไม่ต้องใช้รหัสผ่านสำหรับการทดลอง)",
    enterUrl: "ป้อนลิงก์และกด Enter...",
    addUrl: "เพิ่มลิงก์",
    searchPlaceholder: "ค้นหาลิงก์และหมวดหมู่...",
    noUrlsYet: "ยังไม่มีลิงก์",
    noUrlsMessage: "เพิ่มลิงก์เพื่อเริ่มต้น!",
    addFirstUrl: "เพิ่มลิงก์แรกของคุณ",
    addToCategory: "เพิ่มลิงก์ไปยังหมวดหมู่",
    chooseCategory: "เลือกหมวดหมู่",
    createNewCategory: "+ สร้างหมวดหมู่ใหม่",
    newCategoryName: "ชื่อหมวดหมู่ใหม่",
    backToExisting: "← กลับไปหมวดหมู่ที่มี",
    noCategory: "ไม่มีหมวดหมู่",
    saveForLater: "เก็บไว้ดูทีหลัง",
    thailand: "ประเทศไทย",
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
    qrCode: "คิวอาร์โค้ด",
    small: "เล็ก",
    large: "ใหญ่",
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
    manage: "จัดการ",
    manageCategories: "จัดการหมวดหมู่",
    searchCategories: "ค้นหาหมวดหมู่...",
    add: "เพิ่ม",
    noUrlsInCategory: "ไม่มีลิงก์ในหมวดหมู่นี้",
    deleteConfirm: "คุณแน่ใจหรือไม่ที่จะลบลิงก์ที่เลือก?",
    refreshing: "กำลังรีเฟรช...",
    pullToRefresh: "ดึงลงเพื่อรีเฟรช",
    releaseToRefresh: "ปล่อยเพื่อรีเฟรช",
    installApp: "ติดตั้งแอป",
    and: "และ",
    more: "เพิ่มเติม",
    darkMode: "โหมดมืด",
    lightMode: "โหมดสว่าง",
    themeMode: "โหมดธีม"
  },
  en: {
    appTitle: "Good News: URL Vault",
    appSubtitle: "ข่าวดี Thai Good News",
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
    signInMessage: "Please sign in to save your URLs and sync across devices",
    syncedToCloud: "Synced to Cloud: Your data automatically saves and syncs across all your devices",
    dataWillSync: "📱 Your data will sync across all your devices",
    simpleAccount: "🔒 Simple email-based account (no password needed for demo)",
    enterUrl: "Enter URL and press Enter...",
    addUrl: "Add URL",
    searchPlaceholder: "Search URLs and categories...",
    noUrlsYet: "No URLs added yet",
    noUrlsMessage: "Add some URLs to get started!",
    addFirstUrl: "Add Your First URL",
    addToCategory: "Add URL to Category",
    chooseCategory: "Choose Category",
    createNewCategory: "+ Create new category",
    newCategoryName: "New category name",
    backToExisting: "← Back to existing categories",
    noCategory: "No Category",
    saveForLater: "Save for Later",
    thailand: "Thailand",
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
    qrCode: "QR Code",
    small: "Small",
    large: "Large",
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
    manage: "Manage",
    manageCategories: "Manage Categories",
    searchCategories: "Search categories...",
    add: "Add",
    noUrlsInCategory: "No URLs in this category",
    deleteConfirm: "Are you sure you want to delete the selected URLs?",
    refreshing: "Refreshing...",
    pullToRefresh: "Pull to refresh",
    releaseToRefresh: "Release to refresh",
    installApp: "Install App",
    and: "and",
    more: "more",
    darkMode: "Dark Mode",
    lightMode: "Light Mode",
    themeMode: "Theme Mode"
  }
};

// Advanced theme system
const themes = {
  light: {
    bg: 'from-blue-50 via-white to-indigo-50',
    cardBg: 'bg-white/80 backdrop-blur-xl',
    cardBorder: 'border-white/20',
    text: 'text-gray-800',
    textSecondary: 'text-gray-600',
    accent: 'from-blue-500 to-indigo-600',
    accentHover: 'from-blue-600 to-indigo-700',
    headerBg: 'bg-white/70 backdrop-blur-xl',
    shadowColor: 'shadow-blue-500/10'
  },
  dark: {
    bg: 'from-gray-900 via-slate-900 to-purple-900',
    cardBg: 'bg-gray-800/60 backdrop-blur-xl',
    cardBorder: 'border-gray-700/30',
    text: 'text-gray-100',
    textSecondary: 'text-gray-300',
    accent: 'from-purple-500 to-pink-600',
    accentHover: 'from-purple-600 to-pink-700',
    headerBg: 'bg-gray-900/70 backdrop-blur-xl',
    shadowColor: 'shadow-purple-500/20'
  },
  thai: {
    bg: 'from-yellow-50 via-orange-50 to-red-50',
    cardBg: 'bg-white/80 backdrop-blur-xl',
    cardBorder: 'border-orange-200/30',
    text: 'text-orange-900',
    textSecondary: 'text-orange-700',
    accent: 'from-yellow-500 to-orange-600',
    accentHover: 'from-yellow-600 to-orange-700',
    headerBg: 'bg-yellow-100/70 backdrop-blur-xl',
    shadowColor: 'shadow-orange-500/20'
  },
  thaiDark: {
    bg: 'from-orange-900 via-red-900 to-yellow-900',
    cardBg: 'bg-orange-800/60 backdrop-blur-xl',
    cardBorder: 'border-orange-700/30',
    text: 'text-orange-100',
    textSecondary: 'text-orange-200',
    accent: 'from-yellow-400 to-orange-500',
    accentHover: 'from-yellow-500 to-orange-600',
    headerBg: 'bg-orange-900/70 backdrop-blur-xl',
    shadowColor: 'shadow-yellow-500/20'
  }
};

// Floating particles background component
const FloatingParticles = ({ isDark, isThaiMode }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      speed: Math.random() * 2 + 1,
      opacity: Math.random() * 0.6 + 0.1
    }));
    setParticles(newParticles);
  }, []);

  const particleColor = isDark 
    ? (isThaiMode ? 'bg-yellow-400/20' : 'bg-purple-400/20')
    : (isThaiMode ? 'bg-orange-400/30' : 'bg-blue-400/30');

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map(particle => (
        <div
          key={particle.id}
          className={`absolute rounded-full ${particleColor} animate-pulse`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            animation: `float-${particle.id} ${particle.speed * 10}s infinite linear`
          }}
        />
      ))}
      <style jsx>{`
        ${particles.map(particle => `
          @keyframes float-${particle.id} {
            0% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
            100% { transform: translateY(0px) rotate(360deg); }
          }
        `).join('')}
      `}</style>
    </div>
  );
};

// Enhanced Loading Component with glow effects
const LoadingSpinner = ({ size = 'sm', isDark }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };
  
  return (
    <div className={`${sizeClasses[size]} animate-spin relative`}>
      <div className={`
        h-full w-full rounded-full border-2 
        ${isDark 
          ? 'border-purple-300 border-t-purple-500 shadow-lg shadow-purple-500/30' 
          : 'border-blue-300 border-t-blue-500 shadow-lg shadow-blue-500/30'
        }
      `}></div>
      <div className={`
        absolute inset-0 rounded-full animate-pulse
        ${isDark ? 'bg-purple-500/20' : 'bg-blue-500/20'}
      `}></div>
    </div>
  );
};

// Ultra-enhanced button with glassmorphism and 3D effects
const TouchButton = ({ 
  children, 
  onClick, 
  disabled = false, 
  loading = false, 
  variant = 'primary', 
  size = 'md',
  className = '',
  isDark = false,
  isThaiMode = false,
  ...props 
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = (e) => {
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
    
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 150);
    
    if (!disabled && !loading && onClick) {
      onClick(e);
    }
  };

  const getVariantStyles = () => {
    const baseStyles = `
      relative overflow-hidden rounded-2xl font-semibold transition-all duration-300
      transform hover:scale-105 active:scale-95 backdrop-blur-xl
      disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50
      shadow-xl hover:shadow-2xl
    `;

    switch (variant) {
      case 'primary':
        return `${baseStyles} ${
          isDark 
            ? 'bg-gradient-to-r from-purple-500/80 to-pink-600/80 hover:from-purple-600/90 hover:to-pink-700/90 text-white border border-purple-400/30 shadow-purple-500/30' 
            : isThaiMode
            ? 'bg-gradient-to-r from-yellow-500/90 to-orange-600/90 hover:from-yellow-600/95 hover:to-orange-700/95 text-white border border-yellow-400/30 shadow-orange-500/30'
            : 'bg-gradient-to-r from-blue-500/90 to-indigo-600/90 hover:from-blue-600/95 hover:to-indigo-700/95 text-white border border-blue-400/30 shadow-blue-500/30'
        }`;
      case 'secondary':
        return `${baseStyles} ${
          isDark 
            ? 'bg-gray-700/60 hover:bg-gray-600/70 text-gray-200 border border-gray-600/30' 
            : 'bg-gray-100/70 hover:bg-gray-200/80 text-gray-700 border border-gray-300/30'
        }`;
      case 'success':
        return `${baseStyles} bg-gradient-to-r from-green-500/80 to-emerald-600/80 hover:from-green-600/90 hover:to-emerald-700/90 text-white border border-green-400/30 shadow-green-500/30`;
      case 'warning':
        return `${baseStyles} bg-gradient-to-r from-yellow-500/80 to-amber-600/80 hover:from-yellow-600/90 hover:to-amber-700/90 text-white border border-yellow-400/30 shadow-yellow-500/30`;
      case 'danger':
        return `${baseStyles} bg-gradient-to-r from-red-500/80 to-rose-600/80 hover:from-red-600/90 hover:to-rose-700/90 text-white border border-red-400/30 shadow-red-500/30`;
      case 'purple':
        return `${baseStyles} bg-gradient-to-r from-purple-500/80 to-violet-600/80 hover:from-purple-600/90 hover:to-violet-700/90 text-white border border-purple-400/30 shadow-purple-500/30`;
      case 'indigo':
        return `${baseStyles} bg-gradient-to-r from-indigo-500/80 to-blue-600/80 hover:from-indigo-600/90 hover:to-blue-700/90 text-white border border-indigo-400/30 shadow-indigo-500/30`;
      case 'thai':
        return `${baseStyles} ${
          isDark
            ? 'bg-gradient-to-r from-yellow-400/80 to-orange-500/80 hover:from-yellow-500/90 hover:to-orange-600/90 text-orange-900 border border-yellow-400/30 shadow-yellow-500/30'
            : 'bg-gradient-to-r from-yellow-500/90 to-orange-600/90 hover:from-yellow-600/95 hover:to-orange-700/95 text-white border border-yellow-400/30 shadow-orange-500/30'
        }`;
      default:
        return baseStyles;
    }
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || loading}
      className={`
        ${getVariantStyles()} ${sizes[size]} ${className}
        ${isPressed ? 'scale-95 brightness-110' : ''}
        group
      `}
      {...props}
    >
      {/* Shimmer effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
      </div>
      
      {/* Content */}
      <div className="relative flex items-center justify-center gap-2">
        {loading ? <LoadingSpinner size="sm" isDark={isDark} /> : children}
      </div>
    </button>
  );
};

// Theme Toggle Component with smooth animations
const ThemeToggle = ({ theme, onToggle, t }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = () => {
    setIsAnimating(true);
    onToggle();
    setTimeout(() => setIsAnimating(false), 300);
  };

  const isDark = theme === 'dark' || theme === 'thaiDark';
  
  return (
    <TouchButton
      onClick={handleToggle}
      variant="secondary"
      size="sm"
      className={`
        relative overflow-hidden
        ${isDark ? 'bg-gray-800/60' : 'bg-white/60'}
        ${isAnimating ? 'animate-pulse' : ''}
      `}
      isDark={isDark}
    >
      <div className="flex items-center gap-2">
        <div className={`
          transition-transform duration-300 
          ${isDark ? 'rotate-180 scale-110' : 'rotate-0 scale-100'}
        `}>
          {isDark ? <Moon size={16} /> : <Sun size={16} />}
        </div>
        <span className="font-medium text-xs">
          {isDark ? t.darkMode : t.lightMode}
        </span>
      </div>
      
      {/* Animated background */}
      <div className={`
        absolute inset-0 transition-all duration-500
        ${isDark 
          ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20' 
          : 'bg-gradient-to-r from-yellow-400/20 to-orange-400/20'
        }
        ${isAnimating ? 'animate-pulse' : ''}
      `}></div>
    </TouchButton>
  );
};

// Language Toggle with enhanced effects
const LanguageToggle = ({ currentLang, onToggle, isDark }) => {
  return (
    <TouchButton
      onClick={onToggle}
      variant="secondary"
      size="sm"
      className="relative overflow-hidden"
      isDark={isDark}
    >
      <Globe size={16} className="animate-pulse" />
      <span className="font-bold">
        {currentLang === 'th' ? 'ไทย' : 'EN'}
      </span>
      
      {/* Rotating globe effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-green-500/10 to-blue-500/10 animate-pulse"></div>
    </TouchButton>
  );
};

// Ultra-enhanced Category Card with advanced glassmorphism
const CategoryCard = ({ 
  category, 
  urlCount, 
  isExpanded, 
  onToggle, 
  onSelectAll, 
  children,
  selectedCount = 0,
  t,
  theme,
  isDark,
  isThaiMode
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const themeConfig = themes[theme];

  const handleToggle = (e) => {
    setIsAnimating(true);
    onToggle(e);
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <div 
      className={`
        ${themeConfig.cardBg} rounded-3xl shadow-2xl transition-all duration-500 overflow-hidden 
        border ${themeConfig.cardBorder} ${themeConfig.shadowColor}
        hover:shadow-3xl hover:scale-[1.02] transform-gpu
        ${isHovered ? 'shadow-3xl' : ''}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`
          p-6 cursor-pointer transition-all duration-300 relative overflow-hidden
          ${isDark 
            ? 'bg-gradient-to-r from-gray-800/30 to-gray-700/30 hover:from-gray-700/40 hover:to-gray-600/40' 
            : isThaiMode 
            ? 'bg-gradient-to-r from-yellow-50/50 to-orange-50/50 hover:from-yellow-100/60 hover:to-orange-100/60'
            : 'bg-gradient-to-r from-blue-50/50 to-indigo-50/50 hover:from-blue-100/60 hover:to-indigo-100/60'
          }
        `}
        onClick={handleToggle}
      >
        {/* Animated background effect */}
        <div className={`
          absolute inset-0 opacity-0 transition-opacity duration-300
          ${isHovered ? 'opacity-100' : ''}
          ${isDark 
            ? 'bg-gradient-to-r from-purple-500/10 to-pink-500/10' 
            : 'bg-gradient-to-r from-blue-500/10 to-indigo-500/10'
          }
        `}></div>
        
        <div className="flex justify-between items-center relative z-10">
          <div className="flex items-center gap-4">
            <div className={`
              w-4 h-4 rounded-full flex-shrink-0 animate-pulse shadow-lg
              ${isDark 
                ? isThaiMode ? 'bg-gradient-to-r from-yellow-400 to-orange-500 shadow-yellow-500/50' : 'bg-gradient-to-r from-purple-400 to-pink-500 shadow-purple-500/50'
                : isThaiMode ? 'bg-gradient-to-r from-yellow-500 to-orange-600 shadow-orange-500/50' : 'bg-gradient-to-r from-blue-500 to-indigo-600 shadow-blue-500/50'
              }
            `}></div>
            <div className={isThaiMode ? 'font-thai' : ''}>
              <span className={`font-bold text-xl ${themeConfig.text}`}>{category}</span>
              <div className={`text-sm ${themeConfig.textSecondary} flex gap-3 mt-1`}>
                <span className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-purple-400' : 'bg-blue-400'} animate-pulse`}></div>
                  {urlCount} {t.urls}
                </span>
                {selectedCount > 0 && (
                  <span className={`font-semibold flex items-center gap-1 ${isDark ? 'text-purple-300' : 'text-blue-600'}`}>
                    <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-pink-400' : 'bg-green-400'} animate-pulse`}></div>
                    {selectedCount} {t.selected}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {urlCount > 0 && (
              <TouchButton
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectAll();
                }}
                variant={isDark ? "purple" : isThaiMode ? "thai" : "primary"}
                size="sm"
                className="text-xs font-bold"
                isDark={isDark}
                isThaiMode={isThaiMode}
              >
                {selectedCount === urlCount ? t.deselectAll : t.selectAll}
              </TouchButton>
            )}
            <div className={`
              p-3 rounded-2xl shadow-lg transition-all duration-300 backdrop-blur-sm
              ${isDark ? 'bg-gray-700/60 shadow-purple-500/20' : 'bg-white/80 shadow-blue-500/20'}
              ${isExpanded ? 'rotate-180 scale-110' : 'rotate-0 scale-100'}
              ${isHovered ? 'scale-110 shadow-xl' : ''}
            `}>
              <ChevronDown size={20} className={`${themeConfig.textSecondary} transition-colors duration-300`} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Smooth expand/collapse with enhanced animation */}
      <div className={`
        transition-all duration-500 ease-out overflow-hidden
        ${isExpanded ? 'max-h-screen opacity-100 transform translate-y-0' : 'max-h-0 opacity-0 transform -translate-y-4'}
      `}>
        <div className={`border-t ${isDark ? 'border-gray-700/50' : 'border-gray-200/50'}`}>
          {children}
        </div>
      </div>
    </div>
  );
};

// Enhanced URL Item with advanced hover effects
const URLItem = ({ 
  url, 
  isSelected, 
  onSelect, 
  onQRCode,
  onSwipeDelete,
  theme,
  isDark,
  isThaiMode
}) => {
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const themeConfig = themes[theme];

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
    <div 
      className="relative overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Enhanced delete background */}
      <div className={`
        absolute right-0 top-0 h-full flex items-center justify-center transition-all duration-300
        ${isDark 
          ? 'bg-gradient-to-l from-red-600/90 to-pink-600/90' 
          : 'bg-gradient-to-l from-red-500/90 to-orange-500/90'
        }
        shadow-2xl
      `}
           style={{ width: `${swipeOffset}px` }}>
        <Trash2 size={20} className="text-white animate-pulse" />
      </div>
      
      {/* Main content with advanced effects */}
      <div 
        className={`
          p-5 border-b last:border-b-0 flex items-center gap-5
          transition-all duration-300 relative overflow-hidden
          ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}
          ${isDark ? 'border-gray-700/30' : 'border-gray-200/30'}
          ${isDark 
            ? 'bg-gradient-to-r from-gray-800/40 to-gray-700/40 hover:from-gray-700/60 hover:to-gray-600/60' 
            : isThaiMode 
            ? 'bg-gradient-to-r from-white/60 to-yellow-50/60 hover:from-yellow-50/80 hover:to-orange-50/80'
            : 'bg-gradient-to-r from-white/60 to-blue-50/60 hover:from-blue-50/80 hover:to-indigo-50/80'
          }
          ${isHovered ? 'shadow-lg scale-[1.01] transform-gpu' : ''}
        `}
        style={{ transform: `translateX(-${swipeOffset}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Animated background glow */}
        <div className={`
          absolute inset-0 opacity-0 transition-opacity duration-300
          ${isHovered ? 'opacity-100' : ''}
          ${isDark 
            ? 'bg-gradient-to-r from-purple-500/5 to-pink-500/5' 
            : 'bg-gradient-to-r from-blue-500/5 to-indigo-500/5'
          }
        `}></div>
        
        {/* Enhanced checkbox with glow */}
        <div className="relative flex-shrink-0 z-10">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onSelect}
            className={`
              w-7 h-7 rounded-xl transition-all duration-300
              ${isDark ? 'accent-purple-500' : isThaiMode ? 'accent-orange-500' : 'accent-blue-500'}
              hover:scale-110 transform-gpu
            `}
          />
          {isSelected && (
            <div className="absolute inset-0 pointer-events-none">
              <div className={`
                w-7 h-7 rounded-xl flex items-center justify-center animate-pulse
                ${isDark 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-600 shadow-lg shadow-purple-500/50' 
                  : isThaiMode 
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-600 shadow-lg shadow-orange-500/50'
                  : 'bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/50'
                }
              `}>
                <div className="w-4 h-4 border-2 border-white rounded-sm"></div>
              </div>
            </div>
          )}
        </div>
        
        {/* URL content with enhanced typography */}
        <div className="flex-1 min-w-0 z-10">
          <a
            href={url.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`
              block break-all transition-all duration-300 font-medium
              ${isDark 
                ? 'text-gray-200 hover:text-purple-300' 
                : isThaiMode 
                ? 'text-orange-800 hover:text-orange-600 font-thai'
                : 'text-gray-800 hover:text-blue-600'
              }
              hover:scale-[1.02] transform-gpu
            `}
          >
            <span className={`text-sm opacity-60`}>https://</span>
            <span className="font-semibold tracking-wide">{url.url.replace(/^https?:\/\//, '')}</span>
          </a>
        </div>
        
        {/* Enhanced QR Code button */}
        <TouchButton
          onClick={(e) => {
            e.preventDefault();
            onQRCode();
          }}
          variant="secondary"
          size="sm"
          className={`
            flex-shrink-0 p-4 z-10 group
            ${isDark ? 'hover:bg-purple-700/30' : isThaiMode ? 'hover:bg-orange-100/80' : 'hover:bg-blue-100/80'}
          `}
          isDark={isDark}
          isThaiMode={isThaiMode}
        >
          <QrCode size={20} className="group-hover:scale-110 transition-transform duration-200" />
        </TouchButton>
      </div>
    </div>
  );
};

// Enhanced Floating Action Button
const FloatingActionButton = ({ onClick, visible = true, theme, isDark, isThaiMode }) => {
  const [isPulsing, setIsPulsing] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsPulsing(true);
      setTimeout(() => setIsPulsing(false), 1000);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`
      fixed bottom-8 right-8 z-50 transition-all duration-500
      ${visible ? 'scale-100 opacity-100 translate-y-0' : 'scale-0 opacity-0 translate-y-4'}
    `}>
      <TouchButton
        onClick={onClick}
        variant="primary"
        size="lg"
        className={`
          w-20 h-20 rounded-full shadow-2xl relative overflow-hidden
          ${isPulsing ? 'animate-pulse scale-110' : ''}
          hover:scale-110 transform-gpu
          ${isDark 
            ? 'shadow-purple-500/30' 
            : isThaiMode 
            ? 'shadow-orange-500/30'
            : 'shadow-blue-500/30'
          }
        `}
        isDark={isDark}
        isThaiMode={isThaiMode}
      >
        <Plus size={28} className="animate-pulse" />
        
        {/* Orbiting elements */}
        <div className="absolute inset-0">
          <div className={`
            absolute w-2 h-2 rounded-full animate-spin
            ${isDark ? 'bg-purple-300' : isThaiMode ? 'bg-orange-300' : 'bg-blue-300'}
          `} style={{ 
            top: '10%', 
            left: '50%', 
            transformOrigin: '0 40px',
            animation: 'spin 4s linear infinite'
          }}></div>
        </div>
      </TouchButton>
    </div>
  );
};

// Enhanced Pull to Refresh
const PullToRefresh = ({ onRefresh, children, t, theme, isDark }) => {
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
      setPullDistance(Math.min(120, diff));
    }
  };

  const handleTouchEnd = async () => {
    if (pullDistance > 80) {
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
      {/* Enhanced pull indicator */}
      <div 
        className={`
          absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full
          transition-all duration-300 flex flex-col items-center justify-center
          font-bold text-sm backdrop-blur-sm rounded-2xl px-6 py-3
          ${isDark 
            ? 'text-purple-300 bg-purple-900/60 shadow-lg shadow-purple-500/20' 
            : 'text-blue-600 bg-blue-100/80 shadow-lg shadow-blue-500/20'
          }
        `}
        style={{ 
          height: `${pullDistance}px`,
          opacity: pullDistance > 30 ? 1 : 0 
        }}
      >
        {isRefreshing ? (
          <>
            <LoadingSpinner size="md" isDark={isDark} />
            <span className="mt-2">{t.refreshing}</span>
          </>
        ) : (
          <>
            <Sparkles size={28} className="animate-pulse" />
            <span className="mt-2">
              {pullDistance > 80 ? t.releaseToRefresh : t.pullToRefresh}
            </span>
          </>
        )}
      </div>
      
      <div style={{ transform: `translateY(${pullDistance * 0.5}px)` }}>
        {children}
      </div>
    </div>
  );
};

// Enhanced modals will use similar patterns but I'll focus on the main app structure
// Main App Component with Visual Enhancement
function App() {
  // Theme and visual state
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('en');
  
  // App state
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [urls, setUrls] = useState([]);
  const [inputUrl, setInputUrl] = useState('https://');
  const [selectedUrls, setSelectedUrls] = useState([]);
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
  const [showFAB, setShowFAB] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Computed values
  const isDark = theme === 'dark' || theme === 'thaiDark';
  const isThaiMode = language === 'th';
  const currentTheme = isThaiMode ? (isDark ? 'thaiDark' : 'thai') : (isDark ? 'dark' : 'light');
  const themeConfig = themes[currentTheme];
  const t = translations[language];

  // Theme toggle handler
  const toggleTheme = () => {
    if (isThaiMode) {
      setTheme(theme === 'thai' ? 'thaiDark' : 'thai');
    } else {
      setTheme(theme === 'light' ? 'dark' : 'light');
    }
  };

  // Language toggle handler
  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'th' : 'en';
    setLanguage(newLang);
    
    // Update theme accordingly
    if (newLang === 'th') {
      setTheme(isDark ? 'thaiDark' : 'thai');
    } else {
      setTheme(isDark ? 'dark' : 'light');
    }
    
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

  // Other handlers (simplified for space)
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

  const normalizeUrl = (url) => {
    let trimmed = url.trim().replaceAll(' ', '');
    if (!trimmed || trimmed === 'https://') return '';
    trimmed = trimmed.replace(/^https?:\/\//, '');
    return trimmed ? `https://${trimmed}` : '';
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
      
      // Enhanced haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
      }
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
    await new Promise(resolve => setTimeout(resolve, 1500));
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
      {/* Enhanced Google Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700;800&family=Noto+Sans+Thai:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700;800;900&display=swap"
        rel="stylesheet"
      />
      
      <style jsx>{`
        .font-thai {
          font-family: 'Sarabun', 'Noto Sans Thai', system-ui, sans-serif;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: ${isDark ? 'rgba(75, 85, 99, 0.3)' : 'rgba(243, 244, 246, 0.5)'};
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: ${isDark ? 'rgba(147, 51, 234, 0.6)' : 'rgba(59, 130, 246, 0.6)'};
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: ${isDark ? 'rgba(147, 51, 234, 0.8)' : 'rgba(59, 130, 246, 0.8)'};
        }
        
        /* Glass morphism utilities */
        .glass {
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        
        /* Animated gradient backgrounds */
        .animated-bg {
          background-size: 200% 200%;
          animation: gradient 15s ease infinite;
        }
        
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        /* Floating animation */
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>

      <div className={`
        min-h-screen pb-32 transition-all duration-700 relative overflow-hidden
        bg-gradient-to-br ${themeConfig.bg} animated-bg
        ${isThaiMode ? 'font-thai' : 'font-inter'}
      `}>
        {/* Floating particles background */}
        <FloatingParticles isDark={isDark} isThaiMode={isThaiMode} />
        
        <PullToRefresh onRefresh={handleRefresh} t={t} theme={currentTheme} isDark={isDark}>
          <div className="max-w-5xl mx-auto relative z-10">
            {/* Ultra-enhanced Header */}
            <div className={`
              sticky top-0 z-40 border-b p-6 mb-8 glass
              ${themeConfig.headerBg} ${themeConfig.cardBorder}
              shadow-2xl ${themeConfig.shadowColor}
            `}>
              <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <h1 className={`
                      text-2xl sm:text-3xl lg:text-4xl font-black mb-2
                      bg-gradient-to-r ${themeConfig.accent} bg-clip-text text-transparent
                      animate-pulse
                    `}>
                      {t.appTitle}
                    </h1>
                    <p className={`
                      text-sm sm:text-base opacity-80 font-medium
                      ${themeConfig.textSecondary}
                    `}>
                      {t.appSubtitle}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <ThemeToggle theme={currentTheme} onToggle={toggleTheme} t={t} />
                    <LanguageToggle currentLang={language} onToggle={toggleLanguage} isDark={isDark} />
                    
                    {user ? (
                      <div className="flex items-center gap-3">
                        <div className={`
                          flex items-center gap-3 px-4 py-3 rounded-2xl glass border
                          ${isDark ? 'bg-purple-900/40 border-purple-700/30' : isThaiMode ? 'bg-orange-100/60 border-orange-200/30' : 'bg-green-100/60 border-green-200/30'}
                        `}>
                          <div className={`
                            w-3 h-3 rounded-full animate-pulse shadow-lg
                            ${isDark ? 'bg-purple-400 shadow-purple-400/50' : isThaiMode ? 'bg-orange-500 shadow-orange-500/50' : 'bg-green-500 shadow-green-500/50'}
                          `}></div>
                          <span className={`
                            text-sm font-bold truncate max-w-24
                            ${isDark ? 'text-purple-200' : isThaiMode ? 'text-orange-700' : 'text-green-700'}
                          `}>
                            {user.email.split('@')[0]}
                          </span>
                        </div>
                        <TouchButton
                          onClick={handleLogout}
                          variant="danger"
                          size="sm"
                          className="p-3"
                          isDark={isDark}
                          isThaiMode={isThaiMode}
                        >
                          <LogOut size={18} />
                        </TouchButton>
                      </div>
                    ) : (
                      <TouchButton
                        onClick={() => setShowAuthModal(true)}
                        variant="primary"
                        size="md"
                        isDark={isDark}
                        isThaiMode={isThaiMode}
                      >
                        <LogIn size={18} />
                        <span className="hidden sm:inline font-bold">{t.signIn}</span>
                      </TouchButton>
                    )}
                    
                    {showInstallButton && (
                      <TouchButton
                        onClick={() => {/* Install logic */}}
                        variant="purple"
                        size="sm"
                        className="p-3"
                        isDark={isDark}
                        isThaiMode={isThaiMode}
                      >
                        📱
                      </TouchButton>
                    )}
                  </div>
                </div>

                {/* Ultra-enhanced Search */}
                <div className="relative">
                  <Search className={`
                    absolute left-6 top-1/2 transform -translate-y-1/2 animate-pulse
                    ${isDark ? 'text-purple-400' : isThaiMode ? 'text-orange-400' : 'text-blue-400'}
                  `} size={22} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder={t.searchPlaceholder}
                    className={`
                      w-full pl-16 pr-6 py-4 border-2 rounded-3xl focus:outline-none focus:ring-4 focus:border-transparent 
                      transition-all duration-300 glass font-medium text-lg backdrop-blur-xl
                      ${isDark 
                        ? 'border-purple-500/30 focus:ring-purple-500/30 bg-gray-800/40 text-purple-100 placeholder-purple-300/60' 
                        : isThaiMode 
                        ? 'border-orange-200/50 focus:ring-orange-500/30 bg-white/60 text-orange-900 placeholder-orange-500/60'
                        : 'border-blue-200/50 focus:ring-blue-500/30 bg-white/60 text-blue-900 placeholder-blue-500/60'
                      }
                      hover:scale-[1.02] transform-gpu shadow-xl ${themeConfig.shadowColor}
                    `}
                  />
                </div>
              </div>
            </div>

            <div className="px-6">
              {/* Enhanced status indicators */}
              {!user && (
                <div className={`
                  mb-8 p-6 border rounded-3xl glass shadow-2xl ${themeConfig.shadowColor}
                  ${isDark ? 'bg-yellow-900/40 border-yellow-700/30' : 'bg-yellow-50/80 border-yellow-200/50'}
                `}>
                  <p className={`
                    font-bold flex items-center gap-3 text-lg
                    ${isDark ? 'text-yellow-200' : 'text-yellow-800'}
                  `}>
                    🔒 {t.signInMessage}
                  </p>
                </div>
              )}
              
              {user && (
                <div className={`
                  mb-8 p-6 rounded-3xl border glass shadow-2xl ${themeConfig.shadowColor}
                  ${isDark ? 'bg-purple-900/40 border-purple-700/30' : isThaiMode ? 'bg-orange-50/80 border-orange-200/50' : 'bg-blue-50/80 border-blue-200/50'}
                `}>
                  <p className={`
                    text-sm sm:text-base flex items-center gap-3 font-bold
                    ${isDark ? 'text-purple-200' : isThaiMode ? 'text-orange-700' : 'text-blue-700'}
                  `}>
                    <div className={`
                      w-3 h-3 rounded-full animate-pulse shadow-lg
                      ${isDark ? 'bg-purple-400 shadow-purple-400/50' : isThaiMode ? 'bg-orange-500 shadow-orange-500/50' : 'bg-blue-500 shadow-blue-500/50'}
                    `}></div>
                    {t.syncedToCloud}
                  </p>
                </div>
              )}

              {/* Ultra-enhanced URL Input Card */}
              <div className={`
                ${themeConfig.cardBg} rounded-3xl shadow-2xl p-8 mb-8 border glass
                ${themeConfig.cardBorder} ${themeConfig.shadowColor}
                hover:shadow-3xl transition-all duration-500 transform hover:scale-[1.01]
              `}>
                <div className="flex gap-4 mb-6">
                  <input
                    type="text"
                    value={inputUrl}
                    onChange={e => setInputUrl(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={t.enterUrl}
                    className={`
                      flex-1 px-6 py-4 border-2 rounded-2xl focus:outline-none focus:ring-4 focus:border-transparent 
                      transition-all duration-300 font-medium text-lg glass backdrop-blur-xl
                      ${isDark 
                        ? 'border-purple-500/30 focus:ring-purple-500/30 bg-gray-800/40 text-purple-100 placeholder-purple-300/60' 
                        : isThaiMode 
                        ? 'border-orange-200/50 focus:ring-orange-500/30 bg-white/60 text-orange-900 placeholder-orange-500/60'
                        : 'border-blue-200/50 focus:ring-blue-500/30 bg-white/60 text-blue-900 placeholder-blue-500/60'
                      }
                      shadow-xl ${themeConfig.shadowColor}
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
                    variant="primary"
                    size="lg"
                    className="px-8 font-bold text-lg"
                    isDark={isDark}
                    isThaiMode={isThaiMode}
                  >
                    {t.addUrl}
                  </TouchButton>
                </div>

                {/* Enhanced action buttons */}
                {selectedUrls.length > 0 && (
                  <div className="flex flex-wrap gap-3">
                    <TouchButton variant="success" size="md" isDark={isDark} isThaiMode={isThaiMode}>
                      <Share2 size={20} />
                      {t.share} ({selectedUrls.length})
                    </TouchButton>
                    <TouchButton variant="warning" size="md" isDark={isDark} isThaiMode={isThaiMode}>
                      <Download size={20} />
                      {t.export} ({selectedUrls.length})
                    </TouchButton>
                    <TouchButton variant="danger" size="md" isDark={isDark} isThaiMode={isThaiMode}>
                      <Trash2 size={20} />
                      {t.delete} ({selectedUrls.length})
                    </TouchButton>
                  </div>
                )}
              </div>

              {/* Enhanced Toggle All URLs */}
              {urls.length > 0 && user && (
                <div className="flex justify-center mb-8">
                  <TouchButton
                    onClick={toggleAllUrls}
                    variant="purple"
                    size="lg"
                    className="px-8 font-bold"
                    isDark={isDark}
                    isThaiMode={isThaiMode}
                  >
                    {allUrlsHidden ? (
                      <>
                        <Eye size={22} />
                        {t.showAllUrls}
                      </>
                    ) : (
                      <>
                        <EyeOff size={22} />
                        {t.hideAllUrls}
                      </>
                    )}
                  </TouchButton>
                </div>
              )}

              {/* Enhanced Categories */}
              <div className="space-y-6">
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
                      theme={currentTheme}
                      isDark={isDark}
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
                          theme={currentTheme}
                          isDark={isDark}
                          isThaiMode={isThaiMode}
                        />
                      ))}
                      {categoryUrls.length === 0 && (
                        <div className={`
                          p-8 text-center text-lg font-medium
                          ${themeConfig.textSecondary}
                        `}>
                          {t.noUrlsInCategory}
                        </div>
                      )}
                    </CategoryCard>
                  );
                })}
              </div>

              {/* Enhanced empty state */}
              {urls.length === 0 && (
                <div className="text-center py-16">
                  <div className="text-8xl mb-6 animate-bounce">🔗</div>
                  <h3 className={`
                    text-2xl sm:text-3xl font-black mb-4
                    ${themeConfig.text}
                  `}>
                    {t.noUrlsYet}
                  </h3>
                  <p className={`
                    mb-8 text-lg font-medium
                    ${themeConfig.textSecondary}
                  `}>
                    {t.noUrlsMessage}
                  </p>
                  {user && (
                    <TouchButton
                      onClick={() => {
                        setInputUrl('https://example.com');
                        setTimeout(() => document.querySelector('input[type="text"]').focus(), 100);
                      }}
                      variant="primary"
                      size="lg"
                      className="font-bold text-xl px-12 py-6"
                      isDark={isDark}
                      isThaiMode={isThaiMode}
                    >
                      <Plus size={24} />
                      {t.addFirstUrl}
                    </TouchButton>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Floating Action Button */}
          <FloatingActionButton
            visible={showFAB && user}
            onClick={() => {
              document.querySelector('input[type="text"]').focus();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            theme={currentTheme}
            isDark={isDark}
            isThaiMode={isThaiMode}
          />

          {/* Modals would go here - simplified for space */}
          {/* Basic modal placeholders */}
          {showQRModal && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
              <div className={`${themeConfig.cardBg} p-8 rounded-3xl max-w-md w-full shadow-2xl border ${themeConfig.cardBorder}`}>
                <div className="flex justify-between items-center mb-6">
                  <h3 className={`text-2xl font-bold ${themeConfig.text}`}>{t.qrCode}</h3>
                  <TouchButton onClick={() => setShowQRModal(null)} variant="secondary" size="sm" className="p-3" isDark={isDark}>
                    <X size={20} />
                  </TouchButton>
                </div>
                <div className="text-center mb-6">
                  <div className={`p-6 rounded-2xl inline-block ${isDark ? 'bg-gray-700/60' : 'bg-gray-50/80'}`}>
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(showQRModal)}`}
                      alt="QR Code"
                      className="rounded-lg shadow-lg"
                    />
                  </div>
                </div>
                <div className={`p-4 rounded-2xl ${isDark ? 'bg-gray-700/60' : 'bg-gray-50/80'}`}>
                  <p className={`text-sm break-all text-center font-mono ${themeConfig.textSecondary}`}>{showQRModal}</p>
                </div>
              </div>
            </div>
          )}
        </PullToRefresh>
      </div>
    </>
  );
}

export default App;