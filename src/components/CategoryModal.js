import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { TouchButton } from './UI';

export const CategoryModal = ({
  isOpen,
  onClose,
  mode, // 'add', 'edit', 'delete'
  category,
  categories,
  onSave,
  onDelete,
  t,
  isDark,
  isThaiMode,
  themeConfig
}) => {
  const [categoryName, setCategoryName] = useState(category || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCategoryName(category || '');
    }
  }, [isOpen, category]);

  const handleSave = async () => {
    if (!categoryName.trim()) return;
    
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
    
    if (mode === 'add' || mode === 'edit') {
      onSave(categoryName.trim());
    }
    
    setLoading(false);
    onClose();
  };

  const handleDelete = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
    onDelete();
    setLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className={`${themeConfig.cardBg} p-6 rounded-3xl max-w-md w-full shadow-2xl border ${themeConfig.cardBorder}`}>
        <div className="flex justify-between items-center mb-6">
          <h3 className={`text-xl font-bold ${themeConfig.text}`}>
            {mode === 'add' && t.addCategory}
            {mode === 'edit' && t.editCategory}
            {mode === 'delete' && t.deleteCategory}
          </h3>
          <TouchButton onClick={onClose} variant="secondary" size="sm" className="p-2" isDark={isDark}>
            <X size={20} />
          </TouchButton>
        </div>

        {mode === 'delete' ? (
          <div className="mb-6">
            <p className={`text-lg ${themeConfig.text} mb-4`}>
              {t.confirmDeleteCategory}
            </p>
            <div className={`p-4 rounded-xl ${isDark ? 'bg-red-900/20' : 'bg-red-50'} border border-red-500/20`}>
              <p className={`font-bold text-red-500`}>
                "{category}"
              </p>
            </div>
          </div>
        ) : (
          <div className="mb-6">
            <label className={`block text-sm font-medium ${themeConfig.text} mb-2`}>
              {t.categoryName}
            </label>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder={mode === 'edit' ? t.newCategoryName : t.categoryName}
              className={`
                w-full p-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent
                transition-all duration-300 font-medium
                ${isDark 
                  ? 'border-purple-500/30 focus:ring-purple-500/30 bg-gray-800/40 text-purple-100 placeholder-purple-300/60' 
                  : isThaiMode 
                  ? 'border-orange-200/50 focus:ring-orange-500/30 bg-white/60 text-orange-900 placeholder-orange-500/60'
                  : 'border-blue-200/50 focus:ring-blue-500/30 bg-white/60 text-blue-900 placeholder-blue-500/60'
                }
              `}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !loading) {
                  handleSave();
                }
              }}
              autoFocus
            />
          </div>
        )}

        <div className="flex gap-3 justify-end">
          <TouchButton
            onClick={onClose}
            variant="secondary"
            size="md"
            isDark={isDark}
            disabled={loading}
          >
            {t.cancel}
          </TouchButton>
          
          {mode === 'delete' ? (
            <TouchButton
              onClick={handleDelete}
              variant="danger"
              size="md"
              isDark={isDark}
              loading={loading}
            >
              {t.delete}
            </TouchButton>
          ) : (
            <TouchButton
              onClick={handleSave}
              variant="primary"
              size="md"
              isDark={isDark}
              isThaiMode={isThaiMode}
              loading={loading}
              disabled={!categoryName.trim()}
            >
              {t.confirm}
            </TouchButton>
          )}
        </div>
      </div>
    </div>
  );
};