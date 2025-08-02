import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

export const Header = ({ categoriesCount, urlsCount, healthStats }) => {
  const { getColors, toggleTheme, theme } = useTheme();
  const colors = getColors();

  const getHealthEmoji = () => {
    if (!healthStats || healthStats.total === 0) return '📊';
    if (healthStats.healthyPercentage >= 80) return '💚';
    if (healthStats.healthyPercentage >= 60) return '💛';
    return '❤️‍🩹';
  };

  return (
    <div style={{ 
      background: colors.gradient,
      color: 'white', 
      padding: '28px', 
      borderRadius: '16px',
      marginBottom: '24px',
      textAlign: 'center',
      position: 'relative',
      boxShadow: colors.shadowLarge,
      transition: 'all 0.3s ease'
    }}>
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          background: 'rgba(255, 255, 255, 0.2)',
          border: 'none',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
          transition: 'all 0.2s ease',
          backdropFilter: 'blur(10px)'
        }}
        onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
        onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
        title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </button>

      <h1 style={{ 
        margin: '0 0 12px 0', 
        fontSize: '32px',
        fontWeight: '700',
        textShadow: '0 2px 4px rgba(0,0,0,0.3)',
        background: 'linear-gradient(45deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.8) 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }}>
        URL Manager Ultimate
      </h1>
      
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '20px',
        flexWrap: 'wrap',
        opacity: '0.95',
        fontSize: '14px',
        fontWeight: '500'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '16px' }}>🗂️</span>
          <span>{categoriesCount} Categories</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '16px' }}>🔗</span>
          <span>{urlsCount} URLs</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '16px' }}>{getHealthEmoji()}</span>
          <span>{healthStats?.healthyPercentage || 0}% Healthy</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '16px' }}>✨</span>
          <span>Enhanced UI</span>
        </div>
      </div>
    </div>
  );
};