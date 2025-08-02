import React from 'react';

export const Header = ({ categoriesCount, urlsCount, healthStats }) => {
  const getHealthEmoji = () => {
    if (!healthStats || healthStats.total === 0) return '📊';
    if (healthStats.healthyPercentage >= 80) return '💚';
    if (healthStats.healthyPercentage >= 60) return '💛';
    return '❤️‍🩹';
  };

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white', 
      padding: '24px', 
      borderRadius: '12px',
      marginBottom: '24px',
      textAlign: 'center'
    }}>
      <h1 style={{ margin: '0 0 8px 0', fontSize: '28px' }}>
        URL Manager Ultimate
      </h1>
      <p style={{ margin: '0', opacity: '0.9' }}>
        🗂️ {categoriesCount} Categories • 🔗 {urlsCount} URLs • {getHealthEmoji()} {healthStats?.healthyPercentage || 0}% Healthy • 🚀 All Features
      </p>
    </div>
  );
};