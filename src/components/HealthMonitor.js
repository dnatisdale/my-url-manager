import React, { useState, useEffect } from 'react';
import { urlHealthService } from '../services/URLHealthService';

export const HealthMonitor = ({ urls, onHealthUpdate }) => {
  const [healthData, setHealthData] = useState(new Map());
  const [isChecking, setIsChecking] = useState(false);
  const [lastCheck, setLastCheck] = useState(null);
  const [autoCheck, setAutoCheck] = useState(true);

  // Subscribe to health updates
  useEffect(() => {
    // Initialize health data for all URLs
    const initialData = new Map();
    urls.forEach(url => {
      const health = urlHealthService.getHealthData(url.url);
      initialData.set(url.url, health);
    });
    setHealthData(initialData);

    // Subscribe to health service updates
    const unsubscribe = urlHealthService.subscribe((url, health) => {
      setHealthData(prev => {
        const newData = new Map(prev);
        newData.set(url, health);
        return newData;
      });
      
      // Notify parent component
      if (onHealthUpdate) {
        onHealthUpdate(url, health);
      }
    });

    return unsubscribe;
  }, [urls, onHealthUpdate]);

  // Auto-start monitoring when component mounts
  useEffect(() => {
    if (autoCheck && urls.length > 0) {
      urlHealthService.startPeriodicChecks(30); // Check every 30 minutes
    }

    return () => {
      if (!autoCheck) {
        urlHealthService.stopPeriodicChecks();
      }
    };
  }, [autoCheck, urls.length]);

  // Check all URLs manually
  const checkAllURLs = async () => {
    if (urls.length === 0) return;
    
    setIsChecking(true);
    try {
      const urlList = urls.map(url => url.url);
      await urlHealthService.checkMultipleURLs(urlList);
      setLastCheck(new Date());
    } catch (error) {
      console.error('Health check failed:', error);
    } finally {
      setIsChecking(false);
    }
  };

  // Check single URL
  const checkSingleURL = async (url) => {
    try {
      await urlHealthService.checkURL(url);
    } catch (error) {
      console.error('Single URL check failed:', error);
    }
  };

  // Get health statistics
  const getStats = () => {
    const stats = urlHealthService.getHealthStats();
    return stats;
  };

  const stats = getStats();

  return (
    <div style={{ 
      background: 'white', 
      border: '1px solid #e5e7eb', 
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div>
          <h3 style={{ margin: '0 0 8px 0', color: '#111827' }}>
            🏥 URL Health Monitor
          </h3>
          <p style={{ margin: '0', fontSize: '14px', color: '#6b7280' }}>
            Monitor the accessibility and performance of your URLs
          </p>
        </div>
        
        <button
          onClick={checkAllURLs}
          disabled={isChecking || urls.length === 0}
          style={{
            background: isChecking ? '#9ca3af' : '#10b981',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: isChecking ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          {isChecking ? (
            <>
              <span style={{ 
                animation: 'spin 1s linear infinite',
                display: 'inline-block'
              }}>
                ⟳
              </span>
              Checking...
            </>
          ) : (
            <>
              🔍 Check All URLs
            </>
          )}
        </button>
      </div>

      {/* Health Statistics */}
      {stats.total > 0 && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
          gap: '12px',
          marginBottom: '20px'
        }}>
          <StatCard
            label="Total URLs"
            value={stats.total}
            color="#6b7280"
            icon="🔗"
          />
          <StatCard
            label="Healthy"
            value={stats.healthy}
            color="#10b981"
            icon="✅"
          />
          <StatCard
            label="Issues"
            value={stats.unhealthy}
            color="#ef4444"
            icon="❌"
          />
          <StatCard
            label="Unknown"
            value={stats.unknown}
            color="#f59e0b"
            icon="❓"
          />
          <StatCard
            label="Health Score"
            value={`${stats.healthyPercentage}%`}
            color={stats.healthyPercentage >= 80 ? "#10b981" : stats.healthyPercentage >= 60 ? "#f59e0b" : "#ef4444"}
            icon="📊"
          />
        </div>
      )}

      {/* Settings */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '12px',
        background: '#f9fafb',
        borderRadius: '8px'
      }}>
        <div>
          <label style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            color: '#374151'
          }}>
            <input
              type="checkbox"
              checked={autoCheck}
              onChange={(e) => setAutoCheck(e.target.checked)}
              style={{ margin: 0 }}
            />
            Auto-check every 30 minutes
          </label>
        </div>
        
        {lastCheck && (
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            Last check: {lastCheck.toLocaleTimeString()}
          </div>
        )}
      </div>

      {/* Health Status Indicators for Each URL */}
      {urls.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#374151' }}>
            Individual URL Status
          </h4>
          <div style={{ 
            display: 'grid', 
            gap: '8px',
            maxHeight: '200px',
            overflowY: 'auto'
          }}>
            {urls.map(url => {
              const health = healthData.get(url.url);
              return (
                <URLHealthItem
                  key={url.id}
                  url={url}
                  health={health}
                  onCheck={() => checkSingleURL(url.url)}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Add spinning animation styles */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ label, value, color, icon }) => (
  <div style={{ 
    background: '#f9fafb',
    border: '1px solid #f3f4f6',
    borderRadius: '8px',
    padding: '12px',
    textAlign: 'center'
  }}>
    <div style={{ fontSize: '20px', marginBottom: '4px' }}>{icon}</div>
    <div style={{ 
      fontSize: '18px', 
      fontWeight: '600', 
      color: color,
      marginBottom: '2px'
    }}>
      {value}
    </div>
    <div style={{ 
      fontSize: '12px', 
      color: '#6b7280',
      fontWeight: '500'
    }}>
      {label}
    </div>
  </div>
);

// Individual URL Health Item
const URLHealthItem = ({ url, health, onCheck }) => {
  const getHealthIcon = () => {
    if (!health || health.isHealthy === null) return '❓';
    return health.isHealthy ? '✅' : '❌';
  };

  const getHealthColor = () => {
    if (!health || health.isHealthy === null) return '#f59e0b';
    return health.isHealthy ? '#10b981' : '#ef4444';
  };

  const getStatusText = () => {
    if (!health || health.isHealthy === null) return 'Not checked';
    if (health.isHealthy) {
      return health.responseTime ? `Healthy (${health.responseTime}ms)` : 'Healthy';
    }
    return health.error || 'Unreachable';
  };

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      padding: '8px 12px',
      background: '#ffffff',
      border: '1px solid #f3f4f6',
      borderRadius: '6px',
      fontSize: '13px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
        <span style={{ fontSize: '14px' }}>{getHealthIcon()}</span>
        <span style={{ 
          fontWeight: '500', 
          color: '#111827',
          truncate: 'true',
          maxWidth: '150px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {url.title}
        </span>
        <span style={{ color: getHealthColor(), fontSize: '12px' }}>
          {getStatusText()}
        </span>
      </div>
      
      <button
        onClick={onCheck}
        style={{
          background: '#f3f4f6',
          border: 'none',
          borderRadius: '4px',
          padding: '4px 8px',
          fontSize: '11px',
          cursor: 'pointer',
          color: '#6b7280'
        }}
        title="Check this URL"
      >
        🔍
      </button>
    </div>
  );
};