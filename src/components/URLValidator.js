import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Loader2, Globe, Shield, Clock } from 'lucide-react';

export const URLValidator = ({ 
  url, 
  onValidationComplete, 
  autoValidate = true,
  showDetails = true,
  className = "" 
}) => {
  const [validationState, setValidationState] = useState({
    isValid: null,
    isAccessible: null,
    isSecure: null,
    responseTime: null,
    statusCode: null,
    error: null,
    isValidating: false
  });

  const [validationHistory, setValidationHistory] = useState([]);

  useEffect(() => {
    if (url && autoValidate) {
      validateURL(url);
    }
  }, [url, autoValidate]);

  const validateURL = async (urlToValidate) => {
    if (!urlToValidate) {
      resetValidation();
      return;
    }

    setValidationState(prev => ({ ...prev, isValidating: true, error: null }));
    
    try {
      // Step 1: Format validation
      const formatResult = validateURLFormat(urlToValidate);
      
      if (!formatResult.isValid) {
        const result = {
          isValid: false,
          isAccessible: false,
          isSecure: false,
          responseTime: null,
          statusCode: null,
          error: formatResult.error,
          isValidating: false
        };
        
        setValidationState(result);
        onValidationComplete?.(result);
        return result;
      }

      // Step 2: Accessibility check
      const accessibilityResult = await checkURLAccessibility(urlToValidate);
      
      const finalResult = {
        ...formatResult,
        ...accessibilityResult,
        isValidating: false
      };

      setValidationState(finalResult);
      
      // Add to validation history
      setValidationHistory(prev => [
        {
          timestamp: new Date().toISOString(),
          url: urlToValidate,
          result: finalResult
        },
        ...prev.slice(0, 4) // Keep last 5 validations
      ]);

      onValidationComplete?.(finalResult);
      return finalResult;

    } catch (error) {
      const errorResult = {
        isValid: true, // Format might be valid
        isAccessible: false,
        isSecure: false,
        responseTime: null,
        statusCode: null,
        error: error.message,
        isValidating: false
      };

      setValidationState(errorResult);
      onValidationComplete?.(errorResult);
      return errorResult;
    }
  };

  const validateURLFormat = (url) => {
    try {
      // Add protocol if missing
      let formattedUrl = url.trim();
      if (!/^https?:\/\//i.test(formattedUrl)) {
        formattedUrl = 'https://' + formattedUrl;
      }

      const urlObj = new URL(formattedUrl);
      
      // Basic validation checks
      if (!urlObj.hostname) {
        return { isValid: false, error: 'Invalid hostname' };
      }

      if (urlObj.hostname.length > 253) {
        return { isValid: false, error: 'Hostname too long' };
      }

      // Check for valid TLD (basic check)
      const parts = urlObj.hostname.split('.');
      if (parts.length < 2 || parts[parts.length - 1].length < 2) {
        return { isValid: false, error: 'Invalid domain format' };
      }

      return {
        isValid: true,
        isSecure: urlObj.protocol === 'https:',
        formattedUrl: formattedUrl,
        error: null
      };

    } catch (error) {
      return {
        isValid: false,
        error: 'Invalid URL format'
      };
    }
  };

  const checkURLAccessibility = async (url) => {
    const startTime = Date.now();
    
    try {
      // Use a CORS proxy or direct fetch based on your needs
      // For production, you might want to use your own backend service
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(url, {
        method: 'HEAD', // Use HEAD to minimize data transfer
        mode: 'no-cors', // This will limit what we can read but avoid CORS issues
        signal: controller.signal,
        cache: 'no-cache'
      });

      clearTimeout(timeoutId);
      const responseTime = Date.now() - startTime;

      // With no-cors mode, we can't read the actual status
      // but if the fetch doesn't throw, the URL is likely accessible
      return {
        isAccessible: true,
        responseTime: responseTime,
        statusCode: 'unknown', // Can't read status with no-cors
        error: null
      };

    } catch (error) {
      const responseTime = Date.now() - startTime;

      if (error.name === 'AbortError') {
        return {
          isAccessible: false,
          responseTime: responseTime,
          statusCode: 'timeout',
          error: 'Request timeout'
        };
      }

      // Try alternative method - create an image element to test accessibility
      return await checkURLViaImage(url);
    }
  };

  const checkURLViaImage = (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      const startTime = Date.now();
      
      const cleanup = () => {
        img.onload = null;
        img.onerror = null;
      };

      img.onload = () => {
        cleanup();
        resolve({
          isAccessible: true,
          responseTime: Date.now() - startTime,
          statusCode: 'image-load-success',
          error: null
        });
      };

      img.onerror = () => {
        cleanup();
        // Even if image fails, the domain might be accessible
        resolve({
          isAccessible: false,
          responseTime: Date.now() - startTime,
          statusCode: 'unreachable',
          error: 'URL not accessible'
        });
      };

      // Set a timeout
      setTimeout(() => {
        cleanup();
        resolve({
          isAccessible: false,
          responseTime: Date.now() - startTime,
          statusCode: 'timeout',
          error: 'Connection timeout'
        });
      }, 8000);

      img.src = url + '/favicon.ico?' + Date.now(); // Try to load favicon
    });
  };

  const resetValidation = () => {
    setValidationState({
      isValid: null,
      isAccessible: null,
      isSecure: null,
      responseTime: null,
      statusCode: null,
      error: null,
      isValidating: false
    });
  };

  const getValidationIcon = () => {
    const { isValid, isAccessible, isValidating, error } = validationState;

    if (isValidating) {
      return <Loader2 size={16} className="animate-spin text-blue-500" />;
    }

    if (error || isValid === false) {
      return <XCircle size={16} className="text-red-500" />;
    }

    if (isValid && isAccessible) {
      return <CheckCircle size={16} className="text-green-500" />;
    }

    if (isValid && isAccessible === false) {
      return <AlertCircle size={16} className="text-yellow-500" />;
    }

    return null;
  };

  const getValidationMessage = () => {
    const { isValid, isAccessible, isValidating, error, responseTime, isSecure } = validationState;

    if (isValidating) return 'Validating URL...';
    if (error) return error;
    if (isValid === false) return 'Invalid URL format';
    if (isValid && isAccessible === false) return 'URL not accessible';
    if (isValid && isAccessible) {
      const secureText = isSecure ? 'Secure (HTTPS)' : 'Not secure (HTTP)';
      const timeText = responseTime ? ` • ${responseTime}ms` : '';
      return `${secureText}${timeText}`;
    }
    
    return '';
  };

  const getStatusColor = () => {
    const { isValid, isAccessible, error } = validationState;
    
    if (error || isValid === false) return 'text-red-600 dark:text-red-400';
    if (isValid && isAccessible) return 'text-green-600 dark:text-green-400';
    if (isValid && isAccessible === false) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  if (!url && !showDetails) return null;

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Validation Status */}
      <div className="flex items-center gap-2">
        {getValidationIcon()}
        <span className={`text-sm ${getStatusColor()}`}>
          {getValidationMessage()}
        </span>
      </div>

      {/* Detailed Information */}
      {showDetails && validationState.isValid !== null && (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 space-y-2">
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="flex items-center gap-1">
              <Globe size={12} className="text-gray-500" />
              <span className="text-gray-600 dark:text-gray-400">Format:</span>
              <span className={validationState.isValid ? 'text-green-600' : 'text-red-600'}>
                {validationState.isValid ? 'Valid' : 'Invalid'}
              </span>
            </div>
            
            <div className="flex items-center gap-1">
              <Shield size={12} className="text-gray-500" />
              <span className="text-gray-600 dark:text-gray-400">Security:</span>
              <span className={validationState.isSecure ? 'text-green-600' : 'text-yellow-600'}>
                {validationState.isSecure ? 'HTTPS' : 'HTTP'}
              </span>
            </div>
            
            {validationState.responseTime && (
              <div className="flex items-center gap-1">
                <Clock size={12} className="text-gray-500" />
                <span className="text-gray-600 dark:text-gray-400">Response:</span>
                <span className="text-gray-800 dark:text-gray-200">
                  {validationState.responseTime}ms
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Manual Validation Button */}
      {!autoValidate && (
        <button
          onClick={() => validateURL(url)}
          disabled={validationState.isValidating || !url}
          className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {validationState.isValidating ? 'Validating...' : 'Validate URL'}
        </button>
      )}
    </div>
  );
};

// Export validation functions for use in other components
export const validateURLFormat = (url) => {
  try {
    let formattedUrl = url.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = 'https://' + formattedUrl;
    }

    const urlObj = new URL(formattedUrl);
    
    if (!urlObj.hostname || urlObj.hostname.length > 253) {
      return { isValid: false, error: 'Invalid hostname' };
    }

    const parts = urlObj.hostname.split('.');
    if (parts.length < 2 || parts[parts.length - 1].length < 2) {
      return { isValid: false, error: 'Invalid domain format' };
    }

    return {
      isValid: true,
      isSecure: urlObj.protocol === 'https:',
      formattedUrl: formattedUrl,
      error: null
    };
  } catch (error) {
    return { isValid: false, error: 'Invalid URL format' };
  }
};