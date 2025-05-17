import { render, screen } from '@testing-library/react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from './index';

describe('Tabs', () => {
  it('should render tabs with correct content', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Tab 1 content</TabsContent>
        <TabsContent value="tab2">Tab 2 content</TabsContent>
      </Tabs>
    );

    // Check that tab triggers are rendered
    expect(screen.getByRole('tab', { name: 'Tab 1' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Tab 2' })).toBeInTheDocument();

    // Initial tab content should be visible
    expect(screen.getByText('Tab 1 content')).toBeInTheDocument();
  });

  it('should apply custom className to tabs components', () => {
    render(
      <Tabs defaultValue="tab1" className="custom-tabs-class">
        <TabsList className="custom-list-class" data-testid="tabs-list-test">
          <TabsTrigger
            className="custom-trigger-class"
            value="tab1"
            data-testid="custom-tabs-trigger"
          >
            Tab 1
          </TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent
          className="custom-content-class"
          value="tab1"
          data-testid="custom-tabs-content"
        >
          Tab 1 content
        </TabsContent>
        <TabsContent value="tab2">Tab 2 content</TabsContent>
      </Tabs>
    );

    expect(screen.getByTestId('tabs-list-test')).toHaveClass('custom-list-class');
    expect(screen.getByTestId('custom-tabs-trigger')).toHaveClass('custom-trigger-class');
    expect(screen.getByTestId('custom-tabs-content')).toHaveClass('custom-content-class');
  });
});
