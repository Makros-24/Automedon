import type { PortfolioData, ImageData, PersonalInfo, Project, SkillCategory, Achievement, ContactInfo } from '@/types';

/**
 * Load portfolio data from API endpoint
 */
export async function loadPortfolioData(): Promise<PortfolioData> {
  const apiEndpoint = '/api/portfolio';
  
  try {
    const response = await fetch(apiEndpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
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
    } catch (parseError) {
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
export function validatePortfolioData(data: any): data is PortfolioData {
  if (!data || typeof data !== 'object') {
    return false;
  }

  // Validate personal info
  if (!validatePersonalInfo(data.personalInfo)) {
    return false;
  }

  // Validate projects array
  if (!Array.isArray(data.projects) || !data.projects.every(validateProject)) {
    return false;
  }

  // Validate skill categories array
  if (!Array.isArray(data.skillCategories) || !data.skillCategories.every(validateSkillCategory)) {
    return false;
  }

  // Validate achievements array
  if (!Array.isArray(data.achievements) || !data.achievements.every(validateAchievement)) {
    return false;
  }

  // Validate contact info
  if (!validateContactInfo(data.contactInfo)) {
    return false;
  }

  return true;
}

/**
 * Validate personal info structure
 */
function validatePersonalInfo(personalInfo: any): personalInfo is PersonalInfo {
  return personalInfo &&
         typeof personalInfo === 'object' &&
         typeof personalInfo.name === 'string' &&
         typeof personalInfo.title === 'string' &&
         typeof personalInfo.description === 'string';
}

/**
 * Validate project structure
 */
function validateProject(project: any): project is Project {
  return project &&
         typeof project === 'object' &&
         typeof project.id === 'number' &&
         typeof project.title === 'string' &&
         typeof project.company === 'string' &&
         typeof project.role === 'string' &&
         typeof project.description === 'string' &&
         (validateImageData(project.image) || typeof project.image === 'string') &&
         Array.isArray(project.technologies) &&
         project.technologies.every((tech: any) => 
           typeof tech === 'string' || 
           (typeof tech === 'object' && typeof tech.name === 'string')
         ) &&
         project.links &&
         typeof project.links.live === 'string' &&
         typeof project.links.github === 'string';
}

/**
 * Validate image data structure
 */
function validateImageData(image: any): image is ImageData {
  return image &&
         typeof image === 'object' &&
         (typeof image.base64 === 'string' || typeof image.url === 'string');
}

/**
 * Validate skill category structure
 */
function validateSkillCategory(category: any): category is SkillCategory {
  return category &&
         typeof category === 'object' &&
         typeof category.name === 'string' &&
         (typeof category.icon === 'string' || typeof category.icon === 'function') &&
         Array.isArray(category.skills) &&
         category.skills.every((skill: any) => 
           typeof skill === 'string' || 
           (typeof skill === 'object' && typeof skill.name === 'string')
         );
}

/**
 * Validate achievement structure
 */
function validateAchievement(achievement: any): achievement is Achievement {
  return achievement &&
         typeof achievement === 'object' &&
         (typeof achievement.icon === 'string' || achievement.icon) && // ReactNode or string
         typeof achievement.number === 'string' &&
         typeof achievement.title === 'string' &&
         typeof achievement.description === 'string';
}

/**
 * Validate contact info structure
 */
function validateContactInfo(contactInfo: any): contactInfo is ContactInfo {
  return contactInfo &&
         typeof contactInfo === 'object' &&
         typeof contactInfo.email === 'string' &&
         typeof contactInfo.linkedin === 'string' &&
         typeof contactInfo.github === 'string' &&
         typeof contactInfo.twitter === 'string';
}

/**
 * Cache for loaded portfolio data to avoid repeated network calls
 */
let portfolioDataCache: PortfolioData | null = null;

/**
 * Get portfolio data with caching
 */
export async function getPortfolioData(useCache: boolean = true): Promise<PortfolioData> {
  // In development, always bypass cache for better DX
  const shouldUseCache = useCache && process.env.NODE_ENV !== 'development';
  
  if (shouldUseCache && portfolioDataCache) {
    return portfolioDataCache;
  }

  const data = await loadPortfolioData();
  portfolioDataCache = data;
  return data;
}

/**
 * Clear the portfolio data cache
 */
export function clearPortfolioDataCache(): void {
  portfolioDataCache = null;
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