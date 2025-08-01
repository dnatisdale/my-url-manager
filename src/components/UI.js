import React, { useEffect } from 'react';
import { X, AlertTriangle, Check, Database } from 'lucide-react';

// Loading Spinner Component
export const LoadingSpinner = ({ size = 'sm', isDark }) => {
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

// Touch Button Component
export const TouchButton = ({ 
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
  const handleClick = (e) => {
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
    
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

// Toast Notification Component
export const Toast = ({ message, type = 'success', onClose, isVisible }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const typeStyles = {
    success: 'bg-green-500/90 text-white border-green-400',
    error: 'bg-red-500/90 text-white border-red-400',
    warning: 'bg-yellow-500/90 text-white border-yellow-400',
    info: 'bg-blue-500/90 text-white border-blue-400'
  };

  return (
    <div className={`
      fixed top-4 right-4 z-50 p-4 rounded-xl shadow-xl backdrop-blur-xl border
      ${typeStyles[type]} transform transition-all duration-300
      ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
    `}>
      <div className="flex items-center gap-2">
        {type === 'success' && <Check size={20} />}
        {type === 'error' && <X size={20} />}
        {type === 'warning' && <AlertTriangle size={20} />}
        {type === 'info' && <Database size={20} />}
        <span className="font-medium">{message}</span>
        <button onClick={onClose} className="ml-2 hover:opacity-70">
          <X size={16} />
        </button>
      </div>
    </div>
  );
};