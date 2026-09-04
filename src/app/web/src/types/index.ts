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

// Metadata for a single tab in the Projects section
export interface ProjectTabMeta {
  label: string;
  description: string;
}

export interface WorkData {
  title: string;
  description: string;
  // Optional per-tab metadata. When absent, the section renders as a single
  // untabbed grid using `description` as the paragraph.
  tabs?: {
    client: ProjectTabMeta;
    personal: ProjectTabMeta;
  };
}

// A single recommendation, curated from LinkedIn into portfolio.json.
//
// LinkedIn exposes no API for recommendations (the rich Profile API died with
// the 2019 v1 deprecation), so these are transcribed by hand. `linkedinUrl`
// points at the recommender's profile so the quote stays verifiable.
export interface Recommendation {
  id: number
  name: string
  title: string          // The recommender's LinkedIn headline
  // Optional: LinkedIn exposes a single headline, not a separate employer, so
  // most transcribed recommendations have no company to record.
  company?: string
  relationship?: string  // e.g. "Managed Mohamed directly"
  date?: string          // e.g. "March 2024"
  quote: string
  /*
   * A hand-picked sentence from `quote`, shown as the card's pull quote.
   * Must be an exact excerpt - paraphrasing would put words the recommender
   * never wrote next to their name. Omit it and the card falls back to
   * clamping the opening lines of `quote`, which reads as an arbitrary cut.
   */
  highlight?: string
  avatar?: ImageData | string
  linkedinUrl?: string
}

// Section copy plus its items in one optional key: the section either exists in
// a locale file or it does not, so consumers need a single undefined check.
export interface RecommendationsData {
  title: string
  description: string
  ctaLabel?: string
  ctaUrl?: string
  items: Recommendation[]
}

// Complete portfolio data structure
export interface PortfolioData {
  personalInfo: PersonalInfo
  about: AboutData;
  work: WorkData;
  projects: Project[]
  sideProjects?: Project[] // Personal / open-source projects
  recommendations?: RecommendationsData // Optional, so pre-v1.4 data still loads
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
