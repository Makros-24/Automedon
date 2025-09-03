import React from 'react'
import { render, screen } from '@/test-utils'
import { Badge } from '../badge'

describe('Badge', () => {
  it('renders with default props', () => {
    render(<Badge>Default Badge</Badge>)
    
    const badge = screen.getByText('Default Badge')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveClass('inline-flex', 'items-center')
  })

  it('applies different variants correctly', () => {
    const { rerender } = render(<Badge variant="default">Default</Badge>)
    let badge = screen.getByText('Default')
    expect(badge).toHaveClass('bg-primary', 'text-primary-foreground')

    rerender(<Badge variant="secondary">Secondary</Badge>)
    badge = screen.getByText('Secondary')
    expect(badge).toHaveClass('bg-secondary', 'text-secondary-foreground')

    rerender(<Badge variant="destructive">Destructive</Badge>)
    badge = screen.getByText('Destructive')
    expect(badge).toHaveClass('bg-destructive', 'text-destructive-foreground')

    rerender(<Badge variant="outline">Outline</Badge>)
    badge = screen.getByText('Outline')
    expect(badge).toHaveClass('text-foreground')
  })

  it('applies custom className', () => {
    render(<Badge className="custom-class">Custom</Badge>)
    
    const badge = screen.getByText('Custom')
    expect(badge).toHaveClass('custom-class')
  })

  it('renders with complex content', () => {
    render(
      <Badge>
        <span>Icon</span>
        Badge Text
      </Badge>
    )
    
    const badge = screen.getByText('Badge Text')
    expect(badge).toBeInTheDocument()
    expect(screen.getByText('Icon')).toBeInTheDocument()
  })
})