import React from 'react'
import { render, screen, fireEvent, waitFor } from '@/test-utils'
import { Hero } from '../Hero'

// Mock the AIChatPopup component
jest.mock('../AIChatPopup', () => ({
  AIChatPopup: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => (
    isOpen ? (
      <div data-testid="ai-chat-popup">
        AI Chat Popup
        <button onClick={onClose} data-testid="close-chat">Close</button>
      </div>
    ) : null
  )
}))

// Mock scrollIntoView
Element.prototype.scrollIntoView = jest.fn()

describe('Hero', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders all hero elements correctly', () => {
    render(<Hero />)
    
    // Check main heading
    expect(screen.getByText('Alex Thompson')).toBeInTheDocument()
    
    // Check title
    expect(screen.getByText('Solution Architect')).toBeInTheDocument()
    
    // Check description
    expect(screen.getByText(/Crafting scalable solutions and architectural excellence/)).toBeInTheDocument()
    
    // Check CTAs
    expect(screen.getByRole('button', { name: /View My Work/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Download Resume/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Ask AI About Me/i })).toBeInTheDocument()
    
    // Check scroll indicator
    expect(screen.getByText('Scroll to explore')).toBeInTheDocument()
  })

  it('applies correct CSS classes for styling', () => {
    render(<Hero />)
    
    const section = screen.getByRole('region', { name: /hero/i }) || document.querySelector('#hero')
    expect(section).toHaveClass('relative', 'min-h-screen', 'flex', 'items-center')
  })

  it('handles "View My Work" button click', async () => {
    render(<Hero />)
    
    // Create a mock work section
    const workSection = document.createElement('section')
    workSection.id = 'work'
    document.body.appendChild(workSection)
    
    const viewWorkBtn = screen.getByRole('button', { name: /View My Work/i })
    fireEvent.click(viewWorkBtn)
    
    await waitFor(() => {
      expect(workSection.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' })
    })
    
    // Cleanup
    document.body.removeChild(workSection)
  })

  it('handles "Download Resume" button click', () => {
    // Mock window.alert
    window.alert = jest.fn()
    
    render(<Hero />)
    
    const downloadBtn = screen.getByRole('button', { name: /Download Resume/i })
    fireEvent.click(downloadBtn)
    
    expect(window.alert).toHaveBeenCalledWith('Resume download would be implemented here')
  })

  it('handles "Ask AI About Me" button click', async () => {
    render(<Hero />)
    
    const aiBtn = screen.getByRole('button', { name: /Ask AI About Me/i })
    fireEvent.click(aiBtn)
    
    await waitFor(() => {
      expect(screen.getByTestId('ai-chat-popup')).toBeInTheDocument()
    })
  })

  it('can close AI chat popup', async () => {
    render(<Hero />)
    
    // Open AI chat
    const aiBtn = screen.getByRole('button', { name: /Ask AI About Me/i })
    fireEvent.click(aiBtn)
    
    await waitFor(() => {
      expect(screen.getByTestId('ai-chat-popup')).toBeInTheDocument()
    })
    
    // Close AI chat
    const closeBtn = screen.getByTestId('close-chat')
    fireEvent.click(closeBtn)
    
    await waitFor(() => {
      expect(screen.queryByTestId('ai-chat-popup')).not.toBeInTheDocument()
    })
  })

  it('handles scroll indicator click', async () => {
    render(<Hero />)
    
    // Create a mock work section
    const workSection = document.createElement('section')
    workSection.id = 'work'
    document.body.appendChild(workSection)
    
    const scrollIndicator = screen.getByText('Scroll to explore').closest('div')
    expect(scrollIndicator).toBeInTheDocument()
    
    if (scrollIndicator) {
      fireEvent.click(scrollIndicator)
      
      await waitFor(() => {
        expect(workSection.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' })
      })
    }
    
    // Cleanup
    document.body.removeChild(workSection)
  })

  it('renders with motion animations', () => {
    render(<Hero />)
    
    // Check that motion.section is rendered (by checking for section element)
    const section = document.querySelector('#hero')
    expect(section).toBeInTheDocument()
  })

  it('has proper accessibility attributes', () => {
    render(<Hero />)
    
    const buttons = screen.getAllByRole('button')
    buttons.forEach(button => {
      expect(button).toBeInTheDocument()
      // Buttons should be keyboard accessible
      expect(button).toHaveProperty('tabIndex', 0)
    })
  })

  it('maintains state correctly', () => {
    render(<Hero />)
    
    // AI chat should initially be closed
    expect(screen.queryByTestId('ai-chat-popup')).not.toBeInTheDocument()
    
    // Open and verify state change
    const aiBtn = screen.getByRole('button', { name: /Ask AI About Me/i })
    fireEvent.click(aiBtn)
    
    expect(screen.getByTestId('ai-chat-popup')).toBeInTheDocument()
  })

  it('handles keyboard navigation', () => {
    render(<Hero />)
    
    const buttons = screen.getAllByRole('button')
    
    // Focus first button
    buttons[0].focus()
    expect(buttons[0]).toHaveFocus()
    
    // Tab to next button
    fireEvent.keyDown(buttons[0], { key: 'Tab' })
    // Note: Actual focus management would be handled by browser
  })
})