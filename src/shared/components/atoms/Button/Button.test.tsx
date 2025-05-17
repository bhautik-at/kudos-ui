import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';

import { Button } from './index';

/**
 * Test suite for Button component
 * Tests rendering, interactions, variants, sizes, and prop handling
 */
describe('Button Component', () => {
  // #region Rendering Tests
  describe('Rendering', () => {
    it('should render button with children content', () => {
      // Render component
      render(<Button>Click me</Button>);

      // Verify basic rendering
      expect(screen.getByRole('button')).toBeInTheDocument();
      expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('should forward ref to underlying button element', () => {
      // Setup ref
      const ref = createRef<HTMLButtonElement>();

      // Render with ref
      render(<Button ref={ref}>Click me</Button>);

      // Verify ref forwarding
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });
  });
  // #endregion

  // #region Interaction Tests
  describe('Interactions', () => {
    it('should trigger onClick handler when clicked', () => {
      // Setup click handler
      const handleClick = jest.fn();

      // Render and trigger click
      render(<Button onClick={handleClick}>Click me</Button>);
      fireEvent.click(screen.getByRole('button'));

      // Verify click handler
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should be disabled when disabled prop is true', () => {
      // Render disabled button
      render(<Button disabled>Click me</Button>);

      // Verify disabled state
      expect(screen.getByRole('button')).toBeDisabled();
    });
  });
  // #endregion

  // #region Styling Tests
  describe('Styling', () => {
    it('should apply correct classes for destructive variant', () => {
      // Render destructive variant
      render(<Button variant="destructive">Delete</Button>);
      const button = screen.getByRole('button');

      // Verify variant classes
      expect(button).toHaveClass('bg-destructive');
      expect(button).toHaveClass('text-destructive-foreground');
      expect(button).toHaveClass('hover:bg-destructive/90');
    });

    it('should apply correct classes for small size', () => {
      // Render small size
      render(<Button size="sm">Small Button</Button>);
      const button = screen.getByRole('button');

      // Verify size classes
      expect(button).toHaveClass('h-8');
      expect(button).toHaveClass('px-3');
      expect(button).toHaveClass('text-xs');
    });
  });
  // #endregion

  // #region Props Tests
  describe('Props', () => {
    it('should pass through HTML attributes to button element', () => {
      // Render with HTML attributes
      render(
        <Button data-testid="custom-button" aria-label="Custom Button">
          Click me
        </Button>
      );
      const button = screen.getByTestId('custom-button');

      // Verify attribute forwarding
      expect(button).toHaveAttribute('aria-label', 'Custom Button');
    });
  });
  // #endregion
});
