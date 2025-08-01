import React from 'react';
import { LogIn } from 'lucide-react';
import { TouchButton } from './UI';

export const SignInSection = ({
  t,
  themeConfig,
  isDarkMode,
  isThaiMode,
  email,
  setEmail,
  isSigningIn,
  handleSignIn,
  handleEmailKeyPress
}) => {
  return (
    <div className={`${themeConfig.cardBg} rounded-3xl p-6 border ${themeConfig.cardBorder}`}>
      <div className="text-center space-y-4">
        <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r ${themeConfig.accent} flex items-center justify-center`}>
          <LogIn className="text-white" size={24} />
        </div>
        <h2 className={`text-2xl font-bold ${themeConfig.text}`}>
          {t.signInRequired}
        </h2>
        <p className={`${themeConfig.textSecondary}`}>
          {t.signInMessage}
        </p>
        
        <div className="max-w-md mx-auto space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={handleEmailKeyPress}
            placeholder={t.emailPlaceholder}
            className={`
              w-full p-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent
              transition-all duration-300 font-medium
              ${isDarkMode 
                ? 'border-purple-500/30 focus:ring-purple-500/30 bg-gray-800/40 text-purple-100 placeholder-purple-300/60' 
                : isThaiMode 
                ? 'border-blue-200/50 focus:ring-blue-500/30 bg-white/60 text-blue-900 placeholder-blue-500/60'
                : 'border-blue-200/50 focus:ring-blue-500/30 bg-white/60 text-blue-900 placeholder-blue-500/60'
              }
            `}
          />
          <TouchButton
            onClick={handleSignIn}
            variant="primary"
            size="lg"
            className="w-full"
            isDark={isDarkMode}
            isThaiMode={isThaiMode}
            loading={isSigningIn}
            disabled={!email.trim()}
          >
            <LogIn size={20} />
            {t.signIn}
          </TouchButton>
        </div>
      </div>
    </div>
  );
};