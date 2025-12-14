import { promises as fs } from 'fs';
import path from 'path';

/**
 * Metadata for a single locale
 */
export interface LocaleMetadata {
  code: string;           // Language code: 'en', 'fr', etc.
  name: string;           // English name: 'English', 'French'
  nativeName: string;     // Native name: 'English', 'Français'
  flag: string;           // Flag emoji: '🇬🇧', '🇫🇷'
  isRTL: boolean;         // Right-to-left layout support
}

/**
 * Default metadata for known locales
 * Used as fallback when locale.json doesn't exist
 */
const DEFAULT_LOCALE_METADATA: Record<string, Omit<LocaleMetadata, 'code'>> = {
  en: {
    name: 'English',
    nativeName: 'English',
    flag: '🇬🇧',
    isRTL: false,
  },
  fr: {
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    isRTL: false,
  },
  de: {
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    isRTL: false,
  },
  ar: {
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇸🇦',
    isRTL: true,
  },
  es: {
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    isRTL: false,
  },
  it: {
    name: 'Italian',
    nativeName: 'Italiano',
    flag: '🇮🇹',
    isRTL: false,
  },
  pt: {
    name: 'Portuguese',
    nativeName: 'Português',
    flag: '🇵🇹',
    isRTL: false,
  },
  zh: {
    name: 'Chinese',
    nativeName: '中文',
    flag: '🇨🇳',
    isRTL: false,
  },
  ja: {
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    isRTL: false,
  },
};

/**
 * Generic fallback for unknown locales
 */
const GENERIC_LOCALE_FALLBACK: Omit<LocaleMetadata, 'code'> = {
  name: 'Unknown',
  nativeName: 'Unknown',
  flag: '🌐',
  isRTL: false,
};

/**
 * Module-level cache for discovered locales
 * Populated once on first call to discoverLocales()
 */
let localeCache: LocaleMetadata[] | null = null;
let defaultLocaleCache: string = 'en';

/**
 * Reads locale metadata from locale.json file
 * Falls back to defaults if file doesn't exist or is invalid
 */
async function readLocaleMetadata(
  localePath: string,
  localeCode: string
): Promise<Omit<LocaleMetadata, 'code'>> {
  const metadataPath = path.join(localePath, 'locale.json');

  try {
    await fs.access(metadataPath);
    const content = await fs.readFile(metadataPath, 'utf8');
    const metadata = JSON.parse(content);

    // Validate required fields
    if (
      typeof metadata.name === 'string' &&
      typeof metadata.nativeName === 'string' &&
      typeof metadata.flag === 'string' &&
      typeof metadata.isRTL === 'boolean'
    ) {
      return metadata;
    } else {
      console.warn(`Invalid locale.json format for ${localeCode}, using defaults`);
    }
  } catch (error) {
    // File doesn't exist or is invalid, use defaults
  }

  // Return default metadata for known locales, or generic fallback
  return DEFAULT_LOCALE_METADATA[localeCode] || GENERIC_LOCALE_FALLBACK;
}

/**
 * Checks if a directory contains a valid portfolio.json file
 */
