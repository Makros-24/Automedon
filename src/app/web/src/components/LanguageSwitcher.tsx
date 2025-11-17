'use client';

import * as React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Language configuration with flags and native names
const languages = {
  en: { name: 'English', nativeName: 'English', flag: '🇬🇧' },
  fr: { name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  de: { name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  ar: { name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
} as const;

/**
 * Language Switcher Component
 *
 * Provides a dropdown menu for switching between supported languages
 * Displays country flags and native language names for better UX
 *
 * @example
 * ```tsx
 * <LanguageSwitcher />
 * ```
 */
export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
  };

  const currentLanguageConfig = languages[language];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="rounded-full w-10 h-10 p-0"
          aria-label="Change language"
          title={`Current language: ${currentLanguageConfig.nativeName}`}
        >
          <Globe className="h-4 w-4" />
          <span className="sr-only">Change language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="min-w-[180px] glass-strong border border-white/20 dark:border-white/10 backdrop-blur-xl shadow-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.08))',
        }}
      >
        {(Object.entries(languages) as [Language, typeof languages[Language]][]).map(
          ([code, config]) => (
            <DropdownMenuItem
              key={code}
              onClick={() => handleLanguageChange(code)}
              className={`flex items-center gap-3 cursor-pointer py-3 px-4 transition-all duration-300 ${
                language === code
                  ? 'bg-white/20 dark:bg-white/10 text-foreground'
                  : 'hover:bg-white/10 dark:hover:bg-white/5 text-foreground/80 hover:text-foreground'
              }`}
            >
              <span className="text-xl" role="img" aria-label={config.name}>
                {config.flag}
              </span>
              <span className="flex-1 font-medium">{config.nativeName}</span>
              {language === code && (
                <span className="text-sm text-blue-400 font-bold">✓</span>
              )}
            </DropdownMenuItem>
          )
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
