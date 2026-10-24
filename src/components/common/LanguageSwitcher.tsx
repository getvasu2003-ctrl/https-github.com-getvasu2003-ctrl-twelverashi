import React from 'react';
import { useTranslation } from '../../i18n/useTranslation.ts';
import { Globe, Check } from 'lucide-react';

interface LanguageSwitcherProps {
  variant?: 'pill' | 'dropdown' | 'compact';
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = 'pill',
  className = '',
}) => {
  const { currentLang, setLanguage, toggleLanguage, isHindi } = useTranslation();

  if (variant === 'compact') {
    return (
      <button
        onClick={toggleLanguage}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-orange-200 dark:border-stone-800 bg-white/90 dark:bg-stone-900 text-xs font-bold text-stone-700 dark:text-stone-200 hover:border-orange-400 transition cursor-pointer shadow-2xs ${className}`}
        title={`Current: ${isHindi ? 'हिन्दी' : 'English'}. Click to toggle.`}
        aria-label="Toggle language between English and Hindi"
      >
        <Globe className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
        <span className="font-semibold text-[11px]">
          {isHindi ? 'हिन्दी' : 'EN'}
        </span>
      </button>
    );
  }

  return (
    <div
      role="group"
      aria-label="Language selection"
      className={`inline-flex items-center p-0.5 rounded-full bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-inner ${className}`}
    >
      {/* English Button */}
      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={`relative px-2.5 sm:px-3 py-1 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1 ${
          currentLang === 'en'
            ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs'
            : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
        }`}
        aria-pressed={currentLang === 'en'}
      >
        <Globe className={`w-3 h-3 ${currentLang === 'en' ? 'text-white' : 'text-stone-400'}`} />
        <span>English</span>
      </button>

      {/* Hindi Button */}
      <button
        type="button"
        onClick={() => setLanguage('hi')}
        className={`relative px-2.5 sm:px-3 py-1 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1 ${
          currentLang === 'hi'
            ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs font-sans'
            : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
        }`}
        aria-pressed={currentLang === 'hi'}
      >
        <span className="text-[11px] font-sans font-bold">हिन्दी</span>
      </button>
    </div>
  );
};
