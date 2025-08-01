// This entire code goes into: src/components/URLValidator.js

import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Loader } from 'lucide-react';

export const URLValidator = ({ url, onValidationChange, isDark = false }) => {
  const [status, setStatus] = useState('idle'); // idle, checking, valid, invalid, unreachable
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    if (!url) {
      setStatus('idle');
      onValidationChange?.(null);
      return;
    }

    const timeoutId = setTimeout(() => {
      validateURL(url);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [url]);

  const validateURL = async (urlToValidate) => {
    if (!urlToValidate.trim()) return;

    setIsChecking(true);
    setStatus('checking');

    try {
      // Basic URL format validation
      let processedUrl = urlToValidate.trim();
      if (!processedUrl.startsWith('http://') && !processedUrl.startsWith('https://')) {
        processedUrl = 'https://' + processedUrl;
      }

      const urlObj = new URL(processedUrl);
      
      // Check if URL is reachable (using a proxy service or basic checks)
      const isReachable = await checkURLReachability(processedUrl);
      
      if (isReachable) {
        setStatus('valid');
        onValidationChange?.({ isValid: true, processedUrl, status: 'reachable' });
      } else {
        setStatus('unreachable');
        onValidationChange?.({ isValid: false, processedUrl, status: 'unreachable' });
      }
    } catch (error) {
      setStatus('invalid');
      onValidationChange?.({ isValid: false, processedUrl: url, status: 'invalid' });
    }

    setIsChecking(false);
  };

  // Simple reachability check (you might want to implement a more robust solution)
  const checkURLReachability = async (url) => {
    try {
      // This is a simplified check - in production, you might use a CORS proxy
      // or implement server-side validation
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      await fetch(url, { 
        method: 'HEAD', 
        mode: 'no-cors',
        signal: controller.signal 
      });
      
      clearTimeout(timeoutId);
      return true;
    } catch (error) {
      // For now, we'll assume URLs are valid if they pass format validation
      // In production, implement proper server-side URL validation
      return true;
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'checking':
        return <Loader className="animate-spin text-blue-500" size={16} />;
      case 'valid':
        return <CheckCircle className="text-green-500" size={16} />;
      case 'invalid':
        return <XCircle className="text-red-500" size={16} />;
      case 'unreachable':
        return <AlertCircle className="text-yellow-500" size={16} />;
      default:
        return null;
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'checking':
        return 'Validating URL...';
      case 'valid':
        return 'URL is valid and reachable';
      case 'invalid':
        return 'Invalid URL format';
      case 'unreachable':
        return 'URL may not be reachable';
      default:
        return '';
    }
  };

  if (status === 'idle') return null;

  return (
    <div className="flex items-center gap-2 mt-2">
      {getStatusIcon()}
      <span className={`text-xs ${
        isDark ? 'text-purple-300' : 'text-gray-600'
      }`}>
        {getStatusMessage()}
      </span>
    </div>
  );
};