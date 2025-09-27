import { render, screen, waitFor, act } from '@testing-library/react';
import { Contact } from '@/components/Contact';
import { useInViewOnce } from '@/hooks/useInViewOnce';

// Mock the useInViewOnce hook
jest.mock('@/hooks/useInViewOnce', () => ({
  useInViewOnce: jest.fn(),
}));

describe('Contact Component', () => {
  it('should apply animation classes when in view', async () => {
    // Arrange
    (useInViewOnce as jest.Mock).mockReturnValue({ ref: jest.fn(), inView: true });

    // Act
    await act(async () => {
      render(<Contact />);
    });

    // Assert
    await waitFor(() => {
      const section = screen.getByTestId('contact-section');
      const style = window.getComputedStyle(section.querySelector('.absolute.inset-0.overflow-hidden'));
      expect(parseFloat(style.opacity)).toBeCloseTo(1);
    }, { timeout: 5000 });
  });

  it('should not apply animation classes when not in view', async () => {
    // Arrange
    (useInViewOnce as jest.Mock).mockReturnValue({ ref: jest.fn(), inView: false });

    // Act
    await act(async () => {
      render(<Contact />);
    });

    // Assert
    await waitFor(() => {
      const section = screen.getByTestId('contact-section');
      expect(section.querySelector('.absolute.inset-0.overflow-hidden')).toHaveStyle({ opacity: 0 });
    });
  });
});
