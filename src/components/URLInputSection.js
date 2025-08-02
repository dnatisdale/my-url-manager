import React, { useState, useCallback, useRef } from 'react';
import { Plus, Link, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { URLValidator, validateURLFormat } from './URLValidator';
import { urlHealthService } from '../services/URLHealthService';

export const URLInputSection = ({ 
  onAddURL, 
  categories = [], 
  translations = {},
  theme = 'light'
}) => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [showValidation, setShowValidation] = useState(false);
  const [requireValidation, setRequireValidation] = useState(true);

  const urlInputRef = useRef(null);
  const titleInputRef = useRef(null);

  const handleURLChange = useCallback((e) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    
    // Show validation for non-empty URLs
    setShowValidation(newUrl.trim().length > 0);
    
    // Auto-generate title from URL if title is empty
    if (!title && newUrl) {
      try {
        const urlObj = new URL(newUrl.startsWith('http') ? newUrl : `https://${newUrl}`);
        const generatedTitle = urlObj.hostname.replace('www.', '');
        setTitle(generatedTitle);
      } catch (error) {
        // Invalid URL format, don't auto-generate title
      }
    }
  }, [title]);

  const handleValidationComplete = useCallback((result) => {
    setValidationResult(result);
  }, []);

  const canAddURL = () => {
    if (!url.trim() || !title.trim()) return false;
    if (isAdding) return false;
    
    if (requireValidation && validationResult) {
      return validationResult.isValid && validationResult.isAccessible;
    }
    
    // If validation not required, just check format
    const formatCheck = validateURLFormat(url);
    return formatCheck.isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!canAddURL()) return;

    setIsAdding(true);

    try {
      // Ensure URL has protocol
      let finalUrl = url.trim();
      if (!/^https?:\/\//i.test(finalUrl)) {
        finalUrl = 'https://' + finalUrl;
      }

      // Create URL object with health data
      const urlData = {
        id: Date.now().toString(),
        url: finalUrl,
        title: title.trim(),
        category: category.trim() || null,
        description: description.trim() || null,
        dateAdded: new Date().toISOString(),
        isHealthy: validationResult?.isAccessible ?? null,
        lastHealthCheck: validationResult ? new Date().toISOString() : null,
        healthData: validationResult || null
      };

      // Add to health monitoring
      if (validationResult) {
        urlHealthService.healthCache.set(finalUrl, {
          ...validationResult,
          lastChecked: new Date().toISOString(),
          checkCount: 1
        });
      }

      // Call the parent's add function
      await onAddURL(urlData);

      // Reset form
      setUrl('');
      setTitle('');
      setCategory('');
      setDescription('');
      setValidationResult(null);
      setShowValidation(false);

      // Focus back to URL input
      urlInputRef.current?.focus();

    } catch (error) {
      console.error('Error adding URL:', error);
      // You might want to show an error message here
    } finally {
      setIsAdding(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSubmit(e);
    }
  };

  const getValidationIcon = () => {
    if (!showValidation || !validationResult) return null;

    if (validationResult.isValidating) {
      return <Loader2 size={16} className="animate-spin text-blue-500" />;
    }

    if (validationResult.isValid && validationResult.isAccessible) {
      return <CheckCircle size={16} className="text-green-500" />;
    }

    return <AlertCircle size={16} className="text-red-500" />;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Link className="text-blue-600 dark:text-blue-400" size={20} />
        <h2 className="text-lg font-semibold text-black dark:text-white">
          {translations.addURL?.title || 'Add New URL'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* URL Input with Validation */}
        <div className="space-y-2">
          <label htmlFor="url-input" className="block text-sm font-medium text-black dark:text-white">
            URL {requireValidation && <span className="text-red-500">*</span>}
          </label>
          <div className="relative">
            <input
              ref={urlInputRef}
              id="url-input"
              type="text"
              value={url}
              onChange={handleURLChange}
              onKeyPress={handleKeyPress}
              placeholder="https://example.com or example.com"
              className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              disabled={isAdding}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {getValidationIcon()}
            </div>
          </div>

          {/* Real-time URL Validation */}
          {showValidation && (
            <URLValidator
              url={url}
              onValidationComplete={handleValidationComplete}
              autoValidate={true}
              showDetails={false}
              className="mt-2"
            />
          )}
        </div>

        {/* Title Input */}
        <div>
          <label htmlFor="title-input" className="block text-sm font-medium text-black dark:text-white">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            ref={titleInputRef}
            id="title-input"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter a descriptive title"
            className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            disabled={isAdding}
          />
        </div>

        {/* Category Selection */}
        <div>
          <label htmlFor="category-input" className="block text-sm font-medium text-black dark:text-white">
            Category
          </label>
          <div className="mt-1 flex gap-2">
            <input
              id="category-input"
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter or select category"
              list="categories-list"
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              disabled={isAdding}
            />
            <datalist id="categories-list">
              {categories.map((cat, index) => (
                <option key={index} value={cat} />
              ))}
            </datalist>
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description-input" className="block text-sm font-medium text-black dark:text-white">
            Description
          </label>
          <textarea
            id="description-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional description or notes"
            rows={2}
            className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white resize-none"
            disabled={isAdding}
          />
        </div>

        {/* Validation Settings */}
        <div className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={requireValidation}
              onChange={(e) => setRequireValidation(e.target.checked)}
              className="text-blue-600 focus:ring-blue-500 rounded"
              disabled={isAdding}
            />
            <span className="text-sm text-black dark:text-white">
              Require URL validation before adding
            </span>
          </label>
        </div>

        {/* Validation Status Summary */}
        {showValidation && validationResult && (
          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              {validationResult.isValid ? (
                <CheckCircle size={14} className="text-green-500" />
              ) : (
                <AlertCircle size={14} className="text-red-500" />
              )}
              <span className="font-medium text-black dark:text-white">
                Validation Status:
              </span>
              <span className={
                validationResult.isValid && validationResult.isAccessible
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }>
                {validationResult.isValid && validationResult.isAccessible
                  ? 'Ready to add'
                  : validationResult.error || 'Cannot add URL'}
              </span>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={!canAddURL()}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg transition-colors font-medium"
          >
            {isAdding ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Plus size={18} />
                Add URL
              </>
            )}
          </button>

          {!requireValidation && showValidation && validationResult?.isValid === false && (
            <button
              type="button"
              onClick={() => {
                // Force add even with validation failure
                const formatCheck = validateURLFormat(url);
                if (formatCheck.isValid) {
                  setValidationResult({ ...formatCheck, isAccessible: true });
                }
              }}
              className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors font-medium text-sm"
            >
              Add Anyway
            </button>
          )}
        </div>

        {/* Keyboard Shortcut Hint */}
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Press Ctrl+Enter to quickly add URL
        </p>
      </form>
    </div>
  );
};