import { render, screen } from '@testing-library/react';

import { Input } from '.';

describe('Input', () => {
  it('renders correctly', () => {
    render(<Input placeholder="Test input" />);
    expect(screen.getByPlaceholderText('Test input')).toBeInTheDocument();
  });

  it('shows error state', () => {
    render(<Input error helperText="Error message" />);
    const input = screen.getByRole('textbox');
    const helperText = screen.getByText('Error message');

    expect(input).toHaveClass('border-red-500');
    expect(helperText).toHaveClass('text-red-500');
  });

  it('shows helper text', () => {
    render(<Input helperText="Helper message" />);
    const helperText = screen.getByText('Helper message');

    expect(helperText).toHaveClass('text-gray-500');
  });

  it('passes through HTML attributes', () => {
    render(<Input type="email" required />);
    const input = screen.getByRole('textbox');

    expect(input).toHaveAttribute('type', 'email');
    expect(input).toHaveAttribute('required');
  });
});
