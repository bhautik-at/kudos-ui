import { render, screen } from '@testing-library/react';

import { Label } from '.';

describe('Label', () => {
  it('renders correctly', () => {
    render(<Label>Test label</Label>);
    expect(screen.getByText('Test label')).toBeInTheDocument();
  });

  it('shows error state', () => {
    render(<Label error>Error label</Label>);
    const label = screen.getByText('Error label');
    expect(label).toHaveClass('text-red-500');
  });

  it('shows required indicator', () => {
    render(<Label required>Required label</Label>);
    const asterisk = screen.getByText('*');
    expect(asterisk).toHaveClass('text-red-500');
  });

  it('passes through HTML attributes', () => {
    render(<Label htmlFor="test-input">Test label</Label>);
    const label = screen.getByText('Test label');
    expect(label).toHaveAttribute('for', 'test-input');
  });
});
