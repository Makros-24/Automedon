import type { PortfolioData, ImageData, PersonalInfo, Project, SkillCategory, Achievement, ContactInfo, Language } from '@/types';

/**
 * Load portfolio data from API endpoint with language support
 *
 * @param language - Language code (en, fr, de, ar). Defaults to 'en'
 */
export async function loadPortfolioData(language: Language = 'en'): Promise<PortfolioData> {
  // Build API endpoint with language parameter
  const apiEndpoint = `/api/portfolio?lang=${language}`;

  try {
    const response = await fetch(apiEndpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': language,
        // Add cache-busting in development
        ...(process.env.NODE_ENV === 'development' && {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        })
      },
      // Add cache-busting parameter in development
      ...(process.env.NODE_ENV === 'development' && {
        cache: 'no-store'
      })
    });
    
    if (!response.ok) {
      // Try to get error details from response
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch {
        // Ignore JSON parsing errors for error responses
      }
      throw new Error(`Failed to load portfolio data: ${errorMessage}`);
    }

    let data: PortfolioData;
    try {
      data = await response.json();
    } catch (_parseError) {
      throw new Error('Failed to parse portfolio data: Invalid JSON format');
    }

    // Validate the data structure (additional client-side validation)
    if (!validatePortfolioData(data)) {
      throw new Error('Invalid portfolio data structure');
    }

    return data;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error occurred while loading portfolio data');
    }
    // Handle generic network errors
    if (error instanceof Error && error.message === 'Network error') {
      throw new Error('Network error occurred while loading portfolio data');
    }
    throw error;
  }
}

/**
 * Get image source with base64 prioritization over URL
 */
export function getImageSource(imageData: ImageData | string): string {
  // Handle legacy string format
  if (typeof imageData === 'string') {
    return imageData;
  }

  // Handle ImageData object format
  if (imageData.base64) {
    return imageData.base64;
  }

  if (imageData.url) {
    return imageData.url;
  }

  return '';
}

/**
 * Validate portfolio data structure
 */
export function validatePortfolioData(data: unknown): data is PortfolioData {
  if (!data || typeof data !== 'object') {
    return false;
  }

  const obj = data as Record<string, unknown>;

  // Validate personal info
  if (!validatePersonalInfo(obj.personalInfo)) {
    return false;
  }

  // Validate projects array
  if (!Array.isArray(obj.projects) || !obj.projects.every(validateProject)) {
    return false;
  }

  // Validate skill categories array
  if (!Array.isArray(obj.skillCategories) || !obj.skillCategories.every(validateSkillCategory)) {
    return false;
  }

  // Validate achievements array
  if (!Array.isArray(obj.achievements) || !obj.achievements.every(validateAchievement)) {
    return false;
  }

  // Validate contact info
  if (!validateContactInfo(obj.contactInfo)) {
    return false;
  }

  return true;
}

/**
 * Validate personal info structure
 */
function validatePersonalInfo(personalInfo: unknown): personalInfo is PersonalInfo {
  if (!personalInfo || typeof personalInfo !== 'object') return false;
  const obj = personalInfo as Record<string, unknown>;
  return typeof obj.name === 'string' &&
         typeof obj.title === 'string' &&
         typeof obj.description === 'string';
}

/**
 * Validate project structure
 */
function validateProject(project: unknown): project is Project {
  if (!project || typeof project !== 'object') return false;
  const obj = project as Record<string, unknown>;
  return typeof obj.id === 'number' &&
         typeof obj.title === 'string' &&
         typeof obj.company === 'string' &&
         typeof obj.role === 'string' &&
         typeof obj.description === 'string' &&
         (validateImageData(obj.image) || typeof obj.image === 'string') &&
         Array.isArray(obj.technologies) &&
         obj.technologies.every((tech: unknown) =>
           typeof tech === 'string' ||
           (typeof tech === 'object' && tech !== null && typeof (tech as Record<string, unknown>).name === 'string')
         ) &&
         !!obj.links &&
         typeof obj.links === 'object' &&
         obj.links !== null &&
         typeof (obj.links as Record<string, unknown>).live === 'string' &&
         typeof (obj.links as Record<string, unknown>).github === 'string';
}

/**
 * Validate image data structure
 */
function validateImageData(image: unknown): image is ImageData {
  if (!image || typeof image !== 'object') return false;
  const obj = image as Record<string, unknown>;
  return (typeof obj.base64 === 'string' || typeof obj.url === 'string');
}

/**
 * Validate skill category structure
 */
function validateSkillCategory(category: unknown): category is SkillCategory {
  if (!category || typeof category !== 'object') return false;
  const obj = category as Record<string, unknown>;
  return typeof obj.name === 'string' &&
         (typeof obj.icon === 'string' || typeof obj.icon === 'function') &&
         Array.isArray(obj.skills) &&
         obj.skills.every((skill: unknown) =>
           typeof skill === 'string' ||
           (typeof skill === 'object' && skill !== null && typeof (skill as Record<string, unknown>).name === 'string')
         );
}

/**
 * Validate achievement structure
 */
function validateAchievement(achievement: unknown): achievement is Achievement {
  if (!achievement || typeof achievement !== 'object') return false;
  const obj = achievement as Record<string, unknown>;
  return (typeof obj.icon === 'string' || obj.icon !== undefined) && // ReactNode or string
         typeof obj.number === 'string' &&
         typeof obj.title === 'string' &&
         typeof obj.description === 'string';
}

/**
 * Validate contact info structure
 */
function validateContactInfo(contactInfo: unknown): contactInfo is ContactInfo {
  if (!contactInfo || typeof contactInfo !== 'object') return false;
  const obj = contactInfo as Record<string, unknown>;
  return typeof obj.email === 'string' &&
         typeof obj.linkedin === 'string' &&
         typeof obj.github === 'string' &&
         typeof obj.twitter === 'string';
}

/**
 * Cache for loaded portfolio data to avoid repeated network calls
 * Organized by language for multi-language support
 */
const portfolioDataCache: Map<Language, PortfolioData> = new Map();

/**
 * Get portfolio data with caching and language support
 *
 * @param language - Language code (en, fr, de, ar). Defaults to 'en'
 * @param useCache - Whether to use cached data. Defaults to true
 */
export async function getPortfolioData(
  language: Language = 'en',
  useCache: boolean = true
): Promise<PortfolioData> {
  // In development, always bypass cache for better DX
  const shouldUseCache = useCache && process.env.NODE_ENV !== 'development';

  if (shouldUseCache && portfolioDataCache.has(language)) {
    return portfolioDataCache.get(language)!;
  }

  const data = await loadPortfolioData(language);
  portfolioDataCache.set(language, data);
  return data;
}

/**
 * Clear the portfolio data cache for a specific language or all languages
 *
 * @param language - Optional language to clear. If not provided, clears all
 */
export function clearPortfolioDataCache(language?: Language): void {
  if (language) {
    portfolioDataCache.delete(language);
  } else {
    portfolioDataCache.clear();
  }
}

/**
 * Get formatted image URL for optimization
 */
export function getOptimizedImageUrl(imageData: ImageData | string, width?: number, height?: number): string {
  const src = getImageSource(imageData);
  
  // If it's a base64 string, return as-is
  if (src.startsWith('data:')) {
    return src;
  }

  // For URLs, add optimization parameters if supported by the service
  if (src.includes('unsplash.com') && (width || height)) {
    const url = new URL(src);
    if (width) url.searchParams.set('w', width.toString());
    if (height) url.searchParams.set('h', height.toString());
    url.searchParams.set('fit', 'crop');
    return url.toString();
  }

  return src;
}