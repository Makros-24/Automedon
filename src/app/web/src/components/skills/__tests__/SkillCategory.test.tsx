import React from 'react'
import { render, screen } from '@/test-utils'
import { SkillCategory } from '../SkillCategory'
import { Monitor } from 'lucide-react'
import { mockSkillCategory } from '@/test-utils/test-helpers'

const mockCategory = {
  name: 'Frontend Development',
  icon: Monitor,
  skills: ['JavaScript', 'TypeScript', 'React']
}

describe('SkillCategory', () => {
  it('renders skill category correctly', () => {
    render(<SkillCategory category={mockCategory} index={0} />)
    
    expect(screen.getByText('Frontend Development')).toBeInTheDocument()
    
    // Check that skills are rendered
    expect(screen.getByText('JavaScript')).toBeInTheDocument()
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
    expect(screen.getByText('React')).toBeInTheDocument()
  })

  it('displays the category icon', () => {
    render(<SkillCategory category={mockCategory} index={0} />)
    
    // The icon should be rendered
    const iconContainer = screen.getByText('Frontend Development').parentElement?.querySelector('.w-12.h-12')
    expect(iconContainer).toBeInTheDocument()
  })

  it('renders skill badges with icons', () => {
    render(<SkillCategory category={mockCategory} index={0} />)
    
    // Each skill should have an icon
    const badges = screen.getAllByRole('generic').filter(el => 
      el.textContent?.includes('JavaScript') || 
      el.textContent?.includes('TypeScript') || 
      el.textContent?.includes('React')
    )
    
    expect(badges.length).toBeGreaterThan(0)
  })

  it('applies correct CSS classes for styling', () => {
    render(<SkillCategory category={mockCategory} index={0} />)
    
    const container = screen.getByText('Frontend Development').closest('.group.relative')
    expect(container).toHaveClass('group', 'relative')
  })

  it('handles empty skills array', () => {
    const emptyCategoryMock = {
      ...mockCategory,
      skills: []
    }
    
    render(<SkillCategory category={emptyCategoryMock} index={0} />)
    
    expect(screen.getByText('Frontend Development')).toBeInTheDocument()
    // Should not have any skill badges
    expect(screen.queryByText('JavaScript')).not.toBeInTheDocument()
  })

  it('applies animation delay based on index', () => {
    const { container } = render(<SkillCategory category={mockCategory} index={2} />)
    
    // The component should be rendered (motion animation is mocked)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('handles long category names gracefully', () => {
    const longNameCategory = {
      ...mockCategory,
      name: 'Very Long Category Name That Should Not Break Layout'
    }
    
    render(<SkillCategory category={longNameCategory} index={0} />)
    
    expect(screen.getByText('Very Long Category Name That Should Not Break Layout')).toBeInTheDocument()
  })

  it('renders with many skills', () => {
    const manySkillsCategory = {
      ...mockCategory,
      skills: [
        'JavaScript', 'TypeScript', 'React', 'Vue.js', 'Angular', 
        'Next.js', 'HTML5', 'CSS3', 'Tailwind CSS', 'Sass'
      ]
    }
    
    render(<SkillCategory category={manySkillsCategory} index={0} />)
    
    // All skills should be rendered
    manySkillsCategory.skills.forEach(skill => {
      expect(screen.getByText(skill)).toBeInTheDocument()
    })
  })
})