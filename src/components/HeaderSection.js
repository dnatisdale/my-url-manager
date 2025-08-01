import React from 'react';
import { LogIn, LogOut, Download, Sparkles, Globe, Moon, Sun, Wifi, WifiOff, Database } from 'lucide-react';
import { TouchButton } from './UI';

export const HeaderSection = ({
  // Theme and language
  t,
  themeConfig,
  isDarkMode,
  isThaiMode,
  toggleTheme,
  toggleLanguage,
  
  // User state
  user,
  handleSignOut,
  
  // PWA install
  showInstallButton,
  handleInstallPWA,
  
  // Online/sync status
  isOnline,
  isSyncing
}) => {
  return (
    <header className={`sticky top-0 z-30 ${themeConfig.headerBg} border-b ${themeConfig.cardBorder} backdrop-blur-xl`}>
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl bg-gradient-to-r ${themeConfig.accent} flex items-center justify-center`}>
              <Sparkles className="text-white" size={20} />
            </div>
            <div>
              <h1 className={`text-xl font-bold ${themeConfig.text}`}>
                {t.appTitle}
              </h1>
              <p className={`text-sm ${themeConfig.textSecondary}`}>
                {t.appSubtitle}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            {/* PWA Install Button */}
            {showInstallButton && (
              <TouchButton
                onClick={handleInstallPWA}
                variant="success"
                size="sm"
                isDark={isDarkMode}
                className="flex items-center gap-2"
              >
                <Download size={16} />
                {t.installApp}
              </TouchButton>
            )}

            {/* Online/Offline Status */}
            <div 
              className={`px-3 py-1 rounded-lg ${isOnline ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
              title={isOnline ? `${t.online} - Connected to internet` : `${t.offline} - Working without internet`}
            >
              {isOnline ? <Wifi size={16} /> : <WifiOff size={16} />}
            </div>

            {/* Sync Status */}
            {user && (
              <div 
                className={`px-3 py-1 rounded-lg ${isSyncing ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
                title={isSyncing ? "Syncing to cloud..." : "Cloud sync ready"}
              >
                {isSyncing ? <Database className="animate-pulse" size={16} /> : <Database size={16} />}
              </div>
            )}

            {/* Theme Toggle */}
            <TouchButton
              onClick={toggleTheme}
              variant="secondary"
              size="sm"
              className="p-2"
              isDark={isDarkMode}
              title={t.toggleTheme}
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </TouchButton>

            {/* Language Toggle */}
            <TouchButton
              onClick={toggleLanguage}
              variant="secondary"
              size="sm"
              className="p-2"
              isDark={isDarkMode}
              title={t.toggleLanguage}
            >
              <Globe size={18} />
            </TouchButton>

            {/* User Actions */}
            {user ? (
              <TouchButton
                onClick={handleSignOut}
                variant="secondary"
                size="sm"
                isDark={isDarkMode}
              >
                <LogOut size={16} />
                {t.signOut}
              </TouchButton>
            ) : (
              <TouchButton
                onClick={() => {}}
                variant="primary"
                size="sm"
                isDark={isDarkMode}
                isThaiMode={isThaiMode}
              >
                <LogIn size={16} />
                {t.signIn}
              </TouchButton>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};