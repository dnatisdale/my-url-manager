import React from 'react';

export const Footer = ({ phase, feature }) => {
  return (
    <div style={{ 
      textAlign: 'center', 
      marginTop: '32px',
      color: '#6b7280',
      fontSize: '14px'
    }}>
      <p style={{ margin: '0 0 8px 0' }}>
        ✅ Phase {phase} Complete: {feature} • 💾 Data saved locally
      </p>
      <p style={{ margin: '0', fontSize: '12px', opacity: '0.8' }}>
        🔄 Last updated: {new Date().toLocaleTimeString()}
      </p>
    </div>
  );
};