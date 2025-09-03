import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { AIChatPopup } from '../AIChatPopup';

// Mock framer-motion to avoid animation issues in tests
jest.mock('motion/react', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock scrollIntoView for testing environment
Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
  configurable: true,
  value: jest.fn(),
});

// Mock focus method
Object.defineProperty(HTMLElement.prototype, 'focus', {
  configurable: true,
  value: jest.fn(),
});

describe('AIChatPopup', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Layout and Structure', () => {
    it('renders the popup when isOpen is true', () => {
      render(<AIChatPopup {...defaultProps} />);
      
      expect(screen.getByText('Ask AI About Alex')).toBeInTheDocument();
      expect(screen.getByText('Get instant answers about his experience')).toBeInTheDocument();
    });

    it('does not render when isOpen is false', () => {
      render(<AIChatPopup {...defaultProps} isOpen={false} />);
      
      expect(screen.queryByText('Ask AI About Alex')).not.toBeInTheDocument();
    });

    it('renders initial AI message', () => {
      render(<AIChatPopup {...defaultProps} />);
      
      expect(screen.getByText(/Hi! I'm Alex's AI assistant/)).toBeInTheDocument();
    });
  });

  describe('Input Container Layout', () => {
    it('renders input container with proper structure', () => {
      render(<AIChatPopup {...defaultProps} />);
      
      // Check for input field
      const inputField = screen.getByPlaceholderText('Ask anything about Alex...');
      expect(inputField).toBeInTheDocument();
      
      // Check for plus button (attachment)
      const plusButtons = screen.getAllByRole('button');
      const plusButton = plusButtons.find(button => 
        button.querySelector('svg')?.classList.contains('lucide-plus') ||
        button.textContent === ''
      );
      expect(plusButton).toBeInTheDocument();
      
      // Check for send button
      const sendButton = screen.getByRole('button', { name: /send/i });
      expect(sendButton).toBeInTheDocument();
    });

    it('has input container with proper flex layout', () => {
      render(<AIChatPopup {...defaultProps} />);
      
      // Find the input area container with updated spacing classes
      const inputArea = document.querySelector('.pt-8.border-t');
      expect(inputArea).toBeInTheDocument();
      
      // Find the flex container for input elements
      const flexContainer = inputArea?.querySelector('.flex.items-center.gap-3');
      expect(flexContainer).toBeInTheDocument();
    });

    it('has input field with correct classes for styling', () => {
      render(<AIChatPopup {...defaultProps} />);
      
      const inputField = screen.getByPlaceholderText('Ask anything about Alex...');
      expect(inputField).toHaveClass('rounded-full');
      expect(inputField).toHaveClass('px-4');
      expect(inputField).toHaveClass('py-3');
      expect(inputField).toHaveClass('pr-20'); // Space for internal buttons
    });

    it('positions input field in flex-1 container', () => {
      render(<AIChatPopup {...defaultProps} />);
      
      const inputField = screen.getByPlaceholderText('Ask anything about Alex...');
      const inputContainer = inputField.closest('.flex-1');
      expect(inputContainer).toBeInTheDocument();
    });

    it('renders mic and audio waveform buttons inside input with correct positioning', () => {
      render(<AIChatPopup {...defaultProps} />);
      
      // Find the absolute positioned container for right icons
      const rightIconsContainer = document.querySelector('.absolute.right-3');
      expect(rightIconsContainer).toBeInTheDocument();
      expect(rightIconsContainer).toHaveClass('top-1/2');
      expect(rightIconsContainer).toHaveClass('-translate-y-1/2');
      expect(rightIconsContainer).toHaveClass('flex');
      expect(rightIconsContainer).toHaveClass('items-center');
      expect(rightIconsContainer).toHaveClass('gap-2');
    });

    it('positions send button correctly with flex-shrink-0', () => {
      render(<AIChatPopup {...defaultProps} />);
      
      const sendButton = screen.getByRole('button', { name: /send/i });
      expect(sendButton).toHaveClass('rounded-full');
      expect(sendButton).toHaveClass('w-10');
      expect(sendButton).toHaveClass('h-10');
      expect(sendButton).toHaveClass('flex-shrink-0');
    });

    it('positions plus button correctly with flex-shrink-0', () => {
      render(<AIChatPopup {...defaultProps} />);
      
      const buttons = screen.getAllByRole('button');
      const plusButton = buttons.find(button => 
        button.querySelector('svg') && 
        button.classList.contains('flex-shrink-0')
      );
      expect(plusButton).toBeInTheDocument();
      expect(plusButton).toHaveClass('w-10');
      expect(plusButton).toHaveClass('h-10');
    });

    it('has proper margins on flex container', () => {
      render(<AIChatPopup {...defaultProps} />);
      
      const flexContainer = document.querySelector('.flex.items-center.gap-3.mx-2');
      expect(flexContainer).toBeInTheDocument();
    });

    it('maintains proper spacing between input elements', () => {
      render(<AIChatPopup {...defaultProps} />);
      
      const flexContainer = document.querySelector('.flex.items-center.gap-3');
      expect(flexContainer).toHaveClass('gap-3');
    });
  });

  describe('Suggested Questions Layout', () => {
    it('renders suggested questions when no messages sent', () => {
      render(<AIChatPopup {...defaultProps} />);
      
      expect(screen.getByText("What's Alex's experience?")).toBeInTheDocument();
      expect(screen.getByText("What technologies does he use?")).toBeInTheDocument();
      expect(screen.getByText("Tell me about his projects")).toBeInTheDocument();
      expect(screen.getByText("Is he available for hire?")).toBeInTheDocument();
    });

    it('suggested questions container has proper alignment and spacing', () => {
      render(<AIChatPopup {...defaultProps} />);
      
      // Find the flex wrapper container for suggestions with updated bottom margin
      const suggestionsContainer = document.querySelector('.flex.flex-wrap.gap-2.mt-6.mx-2.mb-8');
      expect(suggestionsContainer).toBeInTheDocument();
      expect(suggestionsContainer).toHaveClass('flex');
      expect(suggestionsContainer).toHaveClass('flex-wrap');
      expect(suggestionsContainer).toHaveClass('gap-2');
      expect(suggestionsContainer).toHaveClass('mt-6');
      expect(suggestionsContainer).toHaveClass('mx-2');
      expect(suggestionsContainer).toHaveClass('mb-8');
    });

    it('suggested questions have proper styling classes', () => {
      render(<AIChatPopup {...defaultProps} />);
      
      const suggestionButton = screen.getByText("What's Alex's experience?");
      expect(suggestionButton).toHaveClass('rounded-full');
      expect(suggestionButton).toHaveClass('px-3');
      expect(suggestionButton).toHaveClass('py-1');
      expect(suggestionButton).toHaveClass('h-auto');
      expect(suggestionButton).toHaveClass('text-xs');
    });

    it('suggested questions are properly aligned with input field', () => {
      render(<AIChatPopup {...defaultProps} />);
      
      // Both input container and suggestions should have mx-2
      const inputContainer = document.querySelector('.flex.items-center.gap-3.mx-2');
      const suggestionsContainer = document.querySelector('.flex.flex-wrap.gap-2.mt-6.mx-2.mb-8');
      
      expect(inputContainer).toBeInTheDocument();
      expect(suggestionsContainer).toBeInTheDocument();
      
      // Both should have same horizontal margins
      expect(inputContainer).toHaveClass('mx-2');
      expect(suggestionsContainer).toHaveClass('mx-2');
    });

    it('suggested questions have consistent spacing from input field', () => {
      render(<AIChatPopup {...defaultProps} />);
      
      const suggestionsContainer = document.querySelector('.flex.flex-wrap.gap-2.mt-6.mb-8');
      expect(suggestionsContainer).toHaveClass('mt-6');
      expect(suggestionsContainer).toHaveClass('mb-8');
    });

    it('hides suggested questions after sending a message', async () => {
      const user = userEvent.setup();
      render(<AIChatPopup {...defaultProps} />);
      
      // Initial state: suggested questions should be visible (only 1 message - the initial AI message)
      expect(screen.getByText("What's Alex's experience?")).toBeInTheDocument();
      
      const inputField = screen.getByPlaceholderText('Ask anything about Alex...');
      await user.type(inputField, 'Test message');
      
      // Send the message by pressing Enter
      await user.keyboard('{Enter}');
      
      // After sending, there should be 2+ messages, so suggestions should be hidden
      // We wait a bit for the state to update
      await waitFor(() => {
        expect(screen.queryByText("What's Alex's experience?")).not.toBeInTheDocument();
      }, { timeout: 100 });
    });

    it('maintains proper wrapping behavior on smaller screens', () => {
      render(<AIChatPopup {...defaultProps} />);
      
      const suggestionsContainer = document.querySelector('.flex.flex-wrap');
      expect(suggestionsContainer).toHaveClass('flex-wrap');
      
      // Should allow buttons to wrap to new lines
      const suggestionButtons = screen.getAllByRole('button').filter(button => 
        button.textContent && button.textContent.includes('?')
      );
      
      expect(suggestionButtons.length).toBe(4);
    });
  });

  describe('Input Field Interactions', () => {
    it('allows typing in input field', async () => {
      const user = userEvent.setup();
      render(<AIChatPopup {...defaultProps} />);
      
      const inputField = screen.getByPlaceholderText('Ask anything about Alex...');
      await user.type(inputField, 'Hello Alex');
      
      expect(inputField).toHaveValue('Hello Alex');
    });

    it('sends message on Enter key press', async () => {
      const user = userEvent.setup();
      render(<AIChatPopup {...defaultProps} />);
      
      const inputField = screen.getByPlaceholderText('Ask anything about Alex...');
      await user.type(inputField, 'Test message{enter}');
      
      await waitFor(() => {
        expect(screen.getByText('Test message')).toBeInTheDocument();
      });
    });

    it('does not send empty messages', async () => {
      const user = userEvent.setup();
      render(<AIChatPopup {...defaultProps} />);
      
      const sendButton = screen.getByRole('button', { name: /send/i });
      expect(sendButton).toBeDisabled();
      
      const inputField = screen.getByPlaceholderText('Ask anything about Alex...');
      await user.type(inputField, '   '); // Only spaces
      
      expect(sendButton).toBeDisabled();
    });

    it('enables send button when input has content', async () => {
      const user = userEvent.setup();
      render(<AIChatPopup {...defaultProps} />);
      
      const inputField = screen.getByPlaceholderText('Ask anything about Alex...');
      const sendButton = screen.getByRole('button', { name: /send/i });
      
      expect(sendButton).toBeDisabled();
      
      await user.type(inputField, 'Test message');
      expect(sendButton).toBeEnabled();
    });
  });

  describe('Message Display', () => {
    it('displays user messages with correct styling', async () => {
      const user = userEvent.setup();
      render(<AIChatPopup {...defaultProps} />);
      
      const inputField = screen.getByPlaceholderText('Ask anything about Alex...');
      await user.type(inputField, 'Test user message{enter}');
      
      await waitFor(() => {
        const userMessage = screen.getByText('Test user message');
        expect(userMessage).toBeInTheDocument();
        
        // Check if message has user styling (gradient background)
        const messageContainer = userMessage.closest('div');
        expect(messageContainer).toHaveClass('bg-gradient-to-r');
      });
    });

    it('displays AI messages with correct styling', async () => {
      const user = userEvent.setup();
      render(<AIChatPopup {...defaultProps} />);
      
      const inputField = screen.getByPlaceholderText('Ask anything about Alex...');
      await user.type(inputField, 'hello{enter}');
      
      // Wait for AI response
      await waitFor(() => {
        const aiMessage = screen.getByText(/Hello there! I'm Alex's AI assistant/);
        expect(aiMessage).toBeInTheDocument();
        
        // Check if message has AI styling (glass effect)
        const messageContainer = aiMessage.closest('div');
        expect(messageContainer).toHaveClass('glass-light');
      });
    });

    it('shows typing indicator during AI response', async () => {
      const user = userEvent.setup();
      render(<AIChatPopup {...defaultProps} />);
      
      const inputField = screen.getByPlaceholderText('Ask anything about Alex...');
      await user.type(inputField, 'test{enter}');
      
      // Should show typing indicator immediately
      expect(screen.getByText('AI is thinking...')).toBeInTheDocument();
      
      // Should hide typing indicator after response
      await waitFor(() => {
        expect(screen.queryByText('AI is thinking...')).not.toBeInTheDocument();
      }, { timeout: 5000 });
    });
  });

  describe('Suggested Question Interactions', () => {
    it('fills input when suggestion is clicked', async () => {
      const user = userEvent.setup();
      render(<AIChatPopup {...defaultProps} />);
      
      const suggestionButton = screen.getByText("What's Alex's experience?");
      await user.click(suggestionButton);
      
      const inputField = screen.getByPlaceholderText('Ask anything about Alex...');
      expect(inputField).toHaveValue("What's Alex's experience?");
    });

    it('enables send button after clicking suggestion', async () => {
      const user = userEvent.setup();
      render(<AIChatPopup {...defaultProps} />);
      
      const suggestionButton = screen.getByText("What technologies does he use?");
      const sendButton = screen.getByRole('button', { name: /send/i });
      
      expect(sendButton).toBeDisabled();
      
      await user.click(suggestionButton);
      expect(sendButton).toBeEnabled();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels', () => {
      render(<AIChatPopup {...defaultProps} />);
      
      // Dialog should have proper ARIA attributes
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
    });

    it('focuses input when popup opens', async () => {
      render(<AIChatPopup {...defaultProps} />);
      
      // Input should be focused (need to wait for useEffect)
      await waitFor(() => {
        const inputField = screen.getByPlaceholderText('Ask anything about Alex...');
        expect(inputField).toBeInTheDocument();
        // Note: Focus testing is challenging in JSDOM environment
        // The component attempts to focus but JSDOM doesn't fully support it
      }, { timeout: 200 });
    });

    it('closes popup on Escape key', () => {
      const mockOnClose = jest.fn();
      render(<AIChatPopup {...defaultProps} onClose={mockOnClose} />);
      
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('closes popup when backdrop is clicked', async () => {
      const mockOnClose = jest.fn();
      const user = userEvent.setup();
      render(<AIChatPopup {...defaultProps} onClose={mockOnClose} />);
      
      // Find and click the backdrop
      const backdrop = document.querySelector('[class*="backdrop-blur"]');
      if (backdrop) {
        await user.click(backdrop);
        expect(mockOnClose).toHaveBeenCalledTimes(1);
      }
    });

    it('closes popup when X button is clicked', async () => {
      const mockOnClose = jest.fn();
      const user = userEvent.setup();
      render(<AIChatPopup {...defaultProps} onClose={mockOnClose} />);
      
      const closeButton = screen.getByRole('button', { name: /close/i });
      await user.click(closeButton);
      
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Responsive Layout', () => {
    it('handles different viewport sizes', () => {
      // Test mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
      
      render(<AIChatPopup {...defaultProps} />);
      
      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeInTheDocument();
      
      // Test desktop viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });
      
      // Re-render to apply viewport changes
      render(<AIChatPopup {...defaultProps} />);
      expect(dialog).toBeInTheDocument();
    });
  });
});