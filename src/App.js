import React, { useState, useEffect, useCallback } from 'react';
import { Search, Download, Share2, Trash2, Settings, QrCode, ChevronDown, ChevronUp, Upload, X, LogIn, LogOut, User, Eye, EyeOff, Plus, Sparkles, Globe, Moon, Sun, Palette, Filter, RefreshCw, AlertTriangle, CheckCircle, XCircle, Clock, Edit3, Copy, ExternalLink, Zap, Image, Link } from 'lucide-react';

// Thai translations object (keeping from previous chapters)
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
    themeMode: "โหมดธีม",
    // Chapter 4 new translations
    filters: "ตัวกรอง",
    sortBy: "เรียงตาม",
    status: "สถานะ",
    dateAdded: "วันที่เพิ่ม",
    urlStatus: "สถานะลิงก์",
    working: "ใช้งานได้",
    broken: "เสียหาย",
    pending: "รอตรวจสอบ",
    duplicate: "ซ้ำ",
    checkUrls: "ตรวจสอบลิงก์",
    checkingUrls: "กำลังตรวจสอบลิงก์...",
    bulkEdit: "แก้ไขหลายรายการ",
    duplicates: "รายการซ้ำ",
    foundDuplicates: "พบรายการซ้ำ",
    noDuplicates: "ไม่พบรายการซ้ำ",
    removeDuplicates: "ลบรายการซ้ำ",
    urlPreview: "ดูตัวอย่างลิงก์",
    loadingPreview: "กำลังโหลดตัวอย่าง...",
    errorLoading: "เกิดข้อผิดพลาดในการโหลด",
    validUrl: "ลิงก์ถูกต้อง",
    invalidUrl: "ลิงก์ไม่ถูกต้อง",
    validateUrl: "ตรวจสอบลิงก์",
    copyUrl: "คัดลอกลิงก์",
    openUrl: "เปิดลิงก์",
    editUrl: "แก้ไขลิงก์",
    urlHealth: "สุขภาพลิงก์",
    lastChecked: "ตรวจสอบล่าสุด",
    checkNow: "ตรวจสอบตอนนี้",
    advancedSearch: "ค้นหาขั้นสูง",
    searchInTitle: "ค้นหาในชื่อ",
    searchInUrl: "ค้นหาในลิงก์",
    searchInDescription: "ค้นหาในคำอธิบาย"
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
    themeMode: "Theme Mode",
    // Chapter 4 new translations
    filters: "Filters",
    sortBy: "Sort By",
    status: "Status",
    dateAdded: "Date Added",
    urlStatus: "URL Status",
    working: "Working",
    broken: "Broken",
    pending: "Pending",
    duplicate: "Duplicate",
    checkUrls: "Check URLs",
    checkingUrls: "Checking URLs...",
    bulkEdit: "Bulk Edit",
    duplicates: "Duplicates",
    foundDuplicates: "Found Duplicates",
    noDuplicates: "No Duplicates Found",
    removeDuplicates: "Remove Duplicates",
    urlPreview: "URL Preview",
    loadingPreview: "Loading preview...",
    errorLoading: "Error loading",
    validUrl: "Valid URL",
    invalidUrl: "Invalid URL",
    validateUrl: "Validate URL",
    copyUrl: "Copy URL",
    openUrl: "Open URL",
    editUrl: "Edit URL",
    urlHealth: "URL Health",
    lastChecked: "Last Checked",
    checkNow: "Check Now",
    advancedSearch: "Advanced Search",
    searchInTitle: "Search in Title",
    searchInUrl: "Search in URL",
    searchInDescription: "Search in Description"
  }
};

// Advanced theme system (keeping from Chapter 3)
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

// URL validation and metadata extraction utilities
const urlUtils = {
  // Basic URL validation
  isValidUrl: (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  },

  // Extract domain from URL
  getDomain: (url) => {
    try {
      return new URL(url).hostname;
    } catch (_) {
      return 'Invalid URL';
    }
  },

  // Generate favicon URL
  getFaviconUrl: (url) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
    } catch (_) {
      return null;
    }
  },

  // Simulate URL health check
  checkUrlHealth: async (url) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 500));
    
    // Simulate different response statuses
    const outcomes = ['working', 'broken', 'working', 'working', 'broken'];
    const randomOutcome = outcomes[Math.floor(Math.random() * outcomes.length)];
    
    return {
      status: randomOutcome,
      responseTime: Math.floor(Math.random() * 1000 + 100),
      lastChecked: new Date().toISOString()
    };
  },

  // Extract URL metadata (simulated)
  extractMetadata: async (url) => {
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1500 + 300));
    
    const domain = urlUtils.getDomain(url);
    const titles = [
      `${domain} - Home Page`,
      `Welcome to ${domain}`,
      `${domain} | Official Website`,
      `About ${domain}`,
      `${domain} - News & Updates`
    ];
    
    const descriptions = [
      `Official website of ${domain} with latest updates and information.`,
      `Discover more about ${domain} and explore our content.`,
      `${domain} provides quality content and services.`,
      `Learn more about what ${domain} has to offer.`,
      `Stay connected with ${domain} for the latest news.`
    ];
    
    return {
      title: titles[Math.floor(Math.random() * titles.length)],
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      domain: domain,
      favicon: urlUtils.getFaviconUrl(url)
    };
  }
};

