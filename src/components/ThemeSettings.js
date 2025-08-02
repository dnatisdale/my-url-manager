import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

export const ThemeSettings = () => {
  const { theme, accentColor, toggleTheme, changeAccentColor, getColors } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const colors = getColors();

  const accentOptions = [
    { name: 'blue', color: '#3b82f6', label: 'Ocean Blue' },
    { name: 'purple', color: '#8b5cf6', label: 'Royal Purple' },
    { name: 'green', color: '#10b981', label: 'Forest Green' },
    { name: 'pink', color: '#ec4899', label: 'Rose Pink' },
    { name: 'orange', color: '#f59e0b', label: 'Sunset Orange' },
    { name: 'red', color: '#ef4444', label: 'Ruby Red' }
  ];

  return (
    <div style={{ 
      background: colors.cardBackground, 
      border: `1px solid ${colors.border}`, 
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '24px',
      boxShadow: colors.shadow,
      transition: 'all 0.3s ease'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: isExpanded ? '20px' : '0'
      }}>
        <div>
          <h3 style={{ 
            margin: '0 0 4px 0', 
            color: colors.textPrimary,
            fontSize: '18px',
            fontWeight: '600'
          }}>
            🎨 Theme & Appearance
          </h3>
          <p style={{ 
            margin: '0', 
            fontSize: '14px', 
            color: colors.textSecondary 
          }}>
            Customize your visual experience
          </p>
        </div>
        
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            background: colors.primaryLight,
            border: 'none',
            borderRadius: '8px',
            padding: '8px 16px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            color: colors.primary,
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => e.target.style.background = colors.primary + '30'}
          onMouseLeave={(e) => e.target.style.background = colors.primaryLight}
        >
          {isExpanded ? '🔼 Collapse' : '🔽 Customize'}
        </button>
      </div>

      {isExpanded && (
        <div style={{ 
          display: 'grid', 
          gap: '24px',
          animation: 'fadeIn 0.3s ease'
        }}>
          {/* Theme Toggle */}
          <div>
            <h4 style={{ 
              margin: '0 0 12px 0', 
              fontSize: '16px', 
              color: colors.textPrimary,
              fontWeight: '600'
            }}>
              🌓 Theme Mode
            </h4>
            <div style={{ display: 'flex', gap: '12px' }}>
              <ThemeOption
                active={theme === 'light'}
                onClick={() => theme === 'dark' && toggleTheme()}
                colors={colors}
                icon="☀️"
                title="Light Mode"
                description="Clean and bright interface"
              />
              <ThemeOption
                active={theme === 'dark'}
                onClick={() => theme === 'light' && toggleTheme()}
                colors={colors}
                icon="🌙"
                title="Dark Mode"
                description="Easy on the eyes"
              />
            </div>
          </div>

          {/* Accent Color */}
          <div>
            <h4 style={{ 
              margin: '0 0 12px 0', 
              fontSize: '16px', 
              color: colors.textPrimary,
              fontWeight: '600'
            }}>
              🎨 Accent Color
            </h4>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
              gap: '8px' 
            }}>
              {accentOptions.map(option => (
                <ColorOption
                  key={option.name}
                  active={accentColor === option.name}
                  onClick={() => changeAccentColor(option.name)}
                  color={option.color}
                  label={option.label}
                  colors={colors}
                />
              ))}
            </div>
          </div>

          {/* Preview */}
          <div>
            <h4 style={{ 
              margin: '0 0 12px 0', 
              fontSize: '16px', 
              color: colors.textPrimary,
              fontWeight: '600'
            }}>
              👀 Preview
            </h4>
            <div style={{
              background: colors.sectionBackground,
              border: `1px solid ${colors.border}`,
              borderRadius: '8px',
              padding: '16px'
            }}>
              <div style={{
                background: colors.gradient,
                color: 'white',
                padding: '12px',
                borderRadius: '6px',
                marginBottom: '12px',
                textAlign: 'center',
                fontWeight: '600'
              }}>
                URL Manager Ultimate
              </div>
              <div style={{
                background: colors.cardBackground,
                border: `1px solid ${colors.border}`,
                borderRadius: '6px',
                padding: '12px'
              }}>
                <div style={{ 
                  color: colors.textPrimary,
                  fontWeight: '600',
                  marginBottom: '4px'
                }}>
                  Sample URL Card
                </div>
                <div style={{ 
                  color: colors.textSecondary,
                  fontSize: '14px'
                }}>
                  This is how your URLs will look with the current theme
                </div>
                <div style={{ 
                  marginTop: '8px',
                  display: 'flex',
                  gap: '8px'
                }}>
                  <button style={{
                    background: colors.primary,
                    color: 'white',
                    border: 'none',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}>
                    Action
                  </button>
                  <button style={{
                    background: colors.success,
                    color: 'white',
                    border: 'none',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}>
                    Copy
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add CSS for animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

// Theme Option Component
const ThemeOption = ({ active, onClick, colors, icon, title, description }) => (
  <div
    onClick={onClick}
    style={{
      flex: 1,
      padding: '16px',
      border: `2px solid ${active ? colors.primary : colors.border}`,
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      background: active ? colors.primaryLight : colors.cardBackground,
      textAlign: 'center'
    }}
    onMouseEnter={(e) => !active && (e.target.style.borderColor = colors.primary + '50')}
    onMouseLeave={(e) => !active && (e.target.style.borderColor = colors.border)}
  >
    <div style={{ fontSize: '24px', marginBottom: '8px' }}>{icon}</div>
    <div style={{ 
      fontSize: '14px', 
      fontWeight: '600', 
      color: colors.textPrimary,
      marginBottom: '4px'
    }}>
      {title}
    </div>
    <div style={{ 
      fontSize: '12px', 
      color: colors.textSecondary 
    }}>
      {description}
    </div>
  </div>
);

// Color Option Component
const ColorOption = ({ active, onClick, color, label, colors }) => (
  <div
    onClick={onClick}
    style={{
      padding: '12px',
      border: `2px solid ${active ? color : colors.border}`,
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      background: active ? color + '10' : colors.cardBackground,
      textAlign: 'center'
    }}
    onMouseEnter={(e) => !active && (e.target.style.borderColor = color + '50')}
    onMouseLeave={(e) => !active && (e.target.style.borderColor = colors.border)}
  >
    <div style={{
      width: '20px',
      height: '20px',
      backgroundColor: color,
      borderRadius: '50%',
      margin: '0 auto 8px auto',
      border: '2px solid white',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }} />
    <div style={{ 
      fontSize: '12px', 
      fontWeight: '500', 
      color: colors.textPrimary 
    }}>
      {label}
    </div>
  </div>
);