async function hasPortfolioData(localePath: string): Promise<boolean> {
  const portfolioPath = path.join(localePath, 'portfolio.json');

  try {
    await fs.access(portfolioPath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Discovers available locales by scanning the portfolio-data directory
 *
 * Algorithm:
 * 1. Read portfolio-data directory
 * 2. Filter for subdirectories (exclude files and 'diagrams')
 * 3. Check each directory for portfolio.json
 * 4. Read locale.json metadata or use defaults
 * 5. Cache results in memory
 *
 * @returns Array of locale metadata sorted by code
 */
export async function discoverLocales(): Promise<LocaleMetadata[]> {
  // Return cached result if available
  if (localeCache !== null) {
    return localeCache;
  }

  const locales: LocaleMetadata[] = [];

  // Get portfolio data path from environment
  const configPath = process.env.PORTFOLIO_CONFIG_PATH || './portfolio-data';

  // Resolve absolute path
  let fullPath: string;
  if (path.isAbsolute(configPath)) {
    fullPath = configPath;
  } else {
    const projectRoot = path.resolve(process.cwd(), '../../..');
    fullPath = path.resolve(projectRoot, configPath);
  }

  try {
    // Read directory entries
    const entries = await fs.readdir(fullPath, { withFileTypes: true });

    // Filter for subdirectories (exclude 'diagrams' and hidden directories)
    const localeDirs = entries.filter(
      (entry) =>
        entry.isDirectory() &&
        !entry.name.startsWith('.') &&
        entry.name !== 'diagrams'
    );

    // Process each locale directory
    for (const dir of localeDirs) {
      const localePath = path.join(fullPath, dir.name);

      // Check if directory has portfolio.json
      if (await hasPortfolioData(localePath)) {
        const metadata = await readLocaleMetadata(localePath, dir.name);

        locales.push({
          code: dir.name,
          ...metadata,
        });
      } else {
        console.warn(
          `Skipping locale directory "${dir.name}": missing portfolio.json`
        );
      }
    }

    // Sort locales alphabetically by code
    locales.sort((a, b) => a.code.localeCompare(b.code));

    // Fallback to English-only if no locales found
    if (locales.length === 0) {
      console.warn(
        'No valid locales found, falling back to English-only mode'
      );
      locales.push({
        code: 'en',
        ...DEFAULT_LOCALE_METADATA.en,
      });
    }

    // Set default locale (prefer env var, then 'en', then first available)
    const envDefaultLocale = process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE;
    if (envDefaultLocale && locales.some((l) => l.code === envDefaultLocale)) {
      defaultLocaleCache = envDefaultLocale;
    } else if (locales.some((l) => l.code === 'en')) {
      defaultLocaleCache = 'en';
    } else {
      defaultLocaleCache = locales[0].code;
    }

    // Cache results
    localeCache = locales;

    console.log(
      `✅ Discovered ${locales.length} locale(s): ${locales.map((l) => l.code).join(', ')}`
    );
    console.log(`📌 Default locale: ${defaultLocaleCache}`);

    return locales;
  } catch (error) {
    console.error('Failed to discover locales:', error);

    // Fallback to English-only on error
    const fallbackLocale: LocaleMetadata = {
      code: 'en',
      ...DEFAULT_LOCALE_METADATA.en,
    };

    localeCache = [fallbackLocale];
    defaultLocaleCache = 'en';

    return [fallbackLocale];
  }
}

/**
 * Returns cached locales (fast, no I/O)
 * If locales haven't been discovered yet, returns empty array
 *
 * @returns Array of cached locale metadata
 */
export function getCachedLocales(): LocaleMetadata[] {
  return localeCache || [];
}

/**
 * Returns the default locale code
 * If locales haven't been discovered yet, returns 'en'
 *
 * @returns Default locale code
 */
export function getDefaultLocale(): string {
  return defaultLocaleCache;
}

/**
 * Checks if a locale code is valid (exists in discovered locales)
 *
 * @param locale - Locale code to validate
 * @returns true if locale is valid, false otherwise
 */
export function isValidLocale(locale: string): boolean {
  if (!localeCache) {
    return false;
  }

  return localeCache.some((l) => l.code === locale);
}

/**
 * Gets metadata for a specific locale
 *
 * @param locale - Locale code
 * @returns Locale metadata or null if not found
 */
export function getLocaleMetadata(locale: string): LocaleMetadata | null {
  if (!localeCache) {
    return null;
  }

  return localeCache.find((l) => l.code === locale) || null;
}

/**
 * Clears the locale cache (useful for testing or hot reload)
 * Next call to discoverLocales() will re-scan the filesystem
 */
export function clearLocaleCache(): void {
  localeCache = null;
  defaultLocaleCache = 'en';
}
