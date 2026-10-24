import { useApp } from '../context/AppContext.tsx';
import { translations, TranslationDictionary, SupportedLanguage } from './translations.ts';

export const useTranslation = () => {
  const { language, setLanguage } = useApp();

  const currentLang: SupportedLanguage = language === 'hi' ? 'hi' : 'en';

  const t = (key: keyof TranslationDictionary): string => {
    const dict = translations[currentLang] || translations.en;
    return dict[key] || translations.en[key] || key;
  };

  const toggleLanguage = () => {
    const nextLang: SupportedLanguage = currentLang === 'en' ? 'hi' : 'en';
    setLanguage(nextLang);
  };

  return {
    t,
    currentLang,
    language: currentLang,
    setLanguage: (lang: SupportedLanguage) => setLanguage(lang),
    toggleLanguage,
    isHindi: currentLang === 'hi',
    isEnglish: currentLang === 'en',
  };
};
