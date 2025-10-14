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

// Personal information
export interface PersonalInfo {
  name: string
  title: string
  description: string
  resumeUrl?: string
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
  image: ImageData | string // Support both new and legacy format
  technologies: (string | TechnologyWithIcon)[] // Support both string and enhanced format
  links: {
    live: string
    github: string
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

// Test types
export interface MockIntersectionObserver {
  observe: jest.Mock
  unobserve: jest.Mock
  disconnect: jest.Mock
}
