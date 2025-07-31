import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Search, Download, Share2, Trash2, QrCode, ChevronDown, X, LogIn, LogOut, Eye, EyeOff, Plus, Sparkles, Globe, Moon, Sun, Filter, RefreshCw, AlertTriangle, CheckCircle, XCircle, Clock, Edit3, Copy, ExternalLink, Zap, Database, HardDrive, Wifi, WifiOff, Activity, BarChart3, TrendingUp, Archive, Save, CloudDownload, CloudUpload, Gauge, MemoryStick } from 'lucide-react';

// Enhanced translations with Chapter 5 additions
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
    searchInDescription: "ค้นหาในคำอธิบาย",
    // Chapter 5 new translations
    performance: "ประสิทธิภาพ",
    dataManagement: "จัดการข้อมูล",
    analytics: "การวิเคราะห์",
    backup: "สำรองข้อมูล",
    restore: "กู้คืนข้อมูล",
    offlineMode: "โหมดออฟไลน์",
    onlineMode: "โหมดออนไลน์",
    syncStatus: "สถานะซิงค์",
    dataSize: "ขนาดข้อมูล",
    totalUrls: "จำนวนลิงก์ทั้งหมด",
    categories: "หมวดหมู่",
    workingUrls: "ลิงก์ใช้งานได้",
    brokenUrls: "ลิงก์เสียหาย",
    pendingUrls: "ลิงก์รอตรวจสอบ",
    compressionRatio: "อัตราการบีบอัด",
    memoryUsage: "การใช้หน่วยความจำ",
    loadTime: "เวลาโหลด",
    virtualScrolling: "การเลื่อนเสมือน",
    enabled: "เปิดใช้งาน",
    disabled: "ปิดใช้งาน",
    backupData: "สำรองข้อมูล",
    restoreData: "กู้คืนข้อมูล",
    exportData: "ส่งออกข้อมูล",
    importData: "นำเข้าข้อมูล",
    dataIntegrity: "ความสมบูรณ์ของข้อมูล",
    verified: "ตรวจสอบแล้ว",
    corrupted: "เสียหาย",
    optimizing: "กำลังเพิ่มประสิทธิภาพ...",
    compressing: "กำลังบีบอัด...",
    decompressing: "กำลังขยาย...",
    indexing: "กำลังสร้างดัชนี...",
    searching: "กำลังค้นหา...",
    performanceMode: "โหมดประสิทธิภาพ",
    standardMode: "โหมดมาตรฐาน",
    advancedAnalytics: "การวิเคราะห์ขั้นสูง",
    urlInsights: "ข้อมูลเชิงลึกลิงก์",
    domainAnalysis: "การวิเคราะห์โดเมน",
    categoryDistribution: "การกระจายหมวดหมู่",
    healthReport: "รายงานสุขภาพ",
    trendAnalysis: "การวิเคราะห์แนวโน้ม",
    dataVisualization: "การแสดงข้อมูลแบบกราฟิก"
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
    searchInDescription: "Search in Description",
    // Chapter 5 new translations
    performance: "Performance",
    dataManagement: "Data Management",
    analytics: "Analytics",
    backup: "Backup",
    restore: "Restore",
    offlineMode: "Offline Mode",
    onlineMode: "Online Mode",
    syncStatus: "Sync Status",
    dataSize: "Data Size",
    totalUrls: "Total URLs",
    categories: "Categories",
    workingUrls: "Working URLs",
    brokenUrls: "Broken URLs",
    pendingUrls: "Pending URLs",
    compressionRatio: "Compression Ratio",
    memoryUsage: "Memory Usage",
    loadTime: "Load Time",
    virtualScrolling: "Virtual Scrolling",
    enabled: "Enabled",
    disabled: "Disabled",
    backupData: "Backup Data",
    restoreData: "Restore Data",
    exportData: "Export Data",
    importData: "Import Data",
    dataIntegrity: "Data Integrity",
    verified: "Verified",
    corrupted: "Corrupted",
    optimizing: "Optimizing...",
    compressing: "Compressing...",
    decompressing: "Decompressing...",
    indexing: "Indexing...",
    searching: "Searching...",
    performanceMode: "Performance Mode",
    standardMode: "Standard Mode",
    advancedAnalytics: "Advanced Analytics",
    urlInsights: "URL Insights",
    domainAnalysis: "Domain Analysis",
    categoryDistribution: "Category Distribution",
    healthReport: "Health Report",
    trendAnalysis: "Trend Analysis",
    dataVisualization: "Data Visualization"
  }
};

// Enhanced theme system (keeping from previous chapters)
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

