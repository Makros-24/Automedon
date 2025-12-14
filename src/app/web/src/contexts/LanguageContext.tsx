'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { Language, LocaleMetadata, LanguageContextType } from '@/types';

const initialState: LanguageContextType = {
  language: 'en',
  setLanguage: () => null,
  isRTL: false,
  availableLocales: [],
  defaultLocale: 'en',
  isLoading: true,
};

const LanguageContext = createContext<LanguageContextType>(initialState);

export interface LanguageProviderProps {
  children: ReactNode;
  defaultLanguage?: Language;
  enableLanguageDetection?: boolean;
}

/**
 * Detects the user's preferred language from browser settings
 * Uses available locales for detection
 */
const detectBrowserLanguage = (availableLocales: LocaleMetadata[], defaultLocale: string): Language => {
  if (typeof window === 'undefined' || availableLocales.length === 0) {
    return defaultLocale;
  }

  const browserLang = navigator.language.toLowerCase();

  // Try exact match first (e.g., 'en-US' matches 'en-us')
  const exactMatch = availableLocales.find(
    locale => locale.code.toLowerCase() === browserLang
  );
  if (exactMatch) return exactMatch.code;

  // Try language code match (e.g., 'en-US' matches 'en')
  const langCode = browserLang.split('-')[0];
  const codeMatch = availableLocales.find(
    locale => locale.code.toLowerCase() === langCode
  );
  if (codeMatch) return codeMatch.code;

  // Fall back to default locale
  return defaultLocale;
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
  const [availableLocales, setAvailableLocales] = useState<LocaleMetadata[]>([]);
  const [defaultLocale, setDefaultLocale] = useState<string>(defaultLanguage);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Fetch available locales on mount
  useEffect(() => {
    const fetchLocales = async () => {
      try {
        const response = await fetch('/api/locales');
        if (!response.ok) {
          throw new Error(`Failed to fetch locales: ${response.status}`);
        }

        const data = await response.json();
        setAvailableLocales(data.locales || []);
        setDefaultLocale(data.defaultLocale || 'en');

        // Initialize language selection
        if (typeof window === 'undefined') return;

        // Check localStorage first
        const savedLanguage = localStorage.getItem('language');
        const isValidSaved = savedLanguage &&
          data.locales.some((l: LocaleMetadata) => l.code === savedLanguage);

        if (isValidSaved) {
          setLanguageState(savedLanguage);
        } else if (enableLanguageDetection) {
          // Auto-detect browser language if no saved preference
          const detectedLang = detectBrowserLanguage(data.locales, data.defaultLocale);
          setLanguageState(detectedLang);
          localStorage.setItem('language', detectedLang);
        } else {
          // Use default locale
          setLanguageState(data.defaultLocale);
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch locales:', error);

        // Fallback to English-only mode on error
        setAvailableLocales([{
          code: 'en',
          name: 'English',
          nativeName: 'English',
          flag: '🇬🇧',
          isRTL: false,
        }]);
        setDefaultLocale('en');
        setLanguageState('en');
        setIsLoading(false);
      } finally {
        setMounted(true);
      }
    };

    fetchLocales();
  }, [defaultLanguage, enableLanguageDetection]);

  // Apply language to document attributes
  useEffect(() => {
    if (typeof window === 'undefined' || !mounted || availableLocales.length === 0) return;

    const root = window.document.documentElement;
    const currentLocale = availableLocales.find(l => l.code === language);

    // Set lang attribute
    root.lang = language;

    // Set dir attribute for RTL support
    root.dir = currentLocale?.isRTL ? 'rtl' : 'ltr';

    // Add language class for CSS targeting (remove old classes)
    const langClasses = availableLocales.map(l => `lang-${l.code}`);
    root.classList.remove(...langClasses);
    root.classList.add(`lang-${language}`);
  }, [language, mounted, availableLocales]);

  const setLanguage = (newLanguage: Language) => {
    // Validate against available locales
    const isValid = availableLocales.some(l => l.code === newLanguage);

    if (!isValid) {
      console.warn(`Invalid language: ${newLanguage}. Falling back to ${defaultLocale}.`);
      newLanguage = defaultLocale;
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('language', newLanguage);
    }

    setLanguageState(newLanguage);
  };

  // Get current locale metadata for RTL detection
  const currentLocale = availableLocales.find(l => l.code === language);

  const value: LanguageContextType = {
    language,
    setLanguage,
    isRTL: currentLocale?.isRTL || false,
    availableLocales,
    defaultLocale,
    isLoading,
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
