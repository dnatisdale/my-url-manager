import React, { useState } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Clock, 
  Loader2, 
  RefreshCw,
  Wifi,
  WifiOff,
  Shield,
  ShieldAlert
} from 'lucide-react';
import { InfoTooltip } from './InfoTooltip';

export const URLHealthIndicator = ({ 
  url, 
  healthData, 
  onRecheck, 
  size = 'sm',
  showDetails = false,
  showLastChecked = false,
  className = "" 
}) => {
  const [isRechecking, setIsRechecking] = useState(false);

  const handleRecheck = async () => {
    if (!onRecheck || isRechecking) return;
    
    setIsRechecking(true);
    try {
      await onRecheck(url);
    } finally {
      setIsRechecking(false);
    }
  };

  const getHealthIcon = () => {
    const iconSize = size === 'lg' ? 20 : size === 'md' ? 16 : 14;

    if (isRechecking || !healthData) {
      return <Loader2 size={iconSize} className="animate-spin text-blue-500" />;
    }

    const { isHealthy, error } = healthData;

    if (isHealthy === true) {
      return <CheckCircle size={iconSize} className="text-green-500" />;
    }

    if (isHealthy === false) {
      if (error?.includes('timeout') || error?.includes('TIMEOUT')) {
        return <Clock size={iconSize} className="text-yellow-500" />;
      }
      return <XCircle size={iconSize} className="text-red-500" />;
    }

    return <AlertCircle size={iconSize} className="text-gray-400" />;
  };

  const getHealthText = () => {
    if (isRechecking) return 'Checking...';
    if (!healthData) return 'Not checked';

    const { isHealthy, error, responseTime } = healthData;

    if (isHealthy === true) {
      const timeText = responseTime ? ` (${responseTime}ms)` : '';
      return `Healthy${timeText}`;
    }

    if (isHealthy === false) {
      if (error?.includes('timeout')) return 'Timeout';
      if (error?.includes('CORS')) return 'CORS blocked';
      if (error?.includes('404')) return 'Not found';
      if (error?.includes('403')) return 'Forbidden';
      if (error?.includes('500')) return 'Server error';
      return error || 'Unreachable';
    }

    return 'Unknown';
  };

  const getHealthColor = () => {
    if (isRechecking || !healthData) return 'text-blue-500';
    
    const { isHealthy, error } = healthData;

    if (isHealthy === true) return 'text-green-500';
    if (isHealthy === false) {
      if (error?.includes('timeout')) return 'text-yellow-500';
      return 'text-red-500';
    }
    return 'text-gray-400';
  };

  const getDetailedInfo = () => {
    if (!healthData) return 'No health data available';

    const { 
      isHealthy, 
      responseTime, 
      statusCode, 
      error, 
      lastChecked,
      checkCount,
      redirected,
      finalURL
    } = healthData;

    const parts = [];

    if (isHealthy === true) {
      parts.push('✅ URL is accessible');
      if (responseTime) parts.push(`⚡ Response time: ${responseTime}ms`);
      if (statusCode && statusCode !== 'unknown') parts.push(`📊 Status: ${statusCode}`);
      if (redirected && finalURL !== url) parts.push(`🔄 Redirected to: ${finalURL}`);
    } else if (isHealthy === false) {
      parts.push('❌ URL is not accessible');
      if (error) parts.push(`❗ Error: ${error}`);
      if (statusCode && statusCode !== 'unknown') parts.push(`📊 Status: ${statusCode}`);
    } else {
      parts.push('❓ Health status unknown');
    }

    if (lastChecked) {
      const date = new Date(lastChecked);
      parts.push(`🕒 Last checked: ${date.toLocaleString()}`);
    }

    if (checkCount) {
      parts.push(`🔢 Checks performed: ${checkCount}`);
    }

    return parts.join('\n');
  };

  const getSecurityIcon = () => {
    if (!url) return null;
    
    const isSecure = url.startsWith('https://');
    const iconSize = size === 'lg' ? 16 : size === 'md' ? 14 : 12;

    return isSecure 
      ? <Shield size={iconSize} className="text-green-500" />
      : <ShieldAlert size={iconSize} className="text-yellow-500" />;
  };

  const getConnectivityIcon = () => {
    if (!healthData) return null;
    
    const iconSize = size === 'lg' ? 16 : size === 'md' ? 14 : 12;
    const { isHealthy } = healthData;

    if (isHealthy === true) {
      return <Wifi size={iconSize} className="text-green-500" />;
    } else if (isHealthy === false) {
      return <WifiOff size={iconSize} className="text-red-500" />;
    }

    return null;
  };

  const formatLastChecked = (lastChecked) => {
    if (!lastChecked) return 'Never';
    
    const date = new Date(lastChecked);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  // Compact view for small indicators
  if (!showDetails) {
    return (
      <div className={`inline-flex items-center gap-1 ${className}`}>
        {getHealthIcon()}
        
        {showLastChecked && healthData?.lastChecked && (
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatLastChecked(healthData.lastChecked)}
          </span>
        )}

        {onRecheck && (
          <button
            onClick={handleRecheck}
            disabled={isRechecking}
            className="ml-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors disabled:opacity-50"
            aria-label="Recheck URL health"
          >
            <RefreshCw size={12} className={isRechecking ? 'animate-spin' : ''} />
          </button>
        )}

        <InfoTooltip 
          content={getDetailedInfo()}
          iconSize={12}
          position="top"
        />
      </div>
    );
  }

  // Detailed view
  return (
    <div className={`space-y-2 ${className}`}>
      {/* Main Status */}
      <div className="flex items-center gap-2">
        {getHealthIcon()}
        <span className={`text-sm font-medium ${getHealthColor()}`}>
          {getHealthText()}
        </span>
        
        {onRecheck && (
          <button
            onClick={handleRecheck}
            disabled={isRechecking}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors disabled:opacity-50"
            aria-label="Recheck URL health"
          >
            <RefreshCw size={14} className={isRechecking ? 'animate-spin' : ''} />
          </button>
        )}
      </div>

      {/* Additional Details */}
      {healthData && (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 space-y-2">
          <div className="grid grid-cols-2 gap-4 text-xs">
            {/* Security Status */}
            <div className="flex items-center gap-1">
              {getSecurityIcon()}
              <span className="text-gray-600 dark:text-gray-400">Security:</span>
              <span className={url?.startsWith('https://') ? 'text-green-600' : 'text-yellow-600'}>
                {url?.startsWith('https://') ? 'HTTPS' : 'HTTP'}
              </span>
            </div>

            {/* Connectivity */}
            <div className="flex items-center gap-1">
              {getConnectivityIcon()}
              <span className="text-gray-600 dark:text-gray-400">Status:</span>
              <span className={getHealthColor().replace('text-', '')}>
                {healthData.isHealthy === true ? 'Online' : 
                 healthData.isHealthy === false ? 'Offline' : 'Unknown'}
              </span>
            </div>

            {/* Response Time */}
            {healthData.responseTime && (
              <div className="flex items-center gap-1">
                <Clock size={12} className="text-gray-500" />
                <span className="text-gray-600 dark:text-gray-400">Response:</span>
                <span className={
                  healthData.responseTime < 1000 ? 'text-green-600' :
                  healthData.responseTime < 3000 ? 'text-yellow-600' : 'text-red-600'
                }>
                  {healthData.responseTime}ms
                </span>
              </div>
            )}

            {/* Last Checked */}
            {healthData.lastChecked && (
              <div className="flex items-center gap-1">
                <RefreshCw size={12} className="text-gray-500" />
                <span className="text-gray-600 dark:text-gray-400">Checked:</span>
                <span className="text-gray-800 dark:text-gray-200">
                  {formatLastChecked(healthData.lastChecked)}
                </span>
              </div>
            )}

            {/* Status Code */}
            {healthData.statusCode && healthData.statusCode !== 'unknown' && (
              <div className="flex items-center gap-1 col-span-2">
                <span className="text-gray-600 dark:text-gray-400">Status Code:</span>
                <span className={
                  healthData.statusCode.toString().startsWith('2') ? 'text-green-600' :
                  healthData.statusCode.toString().startsWith('3') ? 'text-blue-600' :
                  healthData.statusCode.toString().startsWith('4') ? 'text-yellow-600' :
                  'text-red-600'
                }>
                  {healthData.statusCode}
                </span>
              </div>
            )}
          </div>

          {/* Error Details */}
          {healthData.error && healthData.isHealthy === false && (
            <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Error Details:</p>
              <p className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded p-2">
                {healthData.error}
              </p>
            </div>
          )}

          {/* Redirect Info */}
          {healthData.redirected && healthData.finalURL && healthData.finalURL !== url && (
            <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Redirected to:</p>
              <p className="text-xs text-blue-600 dark:text-blue-400 break-all">
                {healthData.finalURL}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Health Status Badge Component
export const URLHealthBadge = ({ healthData, size = 'sm' }) => {
  if (!healthData) {
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
        Unknown
      </span>
    );
  }

  const { isHealthy, responseTime, error } = healthData;
  
  const getBadgeProps = () => {
    if (isHealthy === true) {
      const speed = responseTime < 1000 ? 'Fast' : responseTime < 3000 ? 'Normal' : 'Slow';
      return {
        className: 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400',
        text: `Healthy${responseTime ? ` • ${speed}` : ''}`
      };
    }
    
    if (isHealthy === false) {
      if (error?.includes('timeout')) {
        return {
          className: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400',
          text: 'Timeout'
        };
      }
      return {
        className: 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400',
        text: 'Unreachable'
      };
    }

    return {
      className: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
      text: 'Unknown'
    };
  };

  const { className, text } = getBadgeProps();
  const paddingClass = size === 'lg' ? 'px-3 py-1.5' : size === 'md' ? 'px-2.5 py-1' : 'px-2 py-0.5';
  const textClass = size === 'lg' ? 'text-sm' : 'text-xs';

  return (
    <span className={`inline-flex items-center ${paddingClass} rounded-full ${textClass} font-medium ${className}`}>
      {text}
    </span>
  );
};