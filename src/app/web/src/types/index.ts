import { type LucideIcon } from 'lucide-react'

// Image data types supporting both base64 and URL
export interface ImageData {
  base64?: string
  url?: string
}

// Technology with icon support (for enhanced technology visualization)
export interface TechnologyWithIcon {
  name: string
  icon?: ImageData | string // Support ImageData object, string (Lucide icon name), or none
}

// ============================================================================
// Internationalization (i18n) Types
// ============================================================================

/**
 * Language/Locale code (dynamically discovered)
 * Examples: 'en', 'fr', 'de', 'ar', 'es', 'it', etc.
 */
export type Language = string

/**
 * Metadata for a single locale
 */
export interface LocaleMetadata {
  code: string           // Language code: 'en', 'fr', etc.
  name: string           // English name: 'English', 'French'
  nativeName: string     // Native name: 'English', 'Français'
  flag: string           // Flag emoji: '🇬🇧', '🇫🇷'
  isRTL: boolean         // Right-to-left layout support
}

// Language context type
export interface LanguageContextType {
  language: Language
  setLanguage: (language: Language) => void
  isRTL: boolean
  availableLocales: LocaleMetadata[]
  defaultLocale: string
  isLoading: boolean
}

// Utility type for localized content
export type LocalizedContent<T> = {
  [K in Language]: T
}

// UI translation keys and structure
export interface UITranslations {
  navigation: {
    work: string
    about: string
    contact: string
    menu: string
    menuDescription: string
  }
  buttons: {
    viewWork: string
    downloadResume: string
    askAI: string
    viewProject: string
    viewGithub: string
    sendMessage: string
  }
  loading: {
    portfolio: string
    pleaseWait: string
  }
  errors: {
    loadingFailed: string
    fetchFailed: string
    tryAgain: string
  }
  dialogs: {
    underDevelopment: string
    comingSoon: string
  }
  accessibility: {
    scrollToExplore: string
    toggleTheme: string
    toggleLanguage: string
    closeDialog: string
    openMenu: string
  }
}

// ============================================================================
// Personal information
export interface PersonalInfo {
  name: string
  title: string
  description: string
  avatar?: ImageData | string // Support both base64/URL format and legacy string URL
  resumeUrl?: string
  superMeUserId?: string // SuperMe user ID for embedded profile
}

// Contact information
export interface ContactInfo {
  title: string;
  description: string;
  locationTitle: string;
  locationDescription: string;
  cta: {
    title: string;
    description: string;
    button1: string;
    button2: string;
  };
  responseTime: string;
  email: string;
  linkedin: string;
  github: string;
  twitter: string;
  phone?: string;
  location?: string;
  methods: {
    email: { description: string };
    linkedin: { description: string };
    github: { description: string };
    twitter: { description: string };
  };
}

// Core data types for the portfolio
export interface Project {
  id: number
  title: string
  company: string
  role: string
  description: string
  markdownFileName?: string // Optional markdown file reference for detailed content
  image: ImageData | string // Support both new and legacy format
  technologies: (string | TechnologyWithIcon)[] // Support both string and enhanced format
  links?: {
    live?: string
    github?: string
  }
}

export interface SkillCategory {
  name: string
  icon: LucideIcon | string // Support both LucideIcon and string for JSON
  skills: (string | TechnologyWithIcon)[] // Support both string and enhanced format
}

export interface Achievement {
  icon: React.ReactNode | string // Support both ReactNode and string for JSON
  number: string
  title: string
  description: string
}

// Footer information
export interface FooterInfo {
  copyrightName: string;
  copyrightYear: number;
  madeWithText: string;
}

export interface AboutData {
  title: string;
  description: string;
  skillsTitle: string;
  achievementsTitle: string;
}

export interface WorkData {
  title: string;
  description: string;
}

// Complete portfolio data structure
export interface PortfolioData {
  personalInfo: PersonalInfo
  about: AboutData;
  work: WorkData;
  projects: Project[]
  skillCategories: SkillCategory[]
  achievements: Achievement[]
  contactInfo: ContactInfo
  footer: FooterInfo
}

// Animation types
export interface AnimationConfig {
  initial?: Record<string, unknown>
  animate?: Record<string, unknown>
  transition?: Record<string, unknown>
  delay?: number
}

export interface InViewOptions {
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
}

// Theme types
export type Theme = 'light' | 'dark' | 'system'

// Component prop types
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}

export interface SectionProps extends BaseComponentProps {
  id?: string
}

// Test types (commented out to avoid jest dependency in production build)
// Only used in test files which import @testing-library/jest-dom
// export interface MockIntersectionObserver {
//   observe: jest.Mock
//   unobserve: jest.Mock
//   disconnect: jest.Mock
// }
