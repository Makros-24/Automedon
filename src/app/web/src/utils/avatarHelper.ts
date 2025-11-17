import { type ImageData } from '@/types';

/**
 * Get the avatar image source from ImageData object or string URL
 * Supports both base64 encoded images and external URLs
 *
 * @param avatar - Avatar data (ImageData object or string URL)
 * @param fallbackUrl - Optional fallback URL if avatar is not provided
 * @returns Image source URL or base64 string
 */
export function getAvatarSource(
  avatar: ImageData | string | null | undefined,
  fallbackUrl?: string
): string {
  // Handle null/undefined
  if (!avatar) {
    return fallbackUrl || '';
  }

  // Handle string URLs (legacy format)
  if (typeof avatar === 'string') {
    return avatar;
  }

  // Handle ImageData object - prioritize base64 over URL
  if (avatar.base64) {
    return avatar.base64;
  }

  if (avatar.url) {
    return avatar.url;
  }

  // Fallback
  return fallbackUrl || '';
}

/**
 * Validate avatar data and return a safe source
 *
 * @param avatar - Avatar data to validate
 * @param fallbackUrl - Fallback URL for invalid data
 * @returns Validated image source
 */
export function validateAvatarSource(
  avatar: ImageData | string | null | undefined,
  fallbackUrl?: string
): string {
  const source = getAvatarSource(avatar, fallbackUrl);

  // Basic validation - check if it's a valid URL or base64
  if (!source) {
    return fallbackUrl || '';
  }

  // Check for base64 format
  if (source.startsWith('data:image/')) {
    return source;
  }

  // Check for valid URL format
  try {
    new URL(source);
    return source;
  } catch {
    // If URL parsing fails, return fallback
    return fallbackUrl || '';
  }
}
