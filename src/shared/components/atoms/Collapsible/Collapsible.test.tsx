import { render, screen } from '@testing-library/react';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './index';

describe('Collapsible', () => {
  it('should render collapsible component', () => {
    render(
      <Collapsible>
        <CollapsibleTrigger data-testid="collapsible-trigger">Toggle</CollapsibleTrigger>
        <CollapsibleContent>Collapsible content</CollapsibleContent>
      </Collapsible>
    );

    const trigger = screen.getByTestId('collapsible-trigger');
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveTextContent('Toggle');
  });

  it('should apply custom className to collapsible content', () => {
    render(
      <Collapsible open>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent className="custom-content-class" data-testid="collapsible-content">
          Collapsible content
        </CollapsibleContent>
      </Collapsible>
    );

    expect(screen.getByTestId('collapsible-content')).toHaveClass('custom-content-class');
  });

  it('should apply custom className to trigger', () => {
    render(
      <Collapsible>
        <CollapsibleTrigger className="custom-trigger-class" data-testid="collapsible-trigger">
          Toggle
        </CollapsibleTrigger>
        <CollapsibleContent>Collapsible content</CollapsibleContent>
      </Collapsible>
    );

    expect(screen.getByTestId('collapsible-trigger')).toHaveClass('custom-trigger-class');
  });
});
