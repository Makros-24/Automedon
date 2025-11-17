'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { UITranslations } from '@/types';

// Import all translation files
import enTranslations from '@/locales/en/common.json';
import frTranslations from '@/locales/fr/common.json';
import deTranslations from '@/locales/de/common.json';
import arTranslations from '@/locales/ar/common.json';

// Type-safe translations map
const translations: Record<string, UITranslations> = {
  en: enTranslations,
  fr: frTranslations,
  de: deTranslations,
  ar: arTranslations,
};

/**
 * Custom hook for accessing UI translations
 *
 * Provides a simple `t()` function to access translated strings
 * with dot notation support for nested keys
 *
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const { t } = useTranslation();
 *
 *   return (
 *     <div>
 *       <h1>{t('navigation.work')}</h1>
 *       <button>{t('buttons.viewWork')}</button>
 *     </div>
 *   );
 * };
 * ```
 */
export function useTranslation() {
  const { language } = useLanguage();

  /**
   * Translation function with dot notation support
   *
   * @param key - Translation key using dot notation (e.g., 'navigation.work')
   * @returns Translated string or the key itself if translation not found
   */
  const t = (key: string): string => {
    const keys = key.split('.');
    const currentTranslations = translations[language] || translations.en;

    let result: any = currentTranslations;

    for (const k of keys) {
      if (result && typeof result === 'object' && k in result) {
        result = result[k as keyof typeof result];
      } else {
        // Return key if translation not found (fallback)
        console.warn(`Translation not found for key: ${key} in language: ${language}`);
        return key;
      }
    }

    // If final result is not a string, return the key
    if (typeof result !== 'string') {
      console.warn(`Translation key ${key} does not resolve to a string`);
      return key;
    }

    return result;
  };

  return {
    t,
    language,
    translations: translations[language] || translations.en,
  };
}

/**
 * Helper function to get a specific translation namespace
 *
 * @example
 * ```tsx
 * const { navigation } = useTranslationNamespace('navigation');
 * console.log(navigation.work); // "Work" or "Travail" depending on language
 * ```
 */
export function useTranslationNamespace<K extends keyof UITranslations>(
  namespace: K
): UITranslations[K] {
  const { language } = useLanguage();
  const currentTranslations = translations[language] || translations.en;
  return currentTranslations[namespace];
}
