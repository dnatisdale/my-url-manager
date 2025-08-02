import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

export const Footer = ({ phase, feature }) => {
  const { getColors } = useTheme();
  const colors = getColors();

  return (
    <div style={{ 
      textAlign: 'center', 
      marginTop: '40px',
      padding: '20px',
      borderTop: `1px solid ${colors.border}`,
      color: colors.textSecondary,
      fontSize: '14px'
    }}>
      <p style={{ margin: '0 0 8px 0' }}>
        ✅ Phase {phase} Complete: {feature} • 💾 Data saved locally • 🎨 Enhanced UI
      </p>
      <p style={{ margin: '0', fontSize: '12px', opacity: '0.8' }}>
        🔄 Last updated: {new Date().toLocaleTimeString()} • Made with ❤️ for productivity
      </p>
    </div>
  );
};