import { render, screen } from '@testing-library/react';

import { Separator } from '.';

describe('Separator', () => {
  it('renders basic separator', () => {
    render(<Separator decorative={false} />);
    const separator = screen.getByRole('separator');
    expect(separator).toBeInTheDocument();
    expect(separator).toHaveAttribute('aria-orientation', 'horizontal');
  });

  it('renders vertical separator', () => {
    render(<Separator orientation="vertical" decorative={false} />);
    const separator = screen.getByRole('separator');
    expect(separator).toHaveAttribute('aria-orientation', 'vertical');
    expect(separator).toHaveClass('h-full', 'w-[1px]');
  });

  it('applies custom className', () => {
    render(<Separator className="custom-class" decorative={false} />);
    const separator = screen.getByRole('separator');
    expect(separator).toHaveClass('custom-class');
  });

  it('renders with text overlay', () => {
    const text = 'Or continue with';
    render(<Separator decorative={false}>{text}</Separator>);
    const separator = screen.getByRole('separator');
    const textElement = screen.getByText(text);
    expect(separator).toHaveClass('relative', 'text-center');
    expect(textElement).toHaveClass('bg-background', 'text-muted-foreground');
  });

  it('renders text overlay with vertical orientation', () => {
    render(
      <Separator orientation="vertical" decorative={false}>
        Text
      </Separator>
    );
    const separator = screen.getByRole('separator');
    expect(separator).toHaveClass('h-full');
    expect(separator.querySelector('.flex-col')).toBeInTheDocument();
  });

  it('handles decorative attribute', () => {
    const { container } = render(<Separator decorative={true} />);
    const separator = container.querySelector('[role="separator"]');
    expect(separator).toHaveAttribute('aria-hidden', 'true');
  });
});
