import React from 'react';
import { 
  Monitor, 
  Server, 
  Cloud, 
  Database, 
  Smartphone, 
  Settings, 
  Users, 
  Globe, 
  Award, 
  Code,
  FileCode, 
  Layers, 
  Package, 
  Paintbrush, 
  Zap, 
  Cpu, 
  Terminal, 
  GitBranch, 
  Wrench, 
  Box,
  Mail,
  Github,
  Linkedin,
  MapPin,
  Phone,
  Send,
  Twitter,
  type LucideIcon
} from 'lucide-react';
import { type SkillCategory as SkillCategoryType, type Achievement as AchievementType, type ContactInfo as ContactInfoType } from '@/types';

// Icon name to Lucide icon mapping
const iconMap: Record<string, LucideIcon> = {
  // Categories
  'Monitor': Monitor,
  'Server': Server,
  'Cloud': Cloud,
  'Database': Database,
  'Smartphone': Smartphone,
  'Settings': Settings,
  
  // Achievements
  'Users': Users,
  'Globe': Globe,
  'Award': Award,
  'Code': Code,
  
  // Technical skills
  'FileCode': FileCode,
  'Layers': Layers,
  'Package': Package,
  'Paintbrush': Paintbrush,
  'Zap': Zap,
  'Cpu': Cpu,
  'Terminal': Terminal,
  'GitBranch': GitBranch,
  'Wrench': Wrench,
  'Box': Box,

  // Contact
  'Mail': Mail,
  'Github': Github,
  'Linkedin': Linkedin,
  'MapPin': MapPin,
  'Phone': Phone,
  'Send': Send,
  'Twitter': Twitter,
};

/**
 * Convert icon name string to Lucide icon component
 */
export function getIconComponent(iconName: string | LucideIcon): LucideIcon {
  // If it's already a function (LucideIcon), return it
  if (typeof iconName === 'function') {
    return iconName;
  }
  
  // If it's a string, look up the icon
  if (typeof iconName === 'string') {
    return iconMap[iconName] || Code; // Fallback to Code icon
  }
  
  // Default fallback
  return Code;
}

/**
 * Convert skill category with string icon to component-based icon
 */
export function processSkillCategory(category: SkillCategoryType): SkillCategoryType {
  return {
    ...category,
    icon: getIconComponent(category.icon)
  };
}

/**
 * Convert achievement with string icon to React component
 */
export function processAchievement(achievement: AchievementType): AchievementType {
  let processedIcon: React.ReactNode;
  
  if (typeof achievement.icon === 'string') {
    const IconComponent = getIconComponent(achievement.icon);
    processedIcon = React.createElement(IconComponent, { className: "w-6 h-6" });
  } else {
    processedIcon = achievement.icon;
  }
  
  return {
    ...achievement,
    icon: processedIcon
  };
}

/**
 * Convert contact info with string icons to component-based icons
 */
export function processContactInfo(contactInfo: ContactInfoType): ContactInfoType {
  const processedMethods = { ...contactInfo.methods };
  for (const key in processedMethods) {
    const method = processedMethods[key as keyof typeof processedMethods];
    if (method && typeof method.icon === 'string') {
      method.icon = getIconComponent(method.icon);
    }
  }

  return {
    ...contactInfo,
    methods: processedMethods,
  };
}

/**
 * Get all available icon names for reference
 */
export function getAvailableIcons(): string[] {
  return Object.keys(iconMap);
}