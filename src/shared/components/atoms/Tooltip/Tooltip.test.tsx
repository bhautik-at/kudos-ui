import { render, screen } from '@testing-library/react';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './index';

describe('Tooltip', () => {
  it('should render tooltip trigger', () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger data-testid="tooltip-trigger">Hover me</TooltipTrigger>
          <TooltipContent>Tooltip text</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    const trigger = screen.getByTestId('tooltip-trigger');
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveTextContent('Hover me');
  });

  it('should apply custom class names', () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger data-testid="tooltip-trigger" className="custom-trigger-class">
            Hover me
          </TooltipTrigger>
          <TooltipContent className="custom-content-class">Tooltip text</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    const trigger = screen.getByTestId('tooltip-trigger');
    expect(trigger).toHaveClass('custom-trigger-class');
  });
});
