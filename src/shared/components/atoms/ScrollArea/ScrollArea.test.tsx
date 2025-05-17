import { render, screen } from '@testing-library/react';

import { ScrollArea } from './index';

describe('ScrollArea', () => {
  it('should render scrollable content', () => {
    render(
      <ScrollArea className="h-40 w-40" data-testid="scroll-area">
        <div style={{ height: '200px', width: '100%' }}>Content that should scroll</div>
      </ScrollArea>
    );

    const scrollArea = screen.getByTestId('scroll-area');
    expect(scrollArea).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    render(
      <ScrollArea className="custom-class" data-testid="scroll-area">
        <div>Content</div>
      </ScrollArea>
    );

    const scrollArea = screen.getByTestId('scroll-area');
    expect(scrollArea).toHaveClass('custom-class');
  });

  it('should render children correctly', () => {
    render(
      <ScrollArea>
        <div data-testid="scroll-content">Test content</div>
      </ScrollArea>
    );

    const content = screen.getByTestId('scroll-content');
    expect(content).toBeInTheDocument();
    expect(content.textContent).toBe('Test content');
  });
});
