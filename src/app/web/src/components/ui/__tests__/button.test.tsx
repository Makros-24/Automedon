import React from 'react'
import { render, screen, fireEvent } from '@/test-utils'
import { Button } from '../button'
import { Download } from 'lucide-react'

describe('Button', () => {
  it('renders with default props', () => {
    render(<Button>Click me</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent('Click me')
    expect(button).toHaveClass('inline-flex', 'items-center', 'justify-center')
  })

  it('applies different variants correctly', () => {
    const { rerender } = render(<Button variant="default">Default</Button>)
    let button = screen.getByRole('button')
    expect(button).toHaveClass('bg-primary', 'text-primary-foreground')

    rerender(<Button variant="destructive">Destructive</Button>)
    button = screen.getByRole('button')
    expect(button).toHaveClass('bg-destructive', 'text-white')

    rerender(<Button variant="outline">Outline</Button>)
    button = screen.getByRole('button')
    expect(button).toHaveClass('border', 'bg-background')

    rerender(<Button variant="secondary">Secondary</Button>)
    button = screen.getByRole('button')
    expect(button).toHaveClass('bg-secondary', 'text-secondary-foreground')

    rerender(<Button variant="ghost">Ghost</Button>)
    button = screen.getByRole('button')
    expect(button).toHaveClass('hover:bg-accent')

    rerender(<Button variant="link">Link</Button>)
    button = screen.getByRole('button')
    expect(button).toHaveClass('text-primary', 'underline-offset-4')
  })

  it('applies different sizes correctly', () => {
    const { rerender } = render(<Button size="default">Default</Button>)
    let button = screen.getByRole('button')
    expect(button).toHaveClass('h-9', 'px-4', 'py-2')

    rerender(<Button size="sm">Small</Button>)
    button = screen.getByRole('button')
    expect(button).toHaveClass('h-8', 'px-3')

    rerender(<Button size="lg">Large</Button>)
    button = screen.getByRole('button')
    expect(button).toHaveClass('h-10', 'px-6')

    rerender(<Button size="icon"><Download /></Button>)
    button = screen.getByRole('button')
    expect(button).toHaveClass('size-9')
  })

  it('handles click events', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('can be disabled', () => {
    const handleClick = jest.fn()
    render(<Button disabled onClick={handleClick}>Disabled</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(button).toHaveClass('disabled:opacity-50', 'disabled:pointer-events-none')
    
    fireEvent.click(button)
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('applies custom className', () => {
    render(<Button className="custom-class">Custom</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('custom-class')
  })

  it('renders as child component when asChild is true', () => {
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>
    )
    
    const link = screen.getByRole('link')
    expect(link).toBeInTheDocument()
    expect(link).toHaveTextContent('Link Button')
    expect(link).toHaveAttribute('href', '/test')
  })

  it('renders with icons', () => {
    render(
      <Button>
        <Download className="w-4 h-4" />
        Download
      </Button>
    )
    
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent('Download')
    
    const icon = button.querySelector('svg')
    expect(icon).toBeInTheDocument()
  })

  it('handles keyboard navigation', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Keyboard</Button>)
    
    const button = screen.getByRole('button')
    button.focus()
    expect(button).toHaveFocus()
    
    fireEvent.keyDown(button, { key: 'Enter' })
    expect(handleClick).toHaveBeenCalledTimes(1)
    
    fireEvent.keyDown(button, { key: ' ' })
    expect(handleClick).toHaveBeenCalledTimes(2)
  })

  it('supports ref forwarding', () => {
    const ref = React.createRef<HTMLButtonElement>()
    render(<Button ref={ref}>Ref test</Button>)
    
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
    expect(ref.current?.textContent).toBe('Ref test')
  })
})