import React from 'react'
import { act } from '@testing-library/react'

// Animation test helpers
export const waitForAnimation = async (duration: number = 300) => {
  await act(async () => {
    await new Promise(resolve => setTimeout(resolve, duration))
  })
}

export const triggerIntersection = (element: Element, isIntersecting: boolean = true) => {
  const observer = (global as any).IntersectionObserver
  if (observer && observer.prototype.callback) {
    observer.prototype.callback([{
      target: element,
      isIntersecting,
      intersectionRatio: isIntersecting ? 1 : 0,
      boundingClientRect: element.getBoundingClientRect(),
      rootBounds: null,
      time: Date.now()
    }])
  }
}

// Mock data generators
export const mockProject = (overrides = {}) => ({
  id: 1,
  title: 'Test Project',
  company: 'Test Company',
  role: 'Test Role',
  description: 'Test description for the project.',
  image: 'https://test.com/image.jpg',
  technologies: ['React', 'TypeScript'],
  links: {
    live: '#',
    github: '#'
  },
  ...overrides
})

export const mockSkillCategory = (overrides = {}) => ({
  name: 'Test Category',
  icon: 'Monitor',
  skills: ['Test Skill 1', 'Test Skill 2'],
  ...overrides
})

export const mockAchievement = (overrides = {}) => ({
  icon: '<svg></svg>',
  number: '10+',
  title: 'Test Achievement',
  description: 'Test achievement description',
  ...overrides
})

// Theme testing utilities
export const getThemeClass = (theme: 'light' | 'dark') => theme === 'dark' ? 'dark' : ''

// Accessibility test helpers
export const checkAccessibility = async (container: HTMLElement) => {
  // Check for basic accessibility requirements
  const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6')
  const buttons = container.querySelectorAll('button')
  const links = container.querySelectorAll('a')
  
  // Check that buttons have accessible names
  buttons.forEach(button => {
    expect(button).toHaveAttribute('aria-label')
    // OR have text content
    // expect(button).toHaveTextContent(/\w+/)
  })
  
  // Check that links have accessible names  
  links.forEach(link => {
    expect(link).toHaveTextContent(/\w+/)
  })
  
  return { headings, buttons, links }
}

// Error boundary test helper
export const ErrorBoundaryTestComponent: React.FC<{
  children: React.ReactNode
  shouldThrow?: boolean 
}> = ({ 
  children, 
  shouldThrow = false 
}) => {
  if (shouldThrow) {
    throw new Error('Test error')
  }
  return <>{children}</>
}