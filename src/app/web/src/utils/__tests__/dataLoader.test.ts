import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { loadPortfolioData, getImageSource, validatePortfolioData } from '../dataLoader';
import type { PortfolioData } from '@/types';

// Mock fetch globally
global.fetch = jest.fn();

describe('Data Loader', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Clear environment variables
    delete process.env.PORTFOLIO_CONFIG_PATH;
  });

  describe('loadPortfolioData', () => {
    it('should load portfolio data from environment variable path', async () => {
      const mockData: PortfolioData = {
        personalInfo: {
          name: 'Test User',
          title: 'Test Developer',
          description: 'Test description'
        },
        projects: [],
        skillCategories: [],
        achievements: [],
        contactInfo: {
          email: 'test@example.com',
          linkedin: 'linkedin.com/in/test',
          github: 'github.com/test',
          twitter: 'twitter.com/test'
        }
      };

      process.env.PORTFOLIO_CONFIG_PATH = '/path/to/portfolio.json';
      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      } as Response);

      const result = await loadPortfolioData();
      expect(result).toEqual(mockData);
      expect(fetch).toHaveBeenCalledWith('/path/to/portfolio.json');
    });

    it('should throw error when environment variable is not set', async () => {
      await expect(loadPortfolioData()).rejects.toThrow('PORTFOLIO_CONFIG_PATH environment variable is not set');
    });

    it('should throw error when fetch fails', async () => {
      process.env.PORTFOLIO_CONFIG_PATH = '/path/to/portfolio.json';
      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      } as Response);

      await expect(loadPortfolioData()).rejects.toThrow('Failed to load portfolio data: 404 Not Found');
    });

    it('should throw error when JSON parsing fails', async () => {
      process.env.PORTFOLIO_CONFIG_PATH = '/path/to/portfolio.json';
      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: true,
        json: async () => { throw new Error('Invalid JSON'); },
      } as Response);

      await expect(loadPortfolioData()).rejects.toThrow('Failed to parse portfolio data');
    });
  });

  describe('getImageSource', () => {
    it('should prioritize base64 over URL when both are provided', () => {
      const imageData = {
        base64: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAA==',
        url: 'https://example.com/image.jpg'
      };

      const result = getImageSource(imageData);
      expect(result).toBe(imageData.base64);
    });

    it('should return URL when base64 is not provided', () => {
      const imageData = {
        url: 'https://example.com/image.jpg'
      };

      const result = getImageSource(imageData);
      expect(result).toBe(imageData.url);
    });

    it('should return base64 when URL is not provided', () => {
      const imageData = {
        base64: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAA=='
      };

      const result = getImageSource(imageData);
      expect(result).toBe(imageData.base64);
    });

    it('should return empty string when neither base64 nor URL is provided', () => {
      const imageData = {};

      const result = getImageSource(imageData);
      expect(result).toBe('');
    });

    it('should handle string input (legacy support)', () => {
      const result = getImageSource('https://example.com/image.jpg');
      expect(result).toBe('https://example.com/image.jpg');
    });
  });

  describe('validatePortfolioData', () => {
    const validData: PortfolioData = {
      personalInfo: {
        name: 'Test User',
        title: 'Test Developer',
        description: 'Test description'
      },
      projects: [
        {
          id: 1,
          title: 'Test Project',
          company: 'Test Company',
          role: 'Developer',
          description: 'Test project description',
          image: { url: 'https://example.com/image.jpg' },
          technologies: ['React', 'TypeScript'],
          links: {
            live: '#',
            github: '#'
          }
        }
      ],
      skillCategories: [
        {
          name: 'Frontend',
          icon: 'Monitor',
          skills: ['React', 'TypeScript']
        }
      ],
      achievements: [
        {
          icon: 'Users',
          number: '50+',
          title: 'Projects',
          description: 'Delivered'
        }
      ],
      contactInfo: {
        email: 'test@example.com',
        linkedin: 'linkedin.com/in/test',
        github: 'github.com/test',
        twitter: 'twitter.com/test'
      }
    };

    it('should return true for valid portfolio data', () => {
      expect(validatePortfolioData(validData)).toBe(true);
    });

    it('should return false when personalInfo is missing', () => {
      const invalidData = { ...validData };
      delete invalidData.personalInfo;
      expect(validatePortfolioData(invalidData)).toBe(false);
    });

    it('should return false when required personalInfo fields are missing', () => {
      const invalidData = {
        ...validData,
        personalInfo: { name: 'Test' } // missing title and description
      };
      expect(validatePortfolioData(invalidData as PortfolioData)).toBe(false);
    });

    it('should return false when projects array is invalid', () => {
      const invalidData = {
        ...validData,
        projects: 'not an array'
      };
      expect(validatePortfolioData(invalidData as any)).toBe(false);
    });

    it('should return false when project structure is invalid', () => {
      const invalidData = {
        ...validData,
        projects: [
          {
            id: 1,
            title: 'Test'
            // missing required fields
          }
        ]
      };
      expect(validatePortfolioData(invalidData as any)).toBe(false);
    });

    it('should return false when skillCategories array is invalid', () => {
      const invalidData = {
        ...validData,
        skillCategories: null
      };
      expect(validatePortfolioData(invalidData as any)).toBe(false);
    });

    it('should return false when achievements array is invalid', () => {
      const invalidData = {
        ...validData,
        achievements: 'invalid'
      };
      expect(validatePortfolioData(invalidData as any)).toBe(false);
    });

    it('should return false when contactInfo is missing required fields', () => {
      const invalidData = {
        ...validData,
        contactInfo: { email: 'test@example.com' } // missing other fields
      };
      expect(validatePortfolioData(invalidData as any)).toBe(false);
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      process.env.PORTFOLIO_CONFIG_PATH = '/path/to/portfolio.json';
      (fetch as jest.MockedFunction<typeof fetch>).mockRejectedValueOnce(new Error('Network error'));

      await expect(loadPortfolioData()).rejects.toThrow('Network error occurred while loading portfolio data');
    });

    it('should provide helpful error messages for validation failures', async () => {
      process.env.PORTFOLIO_CONFIG_PATH = '/path/to/portfolio.json';
      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ invalid: 'data' }),
      } as Response);

      await expect(loadPortfolioData()).rejects.toThrow('Invalid portfolio data structure');
    });
  });

  describe('Performance', () => {
    it('should handle large base64 images efficiently', () => {
      const largeBase64 = 'data:image/jpeg;base64,' + 'A'.repeat(100000);
      const imageData = {
        base64: largeBase64,
        url: 'https://example.com/image.jpg'
      };

      const start = performance.now();
      const result = getImageSource(imageData);
      const end = performance.now();

      expect(result).toBe(largeBase64);
      expect(end - start).toBeLessThan(10); // Should be very fast
    });
  });
});