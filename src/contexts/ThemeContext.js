import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [accentColor, setAccentColor] = useState('blue');

  // Load theme from localStorage
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('url-manager-theme') || 'light';
      const savedAccent = localStorage.getItem('url-manager-accent') || 'blue';
      setTheme(savedTheme);
      setAccentColor(savedAccent);
      applyTheme(savedTheme);
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  }, []);

  // Apply theme to document
  const applyTheme = (newTheme) => {
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Toggle between light and dark
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    applyTheme(newTheme);
    localStorage.setItem('url-manager-theme', newTheme);
  };

  // Change accent color
  const changeAccentColor = (color) => {
    setAccentColor(color);
    localStorage.setItem('url-manager-accent', color);
  };

  // Get theme-aware colors
  const getColors = () => {
    const isDark = theme === 'dark';
    
    const accentColors = {
      blue: { primary: '#3b82f6', secondary: '#1d4ed8', light: '#dbeafe' },
      purple: { primary: '#8b5cf6', secondary: '#7c3aed', light: '#e9d5ff' },
      green: { primary: '#10b981', secondary: '#059669', light: '#d1fae5' },
      pink: { primary: '#ec4899', secondary: '#db2777', light: '#fce7f3' },
      orange: { primary: '#f59e0b', secondary: '#d97706', light: '#fed7aa' },
      red: { primary: '#ef4444', secondary: '#dc2626', light: '#fee2e2' }
    };

    const currentAccent = accentColors[accentColor] || accentColors.blue;

    return {
      // Backgrounds
      background: isDark ? '#0f172a' : '#f8fafc',
      cardBackground: isDark ? '#1e293b' : '#ffffff',
      headerBackground: isDark ? '#1e293b' : '#ffffff',
      sectionBackground: isDark ? '#334155' : '#f1f5f9',
      
      // Text colors
      textPrimary: isDark ? '#f1f5f9' : '#0f172a',
      textSecondary: isDark ? '#cbd5e1' : '#64748b',
      textMuted: isDark ? '#94a3b8' : '#94a3b8',
      
      // Borders
      border: isDark ? '#334155' : '#e2e8f0',
      borderLight: isDark ? '#475569' : '#f1f5f9',
      
      // Accent colors
      primary: currentAccent.primary,
      primaryHover: currentAccent.secondary,
      primaryLight: isDark ? `${currentAccent.primary}20` : currentAccent.light,
      
      // Status colors
      success: isDark ? '#22c55e' : '#16a34a',
      warning: isDark ? '#fbbf24' : '#d97706',
      error: isDark ? '#f87171' : '#dc2626',
      info: isDark ? '#60a5fa' : '#2563eb',
      
      // Special colors
      gradient: isDark 
        ? `linear-gradient(135deg, ${currentAccent.primary} 0%, ${currentAccent.secondary} 100%)`
        : `linear-gradient(135deg, ${currentAccent.primary} 0%, ${currentAccent.secondary} 100%)`,
      
      shadow: isDark 
        ? '0 1px 3px rgba(0, 0, 0, 0.3)' 
        : '0 1px 3px rgba(0, 0, 0, 0.1)',
      
      shadowLarge: isDark 
        ? '0 10px 25px rgba(0, 0, 0, 0.3)' 
        : '0 10px 25px rgba(0, 0, 0, 0.1)'
    };
  };

  const value = {
    theme,
    accentColor,
    toggleTheme,
    changeAccentColor,
    getColors,
    isDark: theme === 'dark'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};