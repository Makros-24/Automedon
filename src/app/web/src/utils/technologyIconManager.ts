import React from 'react';
import { getIconComponent } from './iconMapper';
import { type ImageData, type TechnologyWithIcon } from '@/types';

/**
 * Technology Icon Manager
 * 
 * Provides utilities for handling technology icons with base64/URL support,
 * following the same pattern as project images (base64 prioritized over URL).
 */

/**
 * Extract icon source from technology icon data
 * Prioritizes base64 over URL, returns string for Lucide icon names
 */
export function getTechnologyIcon(iconData: ImageData | string | null | undefined): string {
  if (!iconData) return '';
  
  if (typeof iconData === 'string') {
    return iconData; // Lucide icon name or string
  }
  
  if (typeof iconData === 'object') {
    // Prioritize base64 over URL
    if (iconData.base64) return iconData.base64;
    if (iconData.url) return iconData.url;
  }
  
  return '';
}

/**
 * Create React element for technology icon
 * Handles base64 images, URLs, and Lucide icons
 */
export function getTechnologyIconElement(
  iconData: ImageData | string | null | undefined,
  techName: string,
  className: string = 'w-4 h-4'
): React.ReactElement {
  const iconSource = getTechnologyIcon(iconData);
  
  // If it's a base64 image or URL
  if (iconSource.startsWith('data:') || iconSource.startsWith('http')) {
    return React.createElement('img', {
      src: iconSource,
      alt: `${techName} icon`,
      className: `${className} transition-all duration-300 ease-out`,
      loading: 'lazy' as const
    });
  }
  
  // If it's a Lucide icon name or fallback
  const IconComponent = getIconComponent(iconSource);
  return React.createElement(IconComponent, { 
    className: `${className} text-gray-400 hover:text-foreground transition-colors duration-300 ease-out`
  });
}

/**
 * Validate technology icon data
 * Ensures icon data is in correct format and accessible
 */
export function validateTechnologyIcon(iconData: ImageData | string | null | undefined): boolean {
  if (!iconData) {
    return false;
  }
  
  if (typeof iconData === 'string') {
    return iconData.length > 0;
  }
  
  if (typeof iconData === 'object' && iconData !== null) {
    // Check if it's an empty object
    if (!iconData.base64 && !iconData.url) {
      return false;
    }
    
    // Check if it has valid base64 or URL
    let hasValidBase64 = false;
    let hasValidUrl = false;
    
    if (iconData.base64) {
      hasValidBase64 = iconData.base64.startsWith('data:');
    }
    
    if (iconData.url) {
      hasValidUrl = iconData.url.startsWith('http') || iconData.url.startsWith('/');
    }
    
    return hasValidBase64 || hasValidUrl;
  }
  
  return false;
}

/**
 * Process skills array with icon elements
 * Converts skill objects to include rendered icon elements
 */
export interface ProcessedSkill {
  name: string;
  iconElement: React.ReactElement;
}

export function processSkillsWithIcons(
  skills: (string | TechnologyWithIcon)[],
  className: string = 'w-4 h-4'
): ProcessedSkill[] {
  return skills.map(skill => {
    if (typeof skill === 'string') {
      return {
        name: skill,
        iconElement: getTechnologyIconElement(null, skill, className)
      };
    }
    
    return {
      name: skill.name,
      iconElement: getTechnologyIconElement(skill.icon, skill.name, className)
    };
  });
}

/**
 * Process project technologies with icons
 * Handles both object format and legacy string arrays
 */
export interface ProcessedTechnology {
  name: string;
  iconElement: React.ReactElement;
}

export function processProjectTechnologies(
  technologies: (string | TechnologyWithIcon)[],
  className: string = 'w-4 h-4'
): ProcessedTechnology[] {
  return technologies.map(tech => {
    if (typeof tech === 'string') {
      return {
        name: tech,
        iconElement: getTechnologyIconElement(null, tech, className)
      };
    }
    
    return {
      name: tech.name,
      iconElement: getTechnologyIconElement(tech.icon, tech.name, className)
    };
  });
}