// Advanced components
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
    </div>
  );
};

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
      <div className="relative flex items-center justify-center gap-2">
        {loading ? <LoadingSpinner size="sm" isDark={isDark} /> : children}
      </div>
    </button>
  );
};

// Advanced Search & Filter Component
const AdvancedFilters = ({ 
  searchTerm, 
  setSearchTerm, 
  filters, 
  setFilters, 
  onCheckUrls, 
  isCheckingUrls,
  t, 
  isDark, 
  isThaiMode,
  themeConfig 
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className={`
      ${themeConfig.cardBg} rounded-2xl shadow-xl p-6 mb-6 border glass
      ${themeConfig.cardBorder} ${themeConfig.shadowColor}
    `}>
      {/* Basic Search */}
      <div className="relative mb-4">
        <Search className={`
          absolute left-4 top-1/2 transform -translate-y-1/2 animate-pulse
          ${isDark ? 'text-purple-400' : isThaiMode ? 'text-orange-400' : 'text-blue-400'}
        `} size={20} />
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder={t.searchPlaceholder}
          className={`
            w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent 
            transition-all duration-300 glass font-medium backdrop-blur-xl
            ${isDark 
              ? 'border-purple-500/30 focus:ring-purple-500/30 bg-gray-800/40 text-purple-100 placeholder-purple-300/60' 
              : isThaiMode 
              ? 'border-orange-200/50 focus:ring-orange-500/30 bg-white/60 text-orange-900 placeholder-orange-500/60'
              : 'border-blue-200/50 focus:ring-blue-500/30 bg-white/60 text-blue-900 placeholder-blue-500/60'
            }
          `}
        />
      </div>

      {/* Filter Toggle */}
      <div className="flex justify-between items-center mb-4">
        <TouchButton
          onClick={() => setShowAdvanced(!showAdvanced)}
          variant="secondary"
          size="sm"
          isDark={isDark}
          isThaiMode={isThaiMode}
        >
          <Filter size={16} />
          {t.advancedSearch}
          <ChevronDown size={16} className={`transition-transform duration-300 ${showAdvanced ? 'rotate-180' : ''}`} />
        </TouchButton>

        <TouchButton
          onClick={onCheckUrls}
          variant="primary"
          size="sm"
          loading={isCheckingUrls}
          isDark={isDark}
          isThaiMode={isThaiMode}
        >
          <RefreshCw size={16} />
          {t.checkUrls}
        </TouchButton>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="border-t pt-4 space-y-4">
          {/* Sort By */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${themeConfig.text}`}>
              {t.sortBy}
            </label>
            <select
              value={filters.sortBy}
              onChange={e => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
              className={`
                w-full p-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent
                ${isDark 
                  ? 'border-purple-500/30 focus:ring-purple-500/30 bg-gray-800/40 text-purple-100' 
                  : isThaiMode 
                  ? 'border-orange-200/50 focus:ring-orange-500/30 bg-white/60 text-orange-900'
                  : 'border-blue-200/50 focus:ring-blue-500/30 bg-white/60 text-blue-900'
                }
              `}
            >
              <option value="dateAdded">{t.dateAdded}</option>
              <option value="alphabetical">Alphabetical</option>
              <option value="domain">Domain</option>
              <option value="status">{t.status}</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${themeConfig.text}`}>
              {t.urlStatus}
            </label>
            <div className="flex flex-wrap gap-2">
              {['all', 'working', 'broken', 'pending'].map(status => (
                <TouchButton
                  key={status}
                  onClick={() => setFilters(prev => ({ ...prev, status }))}
                  variant={filters.status === status ? 'primary' : 'secondary'}
                  size="sm"
                  isDark={isDark}
                  isThaiMode={isThaiMode}
                >
                  {status === 'all' ? 'All' : t[status]}
                </TouchButton>
              ))}
            </div>
          </div>

          {/* Search Options */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${themeConfig.text}`}>
              Search In
            </label>
            <div className="space-y-2">
              {[
                { key: 'searchInUrl', label: t.searchInUrl },
                { key: 'searchInTitle', label: t.searchInTitle },
                { key: 'searchInDescription', label: t.searchInDescription }
              ].map(option => (
                <label key={option.key} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters[option.key]}
                    onChange={e => setFilters(prev => ({ ...prev, [option.key]: e.target.checked }))}
                    className="w-4 h-4 rounded"
                  />
                  <span className={`${themeConfig.textSecondary} text-sm`}>{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// URL Preview Component
const URLPreview = ({ url, isDark, isThaiMode, themeConfig }) => {
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadMetadata = async () => {
      try {
        setLoading(true);
        setError(false);
        const data = await urlUtils.extractMetadata(url.url);
        setMetadata(data);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadMetadata();
  }, [url.url]);

  if (loading) {
    return (
      <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-700/30' : 'bg-gray-50/60'} flex items-center gap-3`}>
        <LoadingSpinner size="sm" isDark={isDark} />
        <span className={`text-sm ${themeConfig.textSecondary}`}>Loading preview...</span>
      </div>
    );
  }

  if (error || !metadata) {
    return (
      <div className={`p-4 rounded-xl ${isDark ? 'bg-red-900/20' : 'bg-red-50/60'} flex items-center gap-3`}>
        <AlertTriangle size={16} className="text-red-500" />
        <span className={`text-sm ${themeConfig.textSecondary}`}>Error loading preview</span>
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-700/30' : 'bg-gray-50/60'} space-y-3`}>
      <div className="flex items-start gap-3">
        {metadata.favicon && (
          <img 
            src={metadata.favicon} 
            alt="Favicon" 
            className="w-6 h-6 rounded flex-shrink-0"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        )}
        <div className="flex-1 min-w-0">
          <h4 className={`font-medium ${themeConfig.text} truncate`}>
            {metadata.title}
          </h4>
          <p className={`text-sm ${themeConfig.textSecondary} line-clamp-2 mt-1`}>
            {metadata.description}
          </p>
          <p className={`text-xs ${themeConfig.textSecondary} mt-2 opacity-75`}>
            {metadata.domain}
          </p>
        </div>
      </div>
    </div>
  );
};