// Chapter 5: Advanced Data Management Utilities
const dataUtils = {
  // Compress data using simplified algorithm
  compress: (data) => {
    try {
      const jsonString = JSON.stringify(data);
      // Simulate compression with basic encoding
      const compressed = btoa(jsonString);
      return {
        data: compressed,
        originalSize: jsonString.length,
        compressedSize: compressed.length,
        ratio: (compressed.length / jsonString.length * 100).toFixed(1)
      };
    } catch (error) {
      return { data, originalSize: 0, compressedSize: 0, ratio: '100.0' };
    }
  },

  // Decompress data
  decompress: (compressedData) => {
    try {
      const decompressed = atob(compressedData);
      return JSON.parse(decompressed);
    } catch (error) {
      return null;
    }
  },

  // Calculate data size in bytes
  getDataSize: (data) => {
    return new Blob([JSON.stringify(data)]).size;
  },

  // Format bytes to human readable
  formatBytes: (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  // Create data fingerprint for integrity checking
  createFingerprint: (data) => {
    const str = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  },

  // Verify data integrity
  verifyIntegrity: (data, expectedFingerprint) => {
    const actualFingerprint = dataUtils.createFingerprint(data);
    return actualFingerprint === expectedFingerprint;
  },

  // Create backup with metadata
  createBackup: (urls, categories, metadata = {}) => {
    const backup = {
      version: '5.0',
      timestamp: new Date().toISOString(),
      urls,
      categories,
      metadata: {
        totalUrls: urls.length,
        totalCategories: categories.length,
        ...metadata
      },
      fingerprint: dataUtils.createFingerprint({ urls, categories })
    };
    
    return dataUtils.compress(backup);
  },

  // Restore from backup
  restoreBackup: (backupData) => {
    try {
      const decompressed = dataUtils.decompress(backupData.data);
      if (!decompressed || !decompressed.urls || !decompressed.categories) {
        throw new Error('Invalid backup format');
      }
      
      // Verify integrity if fingerprint exists
      if (decompressed.fingerprint) {
        const dataToVerify = { 
          urls: decompressed.urls, 
          categories: decompressed.categories 
        };
        if (!dataUtils.verifyIntegrity(dataToVerify, decompressed.fingerprint)) {
          throw new Error('Data integrity check failed');
        }
      }
      
      return {
        success: true,
        urls: decompressed.urls,
        categories: decompressed.categories,
        metadata: decompressed.metadata
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
};

// Performance Monitor Hook
const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState({
    memoryUsage: 0,
    renderTime: 0,
    searchTime: 0,
    dataSize: 0,
    compressionRatio: 0
  });

  const measureRenderTime = useCallback((startTime) => {
    const endTime = performance.now();
    setMetrics(prev => ({ ...prev, renderTime: endTime - startTime }));
  }, []);

  const measureSearchTime = useCallback((startTime) => {
    const endTime = performance.now();
    setMetrics(prev => ({ ...prev, searchTime: endTime - startTime }));
  }, []);

  const updateMemoryUsage = useCallback(() => {
    if ('memory' in performance) {
      setMetrics(prev => ({ 
        ...prev, 
        memoryUsage: performance.memory.usedJSHeapSize 
      }));
    }
  }, []);

  const updateDataMetrics = useCallback((urls) => {
    const dataSize = dataUtils.getDataSize(urls);
    const compressed = dataUtils.compress(urls);
    setMetrics(prev => ({
      ...prev,
      dataSize,
      compressionRatio: compressed.ratio
    }));
  }, []);

  return {
    metrics,
    measureRenderTime,
    measureSearchTime,
    updateMemoryUsage,
    updateDataMetrics
  };
};

// Virtual Scrolling Hook
const useVirtualScrolling = (items, itemHeight = 100, containerHeight = 600) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [isEnabled, setIsEnabled] = useState(items.length > 50);

  const visibleStart = Math.floor(scrollTop / itemHeight);
  const visibleEnd = Math.min(
    visibleStart + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  );

  const visibleItems = useMemo(() => {
    if (!isEnabled) return items;
    return items.slice(visibleStart, visibleEnd).map((item, index) => ({
      ...item,
      virtualIndex: visibleStart + index
    }));
  }, [items, visibleStart, visibleEnd, isEnabled]);

  const totalHeight = items.length * itemHeight;
  const offsetY = visibleStart * itemHeight;

  return {
    visibleItems,
    totalHeight,
    offsetY,
    isEnabled,
    setIsEnabled,
    onScroll: (e) => setScrollTop(e.target.scrollTop)
  };
};

// Offline Status Hook
const useOfflineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastSync, setLastSync] = useState(new Date());

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setLastSync(new Date());
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline, lastSync };
};

// Enhanced components (keeping core functionality from previous chapters)
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

