import { getAvatarSource, validateAvatarSource } from '../avatarHelper';
import type { ImageData } from '@/types';

describe('avatarHelper', () => {
  describe('getAvatarSource', () => {
    it('should return empty string for null/undefined', () => {
      expect(getAvatarSource(null)).toBe('');
      expect(getAvatarSource(undefined)).toBe('');
    });

    it('should return fallback URL for null/undefined when provided', () => {
      const fallback = 'https://example.com/fallback.jpg';
      expect(getAvatarSource(null, fallback)).toBe(fallback);
      expect(getAvatarSource(undefined, fallback)).toBe(fallback);
    });

    it('should handle string URLs (legacy format)', () => {
      const url = 'https://example.com/avatar.jpg';
      expect(getAvatarSource(url)).toBe(url);
    });

    it('should prioritize base64 over URL in ImageData object', () => {
      const imageData: ImageData = {
        base64: 'data:image/png;base64,iVBORw0KGgoAAAANS...',
        url: 'https://example.com/avatar.jpg'
      };
      expect(getAvatarSource(imageData)).toBe(imageData.base64);
    });

    it('should use URL when base64 is not provided', () => {
      const imageData: ImageData = {
        url: 'https://example.com/avatar.jpg'
      };
      expect(getAvatarSource(imageData)).toBe(imageData.url);
    });

    it('should return fallback when ImageData has neither base64 nor URL', () => {
      const imageData: ImageData = {};
      const fallback = 'https://example.com/fallback.jpg';
      expect(getAvatarSource(imageData, fallback)).toBe(fallback);
    });
  });

  describe('validateAvatarSource', () => {
    it('should validate and return base64 URLs', () => {
      const base64 = 'data:image/png;base64,iVBORw0KGgoAAAANS...';
      expect(validateAvatarSource(base64)).toBe(base64);
    });

    it('should validate and return valid URLs', () => {
      const url = 'https://example.com/avatar.jpg';
      expect(validateAvatarSource(url)).toBe(url);
    });

    it('should return fallback for invalid URLs', () => {
      const fallback = 'https://example.com/fallback.jpg';
      expect(validateAvatarSource('not-a-valid-url', fallback)).toBe(fallback);
    });

    it('should return empty string for invalid URLs without fallback', () => {
      expect(validateAvatarSource('not-a-valid-url')).toBe('');
    });

    it('should handle ImageData objects', () => {
      const imageData: ImageData = {
        url: 'https://example.com/avatar.jpg'
      };
      expect(validateAvatarSource(imageData)).toBe(imageData.url);
    });

    it('should return fallback for null/undefined', () => {
      const fallback = 'https://example.com/fallback.jpg';
      expect(validateAvatarSource(null, fallback)).toBe(fallback);
      expect(validateAvatarSource(undefined, fallback)).toBe(fallback);
    });
  });
});