// URL Status Indicator
const URLStatusIndicator = ({ status, lastChecked, isDark }) => {
  const statusConfig = {
    working: { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/20' },
    broken: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/20' },
    pending: { icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-500/20' }
  };

  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${config.bg}`}>
      <Icon size={14} className={config.color} />
      <span className={`text-xs font-medium ${config.color}`}>
        {status?.charAt(0).toUpperCase() + status?.slice(1) || 'Pending'}
      </span>
    </div>
  );
};

// Enhanced URL Item with advanced features
const URLItem = ({ 
  url, 
  isSelected, 
  onSelect, 
  onQRCode,
  onSwipeDelete,
  onEdit,
  onCheckHealth,
  theme,
  isDark,
  isThaiMode,
  t,
  showPreview = true
}) => {
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [showActions, setShowActions] = useState(false);

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

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url.url);
      if (navigator.vibrate) {
        navigator.vibrate([50, 30, 50]);
      }
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
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
      
      {/* Main content */}
      <div 
        className={`
          p-5 border-b last:border-b-0 transition-all duration-300 relative overflow-hidden
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
        {/* Top row - checkbox, URL, actions */}
        <div className="flex items-start gap-4 mb-3">
          {/* Enhanced checkbox */}
          <div className="relative flex-shrink-0 z-10 mt-1">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={onSelect}
              className={`
                w-6 h-6 rounded-lg transition-all duration-300
                ${isDark ? 'accent-purple-500' : isThaiMode ? 'accent-orange-500' : 'accent-blue-500'}
                hover:scale-110 transform-gpu
              `}
            />
          </div>
          
          {/* URL content with metadata */}
          <div className="flex-1 min-w-0 z-10 space-y-2">
            {/* URL and favicon */}
            <div className="flex items-center gap-3">
              <img 
                src={urlUtils.getFaviconUrl(url.url)} 
                alt="Favicon" 
                className="w-5 h-5 rounded flex-shrink-0"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <a
                href={url.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`
                  break-all transition-all duration-300 font-medium hover:underline
                  ${isDark 
                    ? 'text-gray-200 hover:text-purple-300' 
                    : isThaiMode 
                    ? 'text-orange-800 hover:text-orange-600'
                    : 'text-gray-800 hover:text-blue-600'
                  }
                `}
              >
                {url.title || urlUtils.getDomain(url.url)}
              </a>
            </div>

            {/* URL domain */}
            <div className={`text-sm ${themeConfig.textSecondary} flex items-center gap-2`}>
              <span>{url.url}</span>
              {url.status && <URLStatusIndicator status={url.status} isDark={isDark} />}
            </div>

            {/* URL Preview */}
            {showPreview && isHovered && (
              <URLPreview 
                url={url} 
                isDark={isDark} 
                isThaiMode={isThaiMode} 
                themeConfig={themeConfig} 
              />
            )}
          </div>
          
          {/* Action buttons */}
          <div className="flex items-center gap-2 z-10">
            <TouchButton
              onClick={copyToClipboard}
              variant="secondary"
              size="sm"
              className="p-2"
              isDark={isDark}
              isThaiMode={isThaiMode}
            >
              <Copy size={16} />
            </TouchButton>

            <TouchButton
              onClick={() => window.open(url.url, '_blank')}
              variant="secondary"
              size="sm"
              className="p-2"
              isDark={isDark}
              isThaiMode={isThaiMode}
            >
              <ExternalLink size={16} />
            </TouchButton>

            <TouchButton
              onClick={onQRCode}
              variant="secondary"
              size="sm"
              className="p-2"
              isDark={isDark}
              isThaiMode={isThaiMode}
            >
              <QrCode size={16} />
            </TouchButton>

            <TouchButton
              onClick={() => setShowActions(!showActions)}
              variant="secondary"
              size="sm"
              className="p-2"
              isDark={isDark}
              isThaiMode={isThaiMode}
            >
              <ChevronDown size={16} className={`transition-transform duration-300 ${showActions ? 'rotate-180' : ''}`} />
            </TouchButton>
          </div>
        </div>

        {/* Expandable actions */}
        {showActions && (
          <div className="border-t pt-3 flex flex-wrap gap-2">
            <TouchButton
              onClick={onEdit}
              variant="secondary"
              size="sm"
              isDark={isDark}
              isThaiMode={isThaiMode}
            >
              <Edit3 size={14} />
              {t.editUrl}
            </TouchButton>

            <TouchButton
              onClick={() => onCheckHealth(url.id)}
              variant="secondary"
              size="sm"
              isDark={isDark}
              isThaiMode={isThaiMode}
            >
              <Zap size={14} />
              {t.checkNow}
            </TouchButton>

            {url.lastChecked && (
              <span className={`text-xs ${themeConfig.textSecondary} flex items-center gap-1 px-3 py-2`}>
                <Clock size={12} />
                {t.lastChecked}: {new Date(url.lastChecked).toLocaleDateString()}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Bulk Edit Modal
const BulkEditModal = ({ 
  selectedUrls, 
  onClose, 
  onBulkAction, 
  categories, 
  t, 
  isDark, 
  isThaiMode,
  themeConfig 
}) => {
  const [bulkAction, setBulkAction] = useState('move');
  const [targetCategory, setTargetCategory] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleBulkAction = async () => {
    setIsProcessing(true);
    await onBulkAction(bulkAction, targetCategory);
    setIsProcessing(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className={`${themeConfig.cardBg} p-8 rounded-3xl max-w-md w-full shadow-2xl border ${themeConfig.cardBorder}`}>
        <div className="flex justify-between items-center mb-6">
          <h3 className={`text-2xl font-bold ${themeConfig.text}`}>
            {t.bulkEdit} ({selectedUrls.length})
          </h3>
          <TouchButton onClick={onClose} variant="secondary" size="sm" className="p-3" isDark={isDark}>
            <X size={20} />
          </TouchButton>
        </div>

        <div className="space-y-6">
          <div>
            <label className={`block text-sm font-medium mb-3 ${themeConfig.text}`}>
              Action
            </label>
            <div className="space-y-2">
              {[
                { value: 'move', label: 'Move to Category' },
                { value: 'delete', label: 'Delete URLs' },
                { value: 'check', label: 'Check URL Health' },
                { value: 'export', label: 'Export URLs' }
              ].map(action => (
                <label key={action.value} className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="bulkAction"
                    value={action.value}
                    checked={bulkAction === action.value}
                    onChange={e => setBulkAction(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className={themeConfig.textSecondary}>{action.label}</span>
                </label>
              ))}
            </div>
          </div>

          {bulkAction === 'move' && (
            <div>
              <label className={`block text-sm font-medium mb-3 ${themeConfig.text}`}>
                Target Category
              </label>
              <select
                value={targetCategory}
                onChange={e => setTargetCategory(e.target.value)}
                className={`
                  w-full p-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent
                  ${isDark 
                    ? 'border-purple-500/30 focus:ring-purple-500/30 bg-gray-800/40 text-purple-100' 
                    : isThaiMode 
                    ? 'border-orange-200/50 focus:ring-orange-500/30 bg-white/60 text-orange-900'
                    : 'border-blue-200/50 focus:ring-blue-500/30 bg-white/60 text-blue-900'
                  }
                `}
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          )}

          <div className="flex gap-3">
            <TouchButton
              onClick={onClose}
              variant="secondary"
              size="md"
              className="flex-1"
              isDark={isDark}
              isThaiMode={isThaiMode}
            >
              {t.cancel}
            </TouchButton>
            <TouchButton
              onClick={handleBulkAction}
              variant="primary"
              size="md"
              className="flex-1"
              loading={isProcessing}
              disabled={bulkAction === 'move' && !targetCategory}
              isDark={isDark}
              isThaiMode={isThaiMode}
            >
              {t.confirm}
            </TouchButton>
          </div>
        </div>
      </div>
    </div>
  );
};

// Duplicate Detection Component
const DuplicateManager = ({ urls, onRemoveDuplicates, t, isDark, isThaiMode, themeConfig }) => {
  const [duplicates, setDuplicates] = useState([]);
  const [loading, setLoading] = useState(false);

  const findDuplicates = useCallback(() => {
    const urlMap = new Map();
    const duplicateGroups = [];

    urls.forEach(url => {
      const normalizedUrl = url.url.toLowerCase().replace(/\/$/, '');
      if (urlMap.has(normalizedUrl)) {
        urlMap.get(normalizedUrl).push(url);
      } else {
        urlMap.set(normalizedUrl, [url]);
      }
    });

    urlMap.forEach(group => {
      if (group.length > 1) {
        duplicateGroups.push(group);
      }
    });

    setDuplicates(duplicateGroups);
  }, [urls]);

  useEffect(() => {
    findDuplicates();
  }, [findDuplicates]);

  const handleRemoveDuplicates = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing
    
    const urlsToKeep = [];
    const urlsToRemove = [];

    duplicates.forEach(group => {
      urlsToKeep.push(group[0]); // Keep first occurrence
      urlsToRemove.push(...group.slice(1)); // Remove duplicates
    });

    onRemoveDuplicates(urlsToRemove.map(url => url.id));
    setLoading(false);
  };

  if (duplicates.length === 0) {
    return (
      <div className={`${themeConfig.cardBg} rounded-2xl p-6 border ${themeConfig.cardBorder} text-center`}>
        <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
        <p className={`${themeConfig.text} font-medium`}>{t.noDuplicates}</p>
      </div>
    );
  }

  return (
    <div className={`${themeConfig.cardBg} rounded-2xl p-6 border ${themeConfig.cardBorder} space-y-4`}>
      <div className="flex justify-between items-center">
        <h3 className={`text-xl font-bold ${themeConfig.text}`}>
          {t.foundDuplicates} ({duplicates.length} groups)
        </h3>
        <TouchButton
          onClick={handleRemoveDuplicates}
          variant="warning"
          size="sm"
          loading={loading}
          isDark={isDark}
          isThaiMode={isThaiMode}
        >
          <Trash2 size={16} />
          {t.removeDuplicates}
        </TouchButton>
      </div>

      <div className="space-y-3">
        {duplicates.slice(0, 5).map((group, index) => (
          <div key={index} className={`p-4 rounded-xl ${isDark ? 'bg-yellow-900/20' : 'bg-yellow-50/60'} border-l-4 border-yellow-500`}>
            <p className={`font-medium ${themeConfig.text} mb-2`}>
              Duplicate Group {index + 1} ({group.length} URLs)
            </p>
            {group.map((url, urlIndex) => (
              <div key={url.id} className={`text-sm ${themeConfig.textSecondary} flex items-center gap-2`}>
                <span className={`w-2 h-2 rounded-full ${urlIndex === 0 ? 'bg-green-500' : 'bg-red-500'}`}></span>
                <span className={urlIndex === 0 ? 'font-medium' : ''}>{url.url}</span>
                {urlIndex === 0 && <span className="text-green-600 text-xs">(Keep)</span>}
              </div>
            ))}
          </div>
        ))}
        {duplicates.length > 5 && (
          <p className={`text-sm ${themeConfig.textSecondary} text-center`}>
            ...and {duplicates.length - 5} more groups
          </p>
        )}
      </div>
    </div>
  );
};

// Main App Component with Advanced Features
function App() {
  // Theme and visual state (from Chapter 3)
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('en');
  
  // Basic app state
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
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
  const [searchTerm, setSearchTerm] = useState('');
  const [allUrlsHidden, setAllUrlsHidden] = useState(false);
  const [showFAB, setShowFAB] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Chapter 4: Advanced features state
  const [filters, setFilters] = useState({
    sortBy: 'dateAdded',
    status: 'all',
    searchInUrl: true,
    searchInTitle: true,
    searchInDescription: false
  });
  const [isCheckingUrls, setIsCheckingUrls] = useState(false);
  const [showBulkEdit, setShowBulkEdit] = useState(false);
  const [showDuplicates, setShowDuplicates] = useState(false);

  // Computed values
  const isDark = theme === 'dark' || theme === 'thaiDark';
  const isThaiMode = language === 'th';
  const currentTheme = isThaiMode ? (isDark ? 'thaiDark' : 'thai') : (isDark ? 'dark' : 'light');
  const themeConfig = themes[currentTheme];
  const t = translations[language];

  // Theme and language handlers (from Chapter 3)
  const toggleTheme = () => {
    if (isThaiMode) {
      setTheme(theme === 'thai' ? 'thaiDark' : 'thai');
    } else {
      setTheme(theme === 'light' ? 'dark' : 'light');
    }
  };

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'th' : 'en';
    setLanguage(newLang);
    
    if (newLang === 'th') {
      setTheme(isDark ? 'thaiDark' : 'thai');
    } else {
      setTheme(isDark ? 'dark' : 'light');
    }
    
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

  // Chapter 4: Advanced URL functions
  const checkAllUrls = async () => {
    setIsCheckingUrls(true);
    
    const urlPromises = urls.map(async (url) => {
      const health = await urlUtils.checkUrlHealth(url.url);
      return { ...url, ...health };
    });

    try {
      const updatedUrls = await Promise.all(urlPromises);
      setUrls(updatedUrls);
    } catch (error) {
      console.error('Error checking URLs:', error);
    } finally {
      setIsCheckingUrls(false);
    }
  };

  const checkSingleUrl = async (urlId) => {
    const urlToCheck = urls.find(u => u.id === urlId);
    if (!urlToCheck) return;

    const health = await urlUtils.checkUrlHealth(urlToCheck.url);
    setUrls(prev => prev.map(u => 
      u.id === urlId ? { ...u, ...health } : u
    ));
  };

  const handleBulkAction = async (action, targetCategory) => {
    switch (action) {
      case 'move':
        setUrls(prev => prev.map(url => 
          selectedUrls.includes(url.id) 
            ? { ...url, category: targetCategory }
            : url
        ));
        break;
      case 'delete':
        if (window.confirm(t.deleteConfirm)) {
          setUrls(prev => prev.filter(url => !selectedUrls.includes(url.id)));
        }
        break;
      case 'check':
        const selectedUrlObjects = urls.filter(u => selectedUrls.includes(u.id));
        const healthPromises = selectedUrlObjects.map(async (url) => {
          const health = await urlUtils.checkUrlHealth(url.url);
          return { ...url, ...health };
        });
        
        const updatedUrls = await Promise.all(healthPromises);
        setUrls(prev => prev.map(url => {
          const updated = updatedUrls.find(u => u.id === url.id);
          return updated || url;
        }));
        break;
      case 'export':
        // Export functionality would go here
        break;
    }
    setSelectedUrls([]);
  };

  const removeDuplicates = (duplicateIds) => {
    setUrls(prev => prev.filter(url => !duplicateIds.includes(url.id)));
  };

  // Enhanced filtering and sorting
  const getFilteredUrls = () => {
    let filteredUrls = urls;

    // Apply search filter
    if (searchTerm) {
      filteredUrls = filteredUrls.filter(url => {
        const searchLower = searchTerm.toLowerCase();
        const checks = [];
        
        if (filters.searchInUrl) {
          checks.push(url.url.toLowerCase().includes(searchLower));
        }
        if (filters.searchInTitle && url.title) {
          checks.push(url.title.toLowerCase().includes(searchLower));
        }
        if (filters.searchInDescription && url.description) {
          checks.push(url.description.toLowerCase().includes(searchLower));
        }
        
        return checks.some(Boolean);
      });
    }

    // Apply status filter
    if (filters.status !== 'all') {
      filteredUrls = filteredUrls.filter(url => url.status === filters.status);
    }

    // Apply sorting
    filteredUrls.sort((a, b) => {
      switch (filters.sortBy) {
        case 'alphabetical':
          return (a.title || a.url).localeCompare(b.title || b.url);
        case 'domain':
          return urlUtils.getDomain(a.url).localeCompare(urlUtils.getDomain(b.url));
        case 'status':
          return (a.status || 'pending').localeCompare(b.status || 'pending');
        case 'dateAdded':
        default:
          return new Date(b.dateAdded || b.id) - new Date(a.dateAdded || a.id);
      }
    });

    return filteredUrls;
  };

  // Basic handlers (simplified from previous chapters)
  const addUrl = (category, isNewCategory = false) => {
    const normalized = inputUrl.trim();
    if (normalized && urlUtils.isValidUrl(normalized) && !urls.find(u => u.url === normalized)) {
      if (isNewCategory && !categories.includes(category)) {
        setCategories([...categories, category]);
      }
      
      const newUrl = {
        id: Date.now(),
        url: normalized,
        category: category,
        dateAdded: new Date().toISOString(),
        status: 'pending'
      };
      setUrls([...urls, newUrl]);
      
      // Enhanced haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
      }
    }
    setInputUrl('https://');
  };

  const handleUrlSubmit = () => {
    const normalized = inputUrl.trim();
    if (normalized && urlUtils.isValidUrl(normalized)) {
      // For demo, just add to first category
      addUrl(categories[0]);
    }
  };

  const toggleSelectUrl = (urlId) => {
    setSelectedUrls(
      selectedUrls.includes(urlId)
        ? selectedUrls.filter(id => id !== urlId)
        : [...selectedUrls, urlId]
    );
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleUrlSubmit();
    }
  };

  const openQRModal = (url) => {
    setShowQRModal(url);
  };

  // Get URLs by category with advanced filtering
  const getUrlsByCategory = () => {
    const filteredUrls = getFilteredUrls();
    const grouped = {};
    
    categories.forEach(cat => {
      grouped[cat] = filteredUrls.filter(url => url.category === cat);
    });
    
    return grouped;
  };

  const urlsByCategory = getUrlsByCategory();

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

  return (
    <>
      {/* Enhanced Google Fonts and Styles */}
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
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
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
        
        .glass {
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
      `}</style>

      <div className={`
        min-h-screen pb-32 transition-all duration-700 relative overflow-hidden
        bg-gradient-to-br ${themeConfig.bg}
        ${isThaiMode ? 'font-thai' : 'font-inter'}
      `}>
        <div className="max-w-6xl mx-auto relative z-10">
          {/* Enhanced Header */}
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
                  <TouchButton onClick={toggleTheme} variant="secondary" size="sm" isDark={isDark}>
                    {isDark ? <Sun size={16} /> : <Moon size={16} />}
                  </TouchButton>
                  <TouchButton onClick={toggleLanguage} variant="secondary" size="sm" isDark={isDark}>
                    <Globe size={16} />
                    {language === 'th' ? 'ไทย' : 'EN'}
                  </TouchButton>
                  
                  {user ? (
                    <div className="flex items-center gap-3">
                      <div className={`
                        flex items-center gap-3 px-4 py-3 rounded-2xl glass border
                        ${isDark ? 'bg-purple-900/40 border-purple-700/30' : isThaiMode ? 'bg-orange-100/60 border-orange-200/30' : 'bg-green-100/60 border-green-200/30'}
                      `}>
                        <div className={`
                          w-3 h-3 rounded-full animate-pulse
                          ${isDark ? 'bg-purple-400' : isThaiMode ? 'bg-orange-500' : 'bg-green-500'}
                        `}></div>
                        <span className={`
                          text-sm font-bold truncate max-w-24
                          ${isDark ? 'text-purple-200' : isThaiMode ? 'text-orange-700' : 'text-green-700'}
                        `}>
                          {user.email.split('@')[0]}
                        </span>
                      </div>
                      <TouchButton onClick={() => setUser(null)} variant="danger" size="sm" className="p-3" isDark={isDark}>
                        <LogOut size={18} />
                      </TouchButton>
                    </div>
                  ) : (
                    <TouchButton onClick={() => setShowAuthModal(true)} variant="primary" size="md" isDark={isDark}>
                      <LogIn size={18} />
                      <span className="hidden sm:inline font-bold">{t.signIn}</span>
                    </TouchButton>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="px-6">
            {/* Advanced Search & Filters */}
            <AdvancedFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filters={filters}
              setFilters={setFilters}
              onCheckUrls={checkAllUrls}
              isCheckingUrls={isCheckingUrls}
              t={t}
              isDark={isDark}
              isThaiMode={isThaiMode}
              themeConfig={themeConfig}
            />

            {/* Advanced Action Bar */}
            {user && (
              <div className={`
                ${themeConfig.cardBg} rounded-2xl shadow-xl p-6 mb-6 border glass
                ${themeConfig.cardBorder} ${themeConfig.shadowColor}
              `}>
                <div className="flex flex-wrap gap-3 mb-4">
                  <input
                    type="text"
                    value={inputUrl}
                    onChange={e => setInputUrl(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={t.enterUrl}
                    className={`
                      flex-1 min-w-0 px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent 
                      transition-all duration-300 font-medium glass backdrop-blur-xl
                      ${isDark 
                        ? 'border-purple-500/30 focus:ring-purple-500/30 bg-gray-800/40 text-purple-100 placeholder-purple-300/60' 
                        : isThaiMode 
                        ? 'border-orange-200/50 focus:ring-orange-500/30 bg-white/60 text-orange-900 placeholder-orange-500/60'
                        : 'border-blue-200/50 focus:ring-blue-500/30 bg-white/60 text-blue-900 placeholder-blue-500/60'
                      }
                    `}
                    disabled={!user}
                    autoComplete="off"
                  />
                  <TouchButton
                    onClick={handleUrlSubmit}
                    disabled={!user || !urlUtils.isValidUrl(inputUrl)}
                    variant="primary"
                    size="md"
                    isDark={isDark}
                    isThaiMode={isThaiMode}
                  >
                    <Plus size={18} />
                    {t.addUrl}
                  </TouchButton>
                </div>

                {/* Advanced bulk actions */}
                {selectedUrls.length > 0 && (
                  <div className="flex flex-wrap gap-3">
                    <TouchButton 
                      onClick={() => setShowBulkEdit(true)}
                      variant="primary" 
                      size="sm" 
                      isDark={isDark} 
                      isThaiMode={isThaiMode}
                    >
                      <Edit3 size={16} />
                      {t.bulkEdit} ({selectedUrls.length})
                    </TouchButton>
                    <TouchButton variant="success" size="sm" isDark={isDark} isThaiMode={isThaiMode}>
                      <Share2 size={16} />
                      {t.share}
                    </TouchButton>
                    <TouchButton variant="warning" size="sm" isDark={isDark} isThaiMode={isThaiMode}>
                      <Download size={16} />
                      {t.export}
                    </TouchButton>
                    <TouchButton variant="danger" size="sm" isDark={isDark} isThaiMode={isThaiMode}>
                      <Trash2 size={16} />
                      {t.delete}
                    </TouchButton>
                  </div>
                )}

                <div className="flex flex-wrap gap-3 mt-4">
                  <TouchButton 
                    onClick={() => setShowDuplicates(!showDuplicates)}
                    variant="secondary" 
                    size="sm" 
                    isDark={isDark} 
                    isThaiMode={isThaiMode}
                  >
                    <Copy size={16} />
                    {t.duplicates}
                  </TouchButton>
                </div>
              </div>
            )}

            {/* Duplicate Manager */}
            {showDuplicates && (
              <div className="mb-6">
                <DuplicateManager
                  urls={urls}
                  onRemoveDuplicates={removeDuplicates}
                  t={t}
                  isDark={isDark}
                  isThaiMode={isThaiMode}
                  themeConfig={themeConfig}
                />
              </div>
            )}

            {/* Enhanced Categories with Advanced URL Items */}
            <div className="space-y-6">
              {categories.map(category => {
                const categoryUrls = urlsByCategory[category] || [];
                const isExpanded = expandedCategories[category] && !allUrlsHidden;
                const selectedInCategory = categoryUrls.filter(url => selectedUrls.includes(url.id)).length;
                
                if (categoryUrls.length === 0 && searchTerm) return null;
                
                return (
                  <div key={category} className={`
                    ${themeConfig.cardBg} rounded-3xl shadow-2xl overflow-hidden border 
                    ${themeConfig.cardBorder} ${themeConfig.shadowColor}
                    hover:shadow-3xl transition-all duration-500 transform hover:scale-[1.01]
                  `}>
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
                      onClick={() => setExpandedCategories(prev => ({ ...prev, [category]: !prev[category] }))}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <div className={`
                            w-4 h-4 rounded-full flex-shrink-0 animate-pulse shadow-lg
                            ${isDark 
                              ? isThaiMode ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 'bg-gradient-to-r from-purple-400 to-pink-500'
                              : isThaiMode ? 'bg-gradient-to-r from-yellow-500 to-orange-600' : 'bg-gradient-to-r from-blue-500 to-indigo-600'
                            }
                          `}></div>
                          <div className={isThaiMode ? 'font-thai' : ''}>
                            <span className={`font-bold text-xl ${themeConfig.text}`}>{category}</span>
                            <div className={`text-sm ${themeConfig.textSecondary} flex gap-3 mt-1`}>
                              <span>{categoryUrls.length} {t.urls}</span>
                              {selectedInCategory > 0 && (
                                <span className={`font-semibold ${isDark ? 'text-purple-300' : 'text-blue-600'}`}>
                                  {selectedInCategory} {t.selected}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {categoryUrls.length > 0 && (
                            <TouchButton
                              onClick={(e) => {
                                e.stopPropagation();
                                const categoryIds = categoryUrls.map(u => u.id);
                                const allSelected = categoryIds.every(id => selectedUrls.includes(id));
                                if (allSelected) {
                                  setSelectedUrls(selectedUrls.filter(id => !categoryIds.includes(id)));
                                } else {
                                  setSelectedUrls([...new Set([...selectedUrls, ...categoryIds])]);
                                }
                              }}
                              variant={isDark ? "purple" : isThaiMode ? "warning" : "primary"}
                              size="sm"
                              className="text-xs font-bold"
                              isDark={isDark}
                              isThaiMode={isThaiMode}
                            >
                              {selectedInCategory === categoryUrls.length ? t.deselectAll : t.selectAll}
                            </TouchButton>
                          )}
                          <div className={`
                            p-3 rounded-2xl shadow-lg transition-all duration-300 backdrop-blur-sm
                            ${isDark ? 'bg-gray-700/60' : 'bg-white/80'}
                            ${isExpanded ? 'rotate-180 scale-110' : 'rotate-0 scale-100'}
                          `}>
                            <ChevronDown size={20} className={themeConfig.textSecondary} />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Enhanced expand/collapse */}
                    <div className={`
                      transition-all duration-500 ease-out overflow-hidden
                      ${isExpanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}
                    `}>
                      <div className={`border-t ${isDark ? 'border-gray-700/50' : 'border-gray-200/50'}`}>
                        {categoryUrls.map(url => (
                          <URLItem
                            key={url.id}
                            url={url}
                            isSelected={selectedUrls.includes(url.id)}
                            onSelect={() => toggleSelectUrl(url.id)}
                            onQRCode={() => openQRModal(url.url)}
                            onSwipeDelete={() => {
                              setUrls(prev => prev.filter(u => u.id !== url.id));
                            }}
                            onEdit={() => {
                              // Edit functionality would go here
                            }}
                            onCheckHealth={checkSingleUrl}
                            theme={currentTheme}
                            isDark={isDark}
                            isThaiMode={isThaiMode}
                            t={t}
                            showPreview={true}
                          />
                        ))}
                        {categoryUrls.length === 0 && (
                          <div className={`p-8 text-center text-lg font-medium ${themeConfig.textSecondary}`}>
                            {t.noUrlsInCategory}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Enhanced empty state */}
            {urls.length === 0 && (
              <div className="text-center py-16">
                <div className="text-8xl mb-6 animate-bounce">🔗</div>
                <h3 className={`text-2xl sm:text-3xl font-black mb-4 ${themeConfig.text}`}>
                  {t.noUrlsYet}
                </h3>
                <p className={`mb-8 text-lg font-medium ${themeConfig.textSecondary}`}>
                  {t.noUrlsMessage}
                </p>
                {user && (
                  <TouchButton
                    onClick={() => {
                      setInputUrl('https://example.com');
                      setTimeout(() => document.querySelector('input[type="text"]')?.focus(), 100);
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

        {/* Enhanced Modals */}
        {showBulkEdit && (
          <BulkEditModal
            selectedUrls={selectedUrls}
            onClose={() => setShowBulkEdit(false)}
            onBulkAction={handleBulkAction}
            categories={categories}
            t={t}
            isDark={isDark}
            isThaiMode={isThaiMode}
            themeConfig={themeConfig}
          />
        )}

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

        {showAuthModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className={`${themeConfig.cardBg} p-8 rounded-3xl max-w-md w-full shadow-2xl border ${themeConfig.cardBorder}`}>
              <div className="flex justify-between items-center mb-6">
                <h3 className={`text-2xl font-bold ${themeConfig.text}`}>{t.signInRequired}</h3>
              </div>
              <div className="mb-6">
                <input
                  type="email"
                  placeholder={t.emailPlaceholder}
                  className={`
                    w-full p-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent
                    ${isDark 
                      ? 'border-purple-500/30 focus:ring-purple-500/30 bg-gray-800/40 text-purple-100' 
                      : isThaiMode 
                      ? 'border-orange-200/50 focus:ring-orange-500/30 bg-white/60 text-orange-900'
                      : 'border-blue-200/50 focus:ring-blue-500/30 bg-white/60 text-blue-900'
                    }
                  `}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && e.target.value.trim()) {
                      setUser({ email: e.target.value.trim() });
                      setShowAuthModal(false);
                    }
                  }}
                />
              </div>
              <TouchButton
                onClick={() => {
                  const email = document.querySelector('input[type="email"]').value.trim();
                  if (email) {
                    setUser({ email });
                    setShowAuthModal(false);
                  }
                }}
                variant="primary"
                size="lg"
                className="w-full"
                isDark={isDark}
                isThaiMode={isThaiMode}
              >
                {t.signIn}
              </TouchButton>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;