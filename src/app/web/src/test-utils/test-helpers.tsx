import React from 'react'
import { act } from '@testing-library/react'

// Animation test helpers
export const waitForAnimation = async (duration: number = 300) => {
  await act(async () => {
    await new Promise(resolve => setTimeout(resolve, duration))
  })
}

export const triggerIntersection = (element: Element, isIntersecting: boolean = true) => {
  const observer = (global as typeof globalThis).IntersectionObserver
  const observerPrototype = observer.prototype as unknown as { callback?: (entries: IntersectionObserverEntry[]) => void }
  if (observer && observerPrototype.callback) {
    observerPrototype.callback([{
      target: element,
      isIntersecting,
      intersectionRatio: isIntersecting ? 1 : 0,
      boundingClientRect: element.getBoundingClientRect(),
      rootBounds: null,
      time: Date.now()
    }] as IntersectionObserverEntry[])
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

  // Note: Actual assertions should be done in test files with expect()
  // This helper just returns the elements for testing

  return { headings, buttons, links }
}

// Error boundary test helper
export function ErrorBoundaryTestComponent({
  children,
  shouldThrow = false
}: {
  children: React.ReactNode;
  shouldThrow?: boolean;
}) {
  if (shouldThrow) {
    throw new Error('Test error')
  }
  return <>{children}</>
}