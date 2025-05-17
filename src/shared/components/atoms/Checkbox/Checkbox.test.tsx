import { fireEvent, render, screen } from '@testing-library/react';

import { Checkbox } from './index';

describe('Checkbox', () => {
  it('renders with default props', () => {
    render(<Checkbox />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();
  });

  it('renders as checked when checked prop is true', () => {
    render(<Checkbox checked />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('calls onCheckedChange when clicked', () => {
    const handleChange = jest.fn();
    render(<Checkbox onCheckedChange={handleChange} />);

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it('does not call onCheckedChange when disabled', () => {
    const handleChange = jest.fn();
    render(<Checkbox disabled onCheckedChange={handleChange} />);

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(handleChange).not.toHaveBeenCalled();
  });

  it('applies custom className', () => {
    render(<Checkbox className="test-class" />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveClass('test-class');
  });

  it('forwards data attributes', () => {
    render(<Checkbox data-testid="test-checkbox" />);
    expect(screen.getByTestId('test-checkbox')).toBeInTheDocument();
  });
});
