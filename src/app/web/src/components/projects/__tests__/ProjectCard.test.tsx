import React from 'react'
import { render, screen, fireEvent } from '@/test-utils'
import { ProjectCard } from '../ProjectCard'
import { mockProject } from '@/test-utils/test-helpers'

// Mock window.open
global.open = jest.fn()

const mockProjectData = mockProject({
  title: 'Test Project',
  company: 'Test Company',
  role: 'Test Engineer',
  description: 'This is a test project description.',
  technologies: ['React', 'TypeScript', 'Node.js']
})

describe('ProjectCard', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders project information correctly', () => {
    render(<ProjectCard project={mockProjectData} index={0} />)
    
    expect(screen.getByText('Test Project')).toBeInTheDocument()
    expect(screen.getByText('Test Company')).toBeInTheDocument()
    expect(screen.getByText('Test Engineer')).toBeInTheDocument()
    expect(screen.getByText('This is a test project description.')).toBeInTheDocument()
  })

  it('displays project image with correct alt text', () => {
    render(<ProjectCard project={mockProjectData} index={0} />)
    
    const image = screen.getByAltText('Test Project')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', mockProjectData.image)
  })

  it('renders technology badges', () => {
    render(<ProjectCard project={mockProjectData} index={0} />)
    
    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
    expect(screen.getByText('Node.js')).toBeInTheDocument()
  })

  it('has live project link button', () => {
    render(<ProjectCard project={mockProjectData} index={0} />)
    
    const liveButton = screen.getByLabelText('View Test Project live')
    expect(liveButton).toBeInTheDocument()
    
    fireEvent.click(liveButton)
    expect(global.open).toHaveBeenCalledWith('#', '_blank')
  })

  it('has GitHub link button', () => {
    render(<ProjectCard project={mockProjectData} index={0} />)
    
    const githubButton = screen.getByLabelText('View Test Project on GitHub')
    expect(githubButton).toBeInTheDocument()
    
    fireEvent.click(githubButton)
    expect(global.open).toHaveBeenCalledWith('#', '_blank')
  })

  it('applies correct CSS classes for glass morphism effect', () => {
    const { container } = render(<ProjectCard project={mockProjectData} index={0} />)
    
    const card = container.querySelector('.glass')
    expect(card).toBeInTheDocument()
    expect(card).toHaveClass('glass-hover')
  })

  it('renders with animation based on index', () => {
    const { container } = render(<ProjectCard project={mockProjectData} index={2} />)
    
    // Component should be rendered with motion animation
    expect(container.firstChild).toBeInTheDocument()
  })

  it('handles missing image gracefully', () => {
    const projectWithoutImage = {
      ...mockProjectData,
      image: ''
    }
    
    render(<ProjectCard project={projectWithoutImage} index={0} />)
    
    const image = screen.getByAltText('Test Project')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', '')
  })

  it('handles empty technologies array', () => {
    const projectWithoutTech = {
      ...mockProjectData,
      technologies: []
    }
    
    render(<ProjectCard project={projectWithoutTech} index={0} />)
    
    expect(screen.getByText('Test Project')).toBeInTheDocument()
    // Should not have any technology badges
    expect(screen.queryByText('React')).not.toBeInTheDocument()
  })

  it('handles long descriptions gracefully', () => {
    const projectWithLongDescription = {
      ...mockProjectData,
      description: 'This is a very long description that should wrap properly and not break the layout of the card component. It contains multiple sentences to test the text wrapping behavior.'
    }
    
    render(<ProjectCard project={projectWithLongDescription} index={0} />)
    
    expect(screen.getByText(/This is a very long description/)).toBeInTheDocument()
  })

  it('has proper accessibility attributes', () => {
    render(<ProjectCard project={mockProjectData} index={0} />)
    
    const liveButton = screen.getByLabelText('View Test Project live')
    const githubButton = screen.getByLabelText('View Test Project on GitHub')
    
    expect(liveButton).toHaveAttribute('aria-label', 'View Test Project live')
    expect(githubButton).toHaveAttribute('aria-label', 'View Test Project on GitHub')
  })

  it('applies hover effects correctly', () => {
    const { container } = render(<ProjectCard project={mockProjectData} index={0} />)
    
    const cardContainer = container.querySelector('.group')
    expect(cardContainer).toHaveClass('group', 'relative')
    
    // Check for hover-related classes
    const overlayLinks = container.querySelector('.opacity-0.group-hover\\:opacity-100')
    expect(overlayLinks).toBeInTheDocument()
  })
})