import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { 
  getTechnologyIcon, 
  getTechnologyIconElement, 
  validateTechnologyIcon,
  processSkillsWithIcons,
  processProjectTechnologies
} from '../technologyIconManager';

// Mock React and icon components
jest.mock('react', () => ({
  createElement: jest.fn((component, props) => ({ 
    type: component, 
    props: props || {},
    __mockElement: true
  })),
}));

describe('Technology Icon Manager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getTechnologyIcon', () => {
    it('should return base64 image when available', () => {
      const iconData = {
        base64: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjx0ZXh0PkpTPC90ZXh0Pjwvc3ZnPg==',
        url: 'https://example.com/js-icon.svg'
      };

      const result = getTechnologyIcon(iconData);
      expect(result).toBe(iconData.base64);
    });

    it('should return URL when base64 is not available', () => {
      const iconData = {
        url: 'https://example.com/react-icon.svg'
      };

      const result = getTechnologyIcon(iconData);
      expect(result).toBe(iconData.url);
    });

    it('should return empty string when neither base64 nor URL is available', () => {
      const iconData = {};

      const result = getTechnologyIcon(iconData);
      expect(result).toBe('');
    });

    it('should handle legacy string format (Lucide icon name)', () => {
      const result = getTechnologyIcon('Code');
      expect(result).toBe('Code');
    });

    it('should handle mixed data with priority to base64', () => {
      const iconData = {
        base64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        url: 'https://example.com/fallback.png',
        lucide: 'Code'
      };

      const result = getTechnologyIcon(iconData);
      expect(result).toBe(iconData.base64);
    });
  });

  describe('getTechnologyIconElement', () => {
    it('should create img element for base64 image', () => {
      const iconData = {
        base64: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjx0ZXh0PkpTPC90ZXh0Pjwvc3ZnPg=='
      };
      const techName = 'JavaScript';

      const result = getTechnologyIconElement(iconData, techName);
      
      expect(result).toEqual({
        type: 'img',
        props: {
          src: iconData.base64,
          alt: `${techName} icon`,
          className: 'w-4 h-4',
          loading: 'lazy'
        },
        __mockElement: true
      });
    });

    it('should create img element for URL', () => {
      const iconData = {
        url: 'https://example.com/react-icon.svg'
      };
      const techName = 'React';

      const result = getTechnologyIconElement(iconData, techName);
      
      expect(result).toEqual({
        type: 'img',
        props: {
          src: iconData.url,
          alt: `${techName} icon`,
          className: 'w-4 h-4',
          loading: 'lazy'
        },
        __mockElement: true
      });
    });

    it('should create Lucide icon element for string', () => {
      const React = require('react');
      const iconData = 'Code';
      const techName = 'TypeScript';

      const result = getTechnologyIconElement(iconData, techName);
      
      expect(React.createElement).toHaveBeenCalledWith(
        expect.any(Function), // Lucide icon component
        { className: 'w-4 h-4' }
      );
    });

    it('should handle fallback when no icon data is provided', () => {
      const React = require('react');
      const iconData = '';
      const techName = 'Unknown Tech';

      const result = getTechnologyIconElement(iconData, techName);
      
      expect(React.createElement).toHaveBeenCalledWith(
        expect.any(Function), // Default Code icon
        { className: 'w-4 h-4' }
      );
    });

    it('should apply custom className when provided', () => {
      const iconData = {
        base64: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjx0ZXh0PkpTPC90ZXh0Pjwvc3ZnPg=='
      };
      const techName = 'JavaScript';
      const customClass = 'w-6 h-6 custom-icon';

      const result = getTechnologyIconElement(iconData, techName, customClass);
      
      expect(result.props.className).toBe(customClass);
    });
  });

  describe('validateTechnologyIcon', () => {
    it('should return true for valid base64 icon', () => {
      const iconData = {
        base64: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjx0ZXh0PkpTPC90ZXh0Pjwvc3ZnPg=='
      };

      expect(validateTechnologyIcon(iconData)).toBe(true);
    });

    it('should return true for valid URL icon', () => {
      const iconData = {
        url: 'https://example.com/icon.svg'
      };

      expect(validateTechnologyIcon(iconData)).toBe(true);
    });

    it('should return true for valid string (Lucide icon)', () => {
      expect(validateTechnologyIcon('Code')).toBe(true);
    });

    it('should return false for empty object', () => {
      expect(validateTechnologyIcon({})).toBe(false);
    });

    it('should return false for null or undefined', () => {
      expect(validateTechnologyIcon(null)).toBe(false);
      expect(validateTechnologyIcon(undefined)).toBe(false);
    });

    it('should return false for invalid base64', () => {
      const iconData = {
        base64: 'invalid-base64-string'
      };

      expect(validateTechnologyIcon(iconData)).toBe(false);
    });

    it('should return false for invalid URL', () => {
      const iconData = {
        url: 'not-a-valid-url'
      };

      expect(validateTechnologyIcon(iconData)).toBe(false);
    });

    it('should return true for mixed valid data', () => {
      const iconData = {
        base64: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjx0ZXh0PkpTPC90ZXh0Pjwvc3ZnPg==',
        url: 'https://example.com/fallback.svg',
        lucide: 'Code'
      };

      expect(validateTechnologyIcon(iconData)).toBe(true);
    });
  });

  describe('processSkillsWithIcons', () => {
    it('should process array of skills with icons', () => {
      const skills = [
        {
          name: 'JavaScript',
          icon: {
            base64: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjx0ZXh0PkpTPC90ZXh0Pjwvc3ZnPg=='
          }
        },
        {
          name: 'TypeScript',
          icon: {
            url: 'https://example.com/ts-icon.svg'
          }
        },
        {
          name: 'React',
          icon: 'Zap'
        }
      ];

      const result = processSkillsWithIcons(skills);
      
      expect(result).toHaveLength(3);
      expect(result[0].name).toBe('JavaScript');
      expect(result[0].iconElement).toBeDefined();
      expect(result[1].name).toBe('TypeScript');
      expect(result[1].iconElement).toBeDefined();
      expect(result[2].name).toBe('React');
      expect(result[2].iconElement).toBeDefined();
    });

    it('should handle empty skills array', () => {
      const result = processSkillsWithIcons([]);
      expect(result).toEqual([]);
    });

    it('should handle skills without icons (fallback to default)', () => {
      const skills = [
        { name: 'Unknown Tech' }
      ];

      const result = processSkillsWithIcons(skills);
      
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Unknown Tech');
      expect(result[0].iconElement).toBeDefined();
    });
  });

  describe('processProjectTechnologies', () => {
    it('should process project technologies with icons', () => {
      const technologies = [
        {
          name: 'JavaScript',
          icon: {
            base64: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjx0ZXh0PkpTPC90ZXh0Pjwvc3ZnPg=='
          }
        },
        {
          name: 'React',
          icon: 'Zap'
        }
      ];

      const result = processProjectTechnologies(technologies);
      
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('JavaScript');
      expect(result[0].iconElement).toBeDefined();
      expect(result[1].name).toBe('React');
      expect(result[1].iconElement).toBeDefined();
    });

    it('should handle legacy string array format', () => {
      const technologies = ['JavaScript', 'React', 'TypeScript'];

      const result = processProjectTechnologies(technologies);
      
      expect(result).toHaveLength(3);
      expect(result[0].name).toBe('JavaScript');
      expect(result[0].iconElement).toBeDefined();
      expect(result[1].name).toBe('React');
      expect(result[1].iconElement).toBeDefined();
      expect(result[2].name).toBe('TypeScript');
      expect(result[2].iconElement).toBeDefined();
    });

    it('should handle mixed format (objects and strings)', () => {
      const technologies = [
        {
          name: 'JavaScript',
          icon: {
            base64: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjx0ZXh0PkpTPC90ZXh0Pjwvc3ZnPg=='
          }
        },
        'React',
        'TypeScript'
      ];

      const result = processProjectTechnologies(technologies);
      
      expect(result).toHaveLength(3);
      expect(result[0].name).toBe('JavaScript');
      expect(result[1].name).toBe('React');
      expect(result[2].name).toBe('TypeScript');
    });
  });

  describe('Performance and Edge Cases', () => {
    it('should handle large base64 strings efficiently', () => {
      const largeBase64 = 'data:image/svg+xml;base64,' + 'A'.repeat(10000);
      const iconData = { base64: largeBase64 };

      const start = performance.now();
      const result = getTechnologyIcon(iconData);
      const end = performance.now();

      expect(result).toBe(largeBase64);
      expect(end - start).toBeLessThan(10); // Should be very fast
    });

    it('should handle special characters in technology names', () => {
      const iconData = {
        url: 'https://example.com/icon.svg'
      };
      const techName = 'C++ & Assembly';

      const result = getTechnologyIconElement(iconData, techName);
      
      expect(result.props.alt).toBe('C++ & Assembly icon');
    });

    it('should handle very long technology names', () => {
      const iconData = {
        base64: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjx0ZXh0PkpTPC90ZXh0Pjwvc3ZnPg=='
      };
      const longTechName = 'Very Long Technology Name That Might Break Things';

      const result = getTechnologyIconElement(iconData, longTechName);
      
      expect(result.props.alt).toBe(`${longTechName} icon`);
    });

    it('should handle concurrent processing of multiple technologies', () => {
      const technologies = Array.from({ length: 100 }, (_, i) => ({
        name: `Technology ${i}`,
        icon: {
          base64: `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjx0ZXh0PlQke2l9PC90ZXh0Pjwvc3ZnPg==`
        }
      }));

      const start = performance.now();
      const result = processProjectTechnologies(technologies);
      const end = performance.now();

      expect(result).toHaveLength(100);
      expect(end - start).toBeLessThan(100); // Should handle 100 items quickly
    });
  });
});