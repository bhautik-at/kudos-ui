import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Switch } from './index';

describe('Switch Component', () => {
  // #region Rendering Tests
  describe('Rendering', () => {
    it('should render with default props', () => {
      render(<Switch />);
      expect(screen.getByRole('switch')).toBeInTheDocument();
    });

    it('should render in unchecked state by default', () => {
      render(<Switch />);
      expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');
    });

    it('should render in checked state when checked prop is true', () => {
      render(<Switch checked />);
      expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
    });

    it('should apply custom className', () => {
      render(<Switch className="test-class" />);
      expect(screen.getByRole('switch')).toHaveClass('test-class');
    });

    it('should render in disabled state when disabled prop is true', () => {
      render(<Switch disabled />);
      const switchElement = screen.getByRole('switch');
      expect(switchElement).toBeDisabled();
      expect(switchElement).toHaveAttribute('disabled');
    });

    it('forwards data attributes', () => {
      render(<Switch data-testid="test-switch" />);
      expect(screen.getByTestId('test-switch')).toBeInTheDocument();
    });
  });
  // #endregion

  // #region Interaction Tests
  describe('Interactions', () => {
    it('should toggle state when clicked', async () => {
      const handleChange = jest.fn();
      render(<Switch onCheckedChange={handleChange} />);

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('aria-checked', 'false');

      await userEvent.click(switchElement);
      expect(handleChange).toHaveBeenCalledWith(true);
    });

    it('should not toggle when disabled', async () => {
      const handleChange = jest.fn();
      render(<Switch disabled onCheckedChange={handleChange} />);

      const switchElement = screen.getByRole('switch');
      await userEvent.click(switchElement);

      expect(handleChange).not.toHaveBeenCalled();
    });

    it('should maintain controlled state', async () => {
      const handleChange = jest.fn();
      const { rerender } = render(<Switch checked={false} onCheckedChange={handleChange} />);

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('aria-checked', 'false');

      await userEvent.click(switchElement);
      expect(handleChange).toHaveBeenCalledWith(true);

      // State should not change until prop changes
      expect(switchElement).toHaveAttribute('aria-checked', 'false');

      // Update props to reflect change
      rerender(<Switch checked={true} onCheckedChange={handleChange} />);
      expect(switchElement).toHaveAttribute('aria-checked', 'true');
    });
  });
  // #endregion

  // #region Keyboard Navigation Tests
  describe('Keyboard Navigation', () => {
    it('should toggle state when Space key is pressed', async () => {
      const handleChange = jest.fn();
      render(<Switch onCheckedChange={handleChange} />);

      const switchElement = screen.getByRole('switch');
      switchElement.focus();
      await userEvent.keyboard('[Space]');

      expect(handleChange).toHaveBeenCalledWith(true);
    });

    it('should not toggle state when Space key is pressed and disabled', async () => {
      const handleChange = jest.fn();
      render(<Switch disabled onCheckedChange={handleChange} />);

      const switchElement = screen.getByRole('switch');
      switchElement.focus();
      await userEvent.keyboard('[Space]');

      expect(handleChange).not.toHaveBeenCalled();
    });
  });
  // #endregion

  // #region Edge Cases
  describe('Edge Cases', () => {
    it('should handle rapid toggling', async () => {
      const handleChange = jest.fn();
      render(<Switch onCheckedChange={handleChange} />);

      const switchElement = screen.getByRole('switch');

      // Simulate rapid clicks
      await userEvent.click(switchElement);
      await userEvent.click(switchElement);
      await userEvent.click(switchElement);

      expect(handleChange).toHaveBeenCalledTimes(3);
      expect(handleChange.mock.calls).toEqual([[true], [false], [true]]);
    });

    it('should handle undefined onCheckedChange', async () => {
      render(<Switch />);
      const switchElement = screen.getByRole('switch');

      // Should not throw error when clicked without handler
      await userEvent.click(switchElement);
      expect(switchElement).toBeInTheDocument();
    });
  });
  // #endregion
});
