import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { TouchButton } from './UI';

export const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
  type = "danger", // "danger" or "warning"
  t,
  isDark,
  themeConfig
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className={`${themeConfig.cardBg} p-6 rounded-3xl max-w-md w-full shadow-2xl border ${themeConfig.cardBorder}`}>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${type === 'danger' ? 'bg-red-500' : 'bg-yellow-500'} flex items-center justify-center`}>
              <AlertTriangle className="text-white" size={20} />
            </div>
            <h3 className={`text-xl font-bold ${themeConfig.text}`}>
              {title}
            </h3>
          </div>
          <TouchButton onClick={onClose} variant="secondary" size="sm" className="p-2" isDark={isDark}>
            <X size={20} />
          </TouchButton>
        </div>

        <div className="mb-6">
          <p className={`text-lg ${themeConfig.text}`}>
            {message}
          </p>
        </div>

        <div className="flex gap-3 justify-end">
          <TouchButton
            onClick={onClose}
            variant="secondary"
            size="md"
            isDark={isDark}
          >
            {cancelText}
          </TouchButton>
          
          <TouchButton
            onClick={() => {
              onConfirm();
              onClose();
            }}
            variant={type}
            size="md"
            isDark={isDark}
          >
            {confirmText}
          </TouchButton>
        </div>
      </div>
    </div>
  );
};