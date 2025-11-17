'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type Language = 'en' | 'fr' | 'de' | 'ar';

export interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  isRTL: boolean;
}

const initialState: LanguageContextType = {
  language: 'en',
  setLanguage: () => null,
  isRTL: false,
};

const LanguageContext = createContext<LanguageContextType>(initialState);

export interface LanguageProviderProps {
  children: ReactNode;
  defaultLanguage?: Language;
  enableLanguageDetection?: boolean;
}

/**
 * Detects the user's preferred language from browser settings
 * Falls back to English if the detected language is not supported
 */
const detectBrowserLanguage = (): Language => {
  if (typeof window === 'undefined') return 'en';

  const browserLang = navigator.language.toLowerCase();

  // Check for exact matches or language codes
  if (browserLang.startsWith('fr')) return 'fr';
  if (browserLang.startsWith('de')) return 'de';
  if (browserLang.startsWith('ar')) return 'ar';
  if (browserLang.startsWith('en')) return 'en';

  // Default to English for unsupported languages
  return 'en';
};

/**
 * Language Provider Component
 *
 * Provides language state and controls to the entire application.
 * Mirrors the ThemeProvider pattern for consistency.
 *
 * Features:
 * - localStorage persistence with SSR safety
 * - Auto-detection of browser language (optional)
 * - Dynamic HTML lang and dir attributes
 * - RTL support for Arabic
 *
 * @example
 * ```tsx
 * <LanguageProvider defaultLanguage="en" enableLanguageDetection={true}>
 *   <App />
 * </LanguageProvider>
 * ```
 */
export function LanguageProvider({
  children,
  defaultLanguage = 'en',
  enableLanguageDetection = true,
}: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(defaultLanguage);
  const [mounted, setMounted] = useState(false);

  // Load saved language or detect browser language on mount
  useEffect(() => {
    setMounted(true);

    if (typeof window === 'undefined') return;

    // Check localStorage first
    const savedLanguage = localStorage.getItem('language') as Language | null;

    if (savedLanguage && ['en', 'fr', 'de', 'ar'].includes(savedLanguage)) {
      setLanguageState(savedLanguage);
    } else if (enableLanguageDetection) {
      // Auto-detect browser language if no saved preference
      const detectedLang = detectBrowserLanguage();
      setLanguageState(detectedLang);
      localStorage.setItem('language', detectedLang);
    }
  }, [enableLanguageDetection]);

  // Apply language to document attributes
  useEffect(() => {
    if (typeof window === 'undefined' || !mounted) return;

    const root = window.document.documentElement;

    // Set lang attribute
    root.lang = language;

    // Set dir attribute for RTL support
    root.dir = language === 'ar' ? 'rtl' : 'ltr';

    // Add language class for CSS targeting
    root.classList.remove('lang-en', 'lang-fr', 'lang-de', 'lang-ar');
    root.classList.add(`lang-${language}`);
  }, [language, mounted]);

  const setLanguage = (newLanguage: Language) => {
    if (!['en', 'fr', 'de', 'ar'].includes(newLanguage)) {
      console.warn(`Invalid language: ${newLanguage}. Falling back to English.`);
      newLanguage = 'en';
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('language', newLanguage);
    }

    setLanguageState(newLanguage);
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    isRTL: language === 'ar',
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <LanguageContext.Provider value={initialState}>
        {children}
      </LanguageContext.Provider>
    );
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

/**
 * Hook to access language context
 *
 * @throws {Error} If used outside of LanguageProvider
 *
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const { language, setLanguage, isRTL } = useLanguage();
 *
 *   return (
 *     <div>
 *       Current language: {language}
 *       <button onClick={() => setLanguage('fr')}>Switch to French</button>
 *     </div>
 *   );
 * };
 * ```
 */
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);

  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }

  return context;
};
