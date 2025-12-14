'use client';

import * as React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

/**
 * Language Switcher Component
 *
 * Provides a dropdown menu for switching between dynamically discovered languages
 * Displays country flags and native language names for better UX
 *
 * Supports dynamic locale detection - new languages can be added by creating
 * a new locale directory in portfolio-data/ with portfolio.json and locale.json
 *
 * @example
 * ```tsx
 * <LanguageSwitcher />
 * ```
 */
export function LanguageSwitcher() {
  const { language, setLanguage, availableLocales, isLoading } = useLanguage();

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
  };

  // Find current locale metadata
  const currentLocale = availableLocales.find(l => l.code === language);

  // Show loading state while fetching locales
  if (isLoading || !currentLocale) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="rounded-full w-10 h-10 p-0"
        disabled
        aria-label="Loading languages"
      >
        <Globe className="h-4 w-4 animate-pulse" />
        <span className="sr-only">Loading languages...</span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="rounded-full w-10 h-10 p-0"
          aria-label="Change language"
          title={`Current language: ${currentLocale.nativeName}`}
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
        {availableLocales.map((locale) => (
          <DropdownMenuItem
            key={locale.code}
            onClick={() => handleLanguageChange(locale.code)}
            className={`flex items-center gap-3 cursor-pointer py-3 px-4 transition-all duration-300 ${
              language === locale.code
                ? 'bg-white/20 dark:bg-white/10 text-foreground'
                : 'hover:bg-white/10 dark:hover:bg-white/5 text-foreground/80 hover:text-foreground'
            }`}
          >
            <span className="text-xl" role="img" aria-label={locale.name}>
              {locale.flag}
            </span>
            <span className="flex-1 font-medium">{locale.nativeName}</span>
            {language === locale.code && (
              <span className="text-sm text-blue-400 font-bold">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