// Performance Dashboard Component
const PerformanceDashboard = ({ 
  metrics, 
  urls, 
  isOnline, 
  lastSync, 
  onOptimize,
  t, 
  isDark, 
  isThaiMode, 
  themeConfig 
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const getHealthColor = (value, type) => {
    switch (type) {
      case 'memory':
        return value < 50000000 ? 'text-green-500' : value < 100000000 ? 'text-yellow-500' : 'text-red-500';
      case 'renderTime':
        return value < 16 ? 'text-green-500' : value < 33 ? 'text-yellow-500' : 'text-red-500';
      case 'searchTime':
        return value < 100 ? 'text-green-500' : value < 300 ? 'text-yellow-500' : 'text-red-500';
      default:
        return themeConfig.text;
    }
  };

  const urlStats = useMemo(() => {
    const working = urls.filter(u => u.status === 'working').length;
    const broken = urls.filter(u => u.status === 'broken').length;
    const pending = urls.filter(u => u.status === 'pending').length;
    
    return { working, broken, pending };
  }, [urls]);

  return (
    <div className={`
      ${themeConfig.cardBg} rounded-2xl shadow-xl p-6 mb-6 border glass
      ${themeConfig.cardBorder} ${themeConfig.shadowColor}
    `}>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Activity size={24} className={isDark ? 'text-purple-400' : isThaiMode ? 'text-orange-500' : 'text-blue-500'} />
          <h3 className={`text-xl font-bold ${themeConfig.text}`}>
            {t.performance}
          </h3>
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${isOnline ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
            {isOnline ? <Wifi size={14} className="text-green-500" /> : <WifiOff size={14} className="text-red-500" />}
            <span className={`text-xs font-medium ${isOnline ? 'text-green-500' : 'text-red-500'}`}>
              {isOnline ? t.onlineMode : t.offlineMode}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <TouchButton
            onClick={() => setShowDetails(!showDetails)}
            variant="secondary"
            size="sm"
            isDark={isDark}
            isThaiMode={isThaiMode}
          >
            <BarChart3 size={16} />
            {t.analytics}
            <ChevronDown size={16} className={`transition-transform duration-300 ${showDetails ? 'rotate-180' : ''}`} />
          </TouchButton>
          
          <TouchButton
            onClick={onOptimize}
            variant="primary"
            size="sm"
            isDark={isDark}
            isThaiMode={isThaiMode}
          >
            <Zap size={16} />
            Optimize
          </TouchButton>
        </div>
      </div>

      {/* Core Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-700/30' : 'bg-gray-50/60'} text-center`}>
          <Database size={24} className={`mx-auto mb-2 ${isDark ? 'text-purple-400' : 'text-blue-500'}`} />
          <div className={`text-2xl font-bold ${themeConfig.text}`}>{urls.length}</div>
          <div className={`text-sm ${themeConfig.textSecondary}`}>{t.totalUrls}</div>
        </div>

        <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-700/30' : 'bg-gray-50/60'} text-center`}>
          <HardDrive size={24} className={`mx-auto mb-2 ${isDark ? 'text-purple-400' : 'text-blue-500'}`} />
          <div className={`text-2xl font-bold ${themeConfig.text}`}>
            {dataUtils.formatBytes(metrics.dataSize)}
          </div>
          <div className={`text-sm ${themeConfig.textSecondary}`}>{t.dataSize}</div>
        </div>

        <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-700/30' : 'bg-gray-50/60'} text-center`}>
          <MemoryStick size={24} className={`mx-auto mb-2 ${getHealthColor(metrics.memoryUsage, 'memory')}`} />
          <div className={`text-2xl font-bold ${getHealthColor(metrics.memoryUsage, 'memory')}`}>
            {dataUtils.formatBytes(metrics.memoryUsage)}
          </div>
          <div className={`text-sm ${themeConfig.textSecondary}`}>{t.memoryUsage}</div>
        </div>

        <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-700/30' : 'bg-gray-50/60'} text-center`}>
          <Gauge size={24} className={`mx-auto mb-2 ${getHealthColor(metrics.renderTime, 'renderTime')}`} />
          <div className={`text-2xl font-bold ${getHealthColor(metrics.renderTime, 'renderTime')}`}>
            {metrics.renderTime.toFixed(1)}ms
          </div>
          <div className={`text-sm ${themeConfig.textSecondary}`}>{t.loadTime}</div>
        </div>
      </div>

      {/* URL Health Overview */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className={`p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-center`}>
          <CheckCircle size={20} className="mx-auto mb-2 text-green-500" />
          <div className="text-lg font-bold text-green-500">{urlStats.working}</div>
          <div className={`text-sm ${themeConfig.textSecondary}`}>{t.workingUrls}</div>
        </div>

        <div className={`p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-center`}>
          <XCircle size={20} className="mx-auto mb-2 text-red-500" />
          <div className="text-lg font-bold text-red-500">{urlStats.broken}</div>
          <div className={`text-sm ${themeConfig.textSecondary}`}>{t.brokenUrls}</div>
        </div>

        <div className={`p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-center`}>
          <Clock size={20} className="mx-auto mb-2 text-yellow-500" />
          <div className="text-lg font-bold text-yellow-500">{urlStats.pending}</div>
          <div className={`text-sm ${themeConfig.textSecondary}`}>{t.pendingUrls}</div>
        </div>
      </div>

      {/* Advanced Analytics */}
      {showDetails && (
        <div className="border-t pt-6 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-700/30' : 'bg-gray-50/60'}`}>
              <div className="flex items-center gap-2 mb-2">
                <Archive size={16} className={themeConfig.textSecondary} />
                <span className={`text-sm font-medium ${themeConfig.text}`}>{t.compressionRatio}</span>
              </div>
              <div className={`text-xl font-bold ${themeConfig.text}`}>{metrics.compressionRatio}%</div>
            </div>

            <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-700/30' : 'bg-gray-50/60'}`}>
              <div className="flex items-center gap-2 mb-2">
                <Search size={16} className={themeConfig.textSecondary} />
                <span className={`text-sm font-medium ${themeConfig.text}`}>Search Time</span>
              </div>
              <div className={`text-xl font-bold ${getHealthColor(metrics.searchTime, 'searchTime')}`}>
                {metrics.searchTime.toFixed(1)}ms
              </div>
            </div>

            <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-700/30' : 'bg-gray-50/60'}`}>
              <div className="flex items-center gap-2 mb-2">
                <Clock size={16} className={themeConfig.textSecondary} />
                <span className={`text-sm font-medium ${themeConfig.text}`}>Last Sync</span>
              </div>
              <div className={`text-sm font-bold ${themeConfig.text}`}>
                {lastSync.toLocaleTimeString()}
              </div>
            </div>
          </div>

          {/* Performance Tips */}
          <div className={`p-4 rounded-xl ${isDark ? 'bg-blue-900/20' : 'bg-blue-50/60'} border border-blue-500/20`}>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={16} className="text-blue-500" />
              <span className={`text-sm font-medium ${themeConfig.text}`}>Performance Tips</span>
            </div>
            <ul className={`text-sm ${themeConfig.textSecondary} space-y-1`}>
              <li>• Virtual scrolling is {urls.length > 50 ? 'enabled' : 'disabled'} for your collection size</li>
              <li>• Regular URL health checks keep your vault optimized</li>
              <li>• Compress data regularly to improve performance</li>
              <li>• Remove duplicates to reduce memory usage</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

// Data Management Component
const DataManagementPanel = ({
  urls,
  categories,
  onBackup,
  onRestore,
  onOptimize,
  isProcessing,
  t,
  isDark,
  isThaiMode,
  themeConfig
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [backupData, setBackupData] = useState(null);
  const fileInputRef = useRef(null);

  const handleExportData = () => {
    const backup = dataUtils.createBackup(urls, categories);
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `url-vault-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportData = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        setBackupData(importedData);
      } catch (error) {
        alert('Invalid backup file format');
      }
    };
    reader.readAsText(file);
  };

  const handleRestoreData = () => {
    if (backupData) {
      onRestore(backupData);
      setBackupData(null);
    }
  };

  return (
    <div className={`
      ${themeConfig.cardBg} rounded-2xl shadow-xl p-6 mb-6 border glass
      ${themeConfig.cardBorder} ${themeConfig.shadowColor}
    `}>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Database size={24} className={isDark ? 'text-purple-400' : isThaiMode ? 'text-orange-500' : 'text-blue-500'} />
          <h3 className={`text-xl font-bold ${themeConfig.text}`}>
            {t.dataManagement}
          </h3>
        </div>
        
        <TouchButton
          onClick={() => setShowAdvanced(!showAdvanced)}
          variant="secondary"
          size="sm"
          isDark={isDark}
          isThaiMode={isThaiMode}
        >
          <Settings size={16} />
          Advanced
          <ChevronDown size={16} className={`transition-transform duration-300 ${showAdvanced ? 'rotate-180' : ''}`} />
        </TouchButton>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <TouchButton
          onClick={handleExportData}
          variant="success"
          size="sm"
          className="flex-col p-4 h-auto"
          isDark={isDark}
          isThaiMode={isThaiMode}
        >
          <CloudDownload size={24} className="mb-2" />
          <span className="text-xs">{t.exportData}</span>
        </TouchButton>

        <TouchButton
          onClick={() => fileInputRef.current?.click()}
          variant="primary"
          size="sm"
          className="flex-col p-4 h-auto"
          isDark={isDark}
          isThaiMode={isThaiMode}
        >
          <CloudUpload size={24} className="mb-2" />
          <span className="text-xs">{t.importData}</span>
        </TouchButton>

        <TouchButton
          onClick={onBackup}
          variant="warning"
          size="sm"
          className="flex-col p-4 h-auto"
          loading={isProcessing}
          isDark={isDark}
          isThaiMode={isThaiMode}
        >
          <Save size={24} className="mb-2" />
          <span className="text-xs">{t.backupData}</span>
        </TouchButton>

        <TouchButton
          onClick={onOptimize}
          variant="purple"
          size="sm"
          className="flex-col p-4 h-auto"
          loading={isProcessing}
          isDark={isDark}
          isThaiMode={isThaiMode}
        >
          <Zap size={24} className="mb-2" />
          <span className="text-xs">Optimize</span>
        </TouchButton>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleImportData}
        className="hidden"
      />

      {/* Restore Preview */}
      {backupData && (
        <div className={`p-4 rounded-xl ${isDark ? 'bg-green-900/20' : 'bg-green-50/60'} border border-green-500/20 mb-6`}>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-500" />
              <span className={`font-medium ${themeConfig.text}`}>Backup Ready to Restore</span>
            </div>
            <TouchButton
              onClick={() => setBackupData(null)}
              variant="secondary"
              size="sm"
              className="p-1"
              isDark={isDark}
            >
              <X size={16} />
            </TouchButton>
          </div>
          
          <div className={`text-sm ${themeConfig.textSecondary} mb-4`}>
            <p>• URLs: {backupData.metadata?.totalUrls || 'Unknown'}</p>
            <p>• Categories: {backupData.metadata?.totalCategories || 'Unknown'}</p>
            <p>• Created: {backupData.timestamp ? new Date(backupData.timestamp).toLocaleString() : 'Unknown'}</p>
          </div>
          
          <TouchButton
            onClick={handleRestoreData}
            variant="success"
            size="sm"
            isDark={isDark}
            isThaiMode={isThaiMode}
          >
            <Archive size={16} />
            {t.restoreData}
          </TouchButton>
        </div>
      )}

      {/* Advanced Options */}
      {showAdvanced && (
        <div className="border-t pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Data Integrity */}
            <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-700/30' : 'bg-gray-50/60'}`}>
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle size={16} className="text-green-500" />
                <span className={`font-medium ${themeConfig.text}`}>{t.dataIntegrity}</span>
              </div>
              <div className={`text-sm ${themeConfig.textSecondary} mb-3`}>
                Fingerprint: {dataUtils.createFingerprint({ urls, categories }).slice(0, 8)}...
              </div>
              <TouchButton
                onClick={() => {
                  const fingerprint = dataUtils.createFingerprint({ urls, categories });
                  alert(`Data fingerprint: ${fingerprint}`);
                }}
                variant="secondary"
                size="sm"
                isDark={isDark}
                isThaiMode={isThaiMode}
              >
                Verify
              </TouchButton>
            </div>

            {/* Compression Info */}
            <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-700/30' : 'bg-gray-50/60'}`}>
              <div className="flex items-center gap-2 mb-3">
                <Archive size={16} className={isDark ? 'text-purple-400' : 'text-blue-500'} />
                <span className={`font-medium ${themeConfig.text}`}>Compression</span>
              </div>
              <div className={`text-sm ${themeConfig.textSecondary} mb-3`}>
                Original: {dataUtils.formatBytes(dataUtils.getDataSize({ urls, categories }))}
              </div>
              <TouchButton
                onClick={() => {
                  const compressed = dataUtils.compress({ urls, categories });
                  alert(`Compressed size: ${dataUtils.formatBytes(compressed.compressedSize)} (${compressed.ratio}% of original)`);
                }}
                variant="secondary"
                size="sm"
                isDark={isDark}
                isThaiMode={isThaiMode}
              >
                Test Compression
              </TouchButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Virtual Scrolling Container Component
const VirtualScrollContainer = ({ 
  items, 
  renderItem, 
  itemHeight = 100, 
  height = 600,
  isEnabled,
  onToggle,
  t,
  isDark,
  themeConfig 
}) => {
  const { 
    visibleItems, 
    totalHeight, 
    offsetY, 
    onScroll 
  } = useVirtualScrolling(items, itemHeight, height);

  return (
    <div className="space-y-4">
      {/* Virtual Scrolling Controls */}
      <div className="flex justify-between items-center">
        <div className={`text-sm ${themeConfig.textSecondary}`}>
          Showing {visibleItems.length} of {items.length} items
          {isEnabled && ` (Virtual scrolling active)`}
        </div>
        <TouchButton
          onClick={onToggle}
          variant="secondary"
          size="sm"
          isDark={isDark}
        >
          <Eye size={16} />
          {t.virtualScrolling}: {isEnabled ? t.enabled : t.disabled}
        </TouchButton>
      </div>

      {/* Scroll Container */}
      <div 
        className="overflow-auto"
        style={{ height: `${height}px` }}
        onScroll={onScroll}
      >
        <div style={{ height: `${totalHeight}px`, position: 'relative' }}>
          <div style={{ transform: `translateY(${offsetY}px)` }}>
            {visibleItems.map((item, index) => (
              <div key={item.id || index} style={{ height: `${itemHeight}px` }}>
                {renderItem(item, index)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component with Chapter 5 Enhancements
function App() {
  // Theme and visual state (from previous chapters)
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

  // Advanced features state (from Chapter 4)
  const [filters, setFilters] = useState({
    sortBy: 'dateAdded',
    status: 'all',
    searchInUrl: true,
    searchInTitle: true,
    searchInDescription: false
  });
  const [isCheckingUrls, setIsCheckingUrls] = useState(false);

  // Chapter 5: Performance and Data Management State
  const [showPerformanceDashboard, setShowPerformanceDashboard] = useState(false);
  const [showDataManagement, setShowDataManagement] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [virtualScrollEnabled, setVirtualScrollEnabled] = useState(true);
  const [performanceMode, setPerformanceMode] = useState(false);

  // Chapter 5: Advanced Hooks
  const performanceMonitor = usePerformanceMonitor();
  const { isOnline, lastSync } = useOfflineStatus();

  // Computed values
  const isDark = theme === 'dark' || theme === 'thaiDark';
  const isThaiMode = language === 'th';
  const currentTheme = isThaiMode ? (isDark ? 'thaiDark' : 'thai') : (isDark ? 'dark' : 'light');
  const themeConfig = themes[currentTheme];
  const t = translations[language];

  // Performance optimization: Memoize filtered URLs
  const filteredUrls = useMemo(() => {
    const startTime = performance.now();
    
    let filtered = urls;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(url => {
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
      filtered = filtered.filter(url => url.status === filters.status);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'alphabetical':
          return (a.title || a.url).localeCompare(b.title || b.url);
        case 'domain':
          return getDomain(a.url).localeCompare(getDomain(b.url));
        case 'status':
          return (a.status || 'pending').localeCompare(b.status || 'pending');
        case 'dateAdded':
        default:
          return new Date(b.dateAdded || b.id) - new Date(a.dateAdded || a.id);
      }
    });

    performanceMonitor.measureSearchTime(startTime);
    return filtered;
  }, [urls, searchTerm, filters, performanceMonitor]);

  // Helper function
  const getDomain = (url) => {
    try {
      return new URL(url).hostname;
    } catch (_) {
      return 'Invalid URL';
    }
  };

  // Update performance metrics when data changes
  useEffect(() => {
    performanceMonitor.updateDataMetrics(urls);
    performanceMonitor.updateMemoryUsage();
  }, [urls, performanceMonitor]);

  // Theme and language handlers
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

  // Chapter 5: Advanced Data Management Functions
  const handleOptimizeData = async () => {
    setIsProcessing(true);
    
    // Simulate optimization process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Remove duplicates
    const seen = new Set();
    const optimizedUrls = urls.filter(url => {
      const normalizedUrl = url.url.toLowerCase().replace(/\/$/, '');
      if (seen.has(normalizedUrl)) {
        return false;
      }
      seen.add(normalizedUrl);
      return true;
    });
    
    setUrls(optimizedUrls);
    setIsProcessing(false);
    
    // Update performance metrics
    performanceMonitor.updateDataMetrics(optimizedUrls);
  };

  const handleBackupData = async () => {
    setIsProcessing(true);
    
    // Simulate backup process
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const backup = dataUtils.createBackup(urls, categories, {
      userEmail: user?.email,
      appVersion: '5.0',
      performanceMetrics: performanceMonitor.metrics
    });
    
    // Save to localStorage as backup
    localStorage.setItem('urlManagerBackup', JSON.stringify(backup));
    
    setIsProcessing(false);
    alert('Backup completed successfully!');
  };

  const handleRestoreData = async (backupData) => {
    setIsProcessing(true);
    
    // Simulate restore process
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const result = dataUtils.restoreBackup(backupData);
    
    if (result.success) {
      setUrls(result.urls);
      setCategories(result.categories);
      alert('Data restored successfully!');
    } else {
      alert(`Restore failed: ${result.error}`);
    }
    
    setIsProcessing(false);
  };

  // Basic URL management (optimized)
  const addUrl = useCallback((url, category = categories[0]) => {
    const normalized = url.trim();
    if (normalized && !urls.find(u => u.url === normalized)) {
      const newUrl = {
        id: Date.now(),
        url: normalized,
        category: category,
        dateAdded: new Date().toISOString(),
        status: 'pending'
      };
      setUrls(prev => [...prev, newUrl]);
      
      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
      }
    }
  }, [urls, categories]);

  const handleUrlSubmit = () => {
    const normalized = inputUrl.trim();
    if (normalized && normalized !== 'https://') {
      addUrl(normalized);
      setInputUrl('https://');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleUrlSubmit();
    }
  };

  const toggleSelectUrl = (urlId) => {
    setSelectedUrls(prev =>
      prev.includes(urlId)
        ? prev.filter(id => id !== urlId)
        : [...prev, urlId]
    );
  };

  // Get URLs by category with memoization
  const urlsByCategory = useMemo(() => {
    const grouped = {};
    categories.forEach(cat => {
      grouped[cat] = filteredUrls.filter(url => url.category === cat);
    });
    return grouped;
  }, [categories, filteredUrls]);

  // Load user data
  useEffect(() => {
    const savedUser = localStorage.getItem('urlManagerUser');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
    } else {
      setShowAuthModal(true);
    }
    
    // Load sample data for demonstration
    const sampleUrls = Array.from({ length: 100 }, (_, i) => ({
      id: Date.now() + i,
      url: `https://example${i}.com`,
      category: categories[i % categories.length],
      dateAdded: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: ['working', 'broken', 'pending'][Math.floor(Math.random() * 3)]
    }));
    setUrls(sampleUrls);
  }, [categories]);

  // Performance mode toggle
  const togglePerformanceMode = () => {
    setPerformanceMode(!performanceMode);
    setVirtualScrollEnabled(!performanceMode);
  };

  return (
    <>
      {/* Enhanced styling */}
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
          {/* Enhanced Header with Performance Indicators */}
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
                  <div className="flex items-center gap-4">
                    <p className={`
                      text-sm sm:text-base opacity-80 font-medium
                      ${themeConfig.textSecondary}
                    `}>
                      {t.appSubtitle}
                    </p>
                    
                    {/* Performance Indicator */}
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${performanceMode ? 'bg-green-500/20' : 'bg-blue-500/20'}`}>
                      <Zap size={14} className={performanceMode ? 'text-green-500' : 'text-blue-500'} />
                      <span className={`text-xs font-medium ${performanceMode ? 'text-green-500' : 'text-blue-500'}`}>
                        {performanceMode ? t.performanceMode : t.standardMode}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <TouchButton onClick={toggleTheme} variant="secondary" size="sm" isDark={isDark}>
                    {isDark ? <Sun size={16} /> : <Moon size={16} />}
                  </TouchButton>
                  <TouchButton onClick={toggleLanguage} variant="secondary" size="sm" isDark={isDark}>
                    <Globe size={16} />
                    {language === 'th' ? 'ไทย' : 'EN'}
                  </TouchButton>
                  
                  <TouchButton 
                    onClick={() => setShowPerformanceDashboard(!showPerformanceDashboard)} 
                    variant="secondary" 
                    size="sm" 
                    isDark={isDark}
                  >
                    <Activity size={16} />
                  </TouchButton>
                  
                  <TouchButton 
                    onClick={() => setShowDataManagement(!showDataManagement)} 
                    variant="secondary" 
                    size="sm" 
                    isDark={isDark}
                  >
                    <Database size={16} />
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
            {/* Performance Dashboard */}
            {showPerformanceDashboard && (
              <PerformanceDashboard
                metrics={performanceMonitor.metrics}
                urls={urls}
                isOnline={isOnline}
                lastSync={lastSync}
                onOptimize={handleOptimizeData}
                t={t}
                isDark={isDark}
                isThaiMode={isThaiMode}
                themeConfig={themeConfig}
              />
            )}

            {/* Data Management Panel */}
            {showDataManagement && (
              <DataManagementPanel
                urls={urls}
                categories={categories}
                onBackup={handleBackupData}
                onRestore={handleRestoreData}
                onOptimize={handleOptimizeData}
                isProcessing={isProcessing}
                t={t}
                isDark={isDark}
                isThaiMode={isThaiMode}
                themeConfig={themeConfig}
              />
            )}

            {/* Enhanced Input Section */}
            {user && (
              <div className={`
                ${themeConfig.cardBg} rounded-2xl shadow-xl p-6 mb-6 border glass
                ${themeConfig.cardBorder} ${themeConfig.shadowColor}
              `}>
                <div className="flex gap-3 mb-4">
                  <input
                    type="text"
                    value={inputUrl}
                    onChange={e => setInputUrl(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={t.enterUrl}
                    className={`
                      flex-1 px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent 
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
                    disabled={!user || inputUrl === 'https://'}
                    variant="primary"
                    size="md"
                    isDark={isDark}
                    isThaiMode={isThaiMode}
                  >
                    <Plus size={18} />
                    {t.addUrl}
                  </TouchButton>
                </div>

                {/* Performance Toggle */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Search 
                      className={`${isDark ? 'text-purple-400' : isThaiMode ? 'text-orange-400' : 'text-blue-400'}`} 
                      size={20} 
                    />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      placeholder={t.searchPlaceholder}
                      className={`
                        px-4 py-2 border-2 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent 
                        transition-all duration-300 font-medium glass backdrop-blur-xl
                        ${isDark 
                          ? 'border-purple-500/30 focus:ring-purple-500/30 bg-gray-800/40 text-purple-100 placeholder-purple-300/60' 
                          : isThaiMode 
                          ? 'border-orange-200/50 focus:ring-orange-500/30 bg-white/60 text-orange-900 placeholder-orange-500/60'
                          : 'border-blue-200/50 focus:ring-blue-500/30 bg-white/60 text-blue-900 placeholder-blue-500/60'
                        }
                      `}
                    />
                  </div>
                  
                  <TouchButton
                    onClick={togglePerformanceMode}
                    variant={performanceMode ? "success" : "secondary"}
                    size="sm"
                    isDark={isDark}
                    isThaiMode={isThaiMode}
                  >
                    <Zap size={16} />
                    {performanceMode ? 'Performance' : 'Standard'}
                  </TouchButton>
                </div>
              </div>
            )}

            {/* Enhanced Categories with Virtual Scrolling */}
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
                    
                    {/* Enhanced expand/collapse with Virtual Scrolling */}
                    <div className={`
                      transition-all duration-500 ease-out overflow-hidden
                      ${isExpanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}
                    `}>
                      <div className={`border-t ${isDark ? 'border-gray-700/50' : 'border-gray-200/50'}`}>
                        {categoryUrls.length > 0 ? (
                          performanceMode && categoryUrls.length > 20 ? (
                            <VirtualScrollContainer
                              items={categoryUrls}
                              renderItem={(url) => (
                                <div className={`
                                  p-4 border-b last:border-b-0 flex items-center gap-4
                                  ${isDark ? 'border-gray-700/30' : 'border-gray-200/30'}
                                  hover:bg-gray-50/50 transition-colors duration-200
                                `}>
                                  <input
                                    type="checkbox"
                                    checked={selectedUrls.includes(url.id)}
                                    onChange={() => toggleSelectUrl(url.id)}
                                    className="w-5 h-5 rounded"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <a
                                      href={url.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className={`
                                        block break-all transition-colors duration-200 font-medium hover:underline
                                        ${isDark ? 'text-gray-200 hover:text-purple-300' : isThaiMode ? 'text-orange-800 hover:text-orange-600' : 'text-gray-800 hover:text-blue-600'}
                                      `}
                                    >
                                      {url.url}
                                    </a>
                                    {url.status && (
                                      <div className="flex items-center gap-2 mt-1">
                                        <div className={`w-2 h-2 rounded-full ${
                                          url.status === 'working' ? 'bg-green-500' :
                                          url.status === 'broken' ? 'bg-red-500' : 'bg-yellow-500'
                                        }`}></div>
                                        <span className={`text-xs ${themeConfig.textSecondary}`}>
                                          {url.status}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                              itemHeight={100}
                              height={400}
                              isEnabled={virtualScrollEnabled}
                              onToggle={() => setVirtualScrollEnabled(!virtualScrollEnabled)}
                              t={t}
                              isDark={isDark}
                              themeConfig={themeConfig}
                            />
                          ) : (
                            categoryUrls.map(url => (
                              <div key={url.id} className={`
                                p-4 border-b last:border-b-0 flex items-center gap-4
                                ${isDark ? 'border-gray-700/30' : 'border-gray-200/30'}
                                hover:bg-gray-50/50 transition-colors duration-200
                              `}>
                                <input
                                  type="checkbox"
                                  checked={selectedUrls.includes(url.id)}
                                  onChange={() => toggleSelectUrl(url.id)}
                                  className="w-5 h-5 rounded"
                                />
                                <div className="flex-1 min-w-0">
                                  <a
                                    href={url.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`
                                      block break-all transition-colors duration-200 font-medium hover:underline
                                      ${isDark ? 'text-gray-200 hover:text-purple-300' : isThaiMode ? 'text-orange-800 hover:text-orange-600' : 'text-gray-800 hover:text-blue-600'}
                                    `}
                                  >
                                    {url.url}
                                  </a>
                                  {url.status && (
                                    <div className="flex items-center gap-2 mt-1">
                                      <div className={`w-2 h-2 rounded-full ${
                                        url.status === 'working' ? 'bg-green-500' :
                                        url.status === 'broken' ? 'bg-red-500' : 'bg-yellow-500'
                                      }`}></div>
                                      <span className={`text-xs ${themeConfig.textSecondary}`}>
                                        {url.status}
                                      </span>
                                    </div>
                                  )}
                                </div>
                                <TouchButton
                                  onClick={() => setShowQRModal(url.url)}
                                  variant="secondary"
                                  size="sm"
                                  className="p-2"
                                  isDark={isDark}
                                >
                                  <QrCode size={16} />
                                </TouchButton>
                              </div>
                            ))
                          )
                        ) : (
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
                      : 'border-gray-300 bg-white text-black' // default/fallback style
  }
`}