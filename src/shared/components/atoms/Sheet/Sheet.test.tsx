import { fireEvent, render, screen } from '@testing-library/react';

import { createRef } from 'react';

import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from './index';

/**
 * Test suite for Sheet component
 * Tests rendering, interactions, props handling, and side variants
 */

// #region Test Utils
/**
 * Helper function to render Sheet component with various configurations
 */
const renderSheet = ({
  open,
  defaultOpen,
  side,
  contentProps = {},
  children,
}: {
  open?: boolean;
  defaultOpen?: boolean;
  side?: 'left' | 'right' | 'top' | 'bottom';
  contentProps?: Record<string, any>;
  children?: React.ReactNode;
} = {}) => {
  return render(
    <Sheet open={open} defaultOpen={defaultOpen}>
      <SheetTrigger data-testid="trigger">Open Sheet</SheetTrigger>
      <SheetContent data-testid="content" side={side} {...contentProps}>
        <SheetTitle>Sheet Title</SheetTitle>
        <SheetDescription>Description</SheetDescription>
        {children || <div>Content</div>}
      </SheetContent>
    </Sheet>
  );
};
// #endregion

describe('Sheet Component', () => {
  // #region Rendering Tests
  describe('Basic Rendering', () => {
    it('should render trigger and be initially closed', () => {
      // Render component
      renderSheet();

      // Verify initial state
      expect(screen.getByTestId('trigger')).toBeInTheDocument();
      expect(screen.queryByTestId('content')).not.toBeInTheDocument();
    });

    it('should render all parts when opened', async () => {
      // Render with custom content
      renderSheet({
        children: (
          <>
            <SheetTitle data-testid="title">Custom Title</SheetTitle>
            <SheetDescription data-testid="description">Custom Description</SheetDescription>
            <div>Custom Content</div>
          </>
        ),
      });

      // Open sheet
      fireEvent.click(screen.getByTestId('trigger'));

      // Verify all parts are rendered
      const content = await screen.findByTestId('content');
      expect(content).toBeInTheDocument();
      expect(screen.getByTestId('title')).toHaveTextContent('Custom Title');
      expect(screen.getByTestId('description')).toHaveTextContent('Custom Description');
    });
  });
  // #endregion

  // #region Interaction Tests
  describe('Interactions', () => {
    it('should open when trigger is clicked', async () => {
      // Render and trigger open
      renderSheet();
      fireEvent.click(screen.getByTestId('trigger'));

      // Verify sheet opens
      expect(await screen.findByTestId('content')).toBeInTheDocument();
    });

    it('should handle controlled open state', () => {
      // Render in open state
      const { rerender } = renderSheet({ open: true });
      expect(screen.getByTestId('content')).toBeInTheDocument();

      // Re-render in closed state
      rerender(
        <Sheet open={false}>
          <SheetContent data-testid="content">
            <SheetTitle>Sheet Title</SheetTitle>
            <SheetDescription>Description</SheetDescription>
            <div>Content</div>
          </SheetContent>
        </Sheet>
      );

      // Verify sheet closes
      expect(screen.queryByTestId('content')).not.toBeInTheDocument();
    });
  });
  // #endregion

  // #region Props Tests
  describe('Props and Attributes', () => {
    it('should forward ref to sheet content', async () => {
      // Setup ref
      const ref = createRef<HTMLDivElement>();

      // Render with ref
      render(
        <Sheet>
          <SheetTrigger data-testid="trigger">Open Sheet</SheetTrigger>
          <SheetContent ref={ref} data-testid="content">
            <SheetTitle>Sheet Title</SheetTitle>
            <SheetDescription>Description</SheetDescription>
          </SheetContent>
        </Sheet>
      );

      // Open sheet and verify ref
      fireEvent.click(screen.getByTestId('trigger'));
      await screen.findByTestId('content');
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('should pass through additional HTML attributes', async () => {
      // Render with custom attributes
      renderSheet({
        contentProps: {
          className: 'custom-class',
          'aria-label': 'Custom Sheet',
        },
      });

      // Open sheet and verify attributes
      fireEvent.click(screen.getByTestId('trigger'));
      const content = await screen.findByTestId('content');
      expect(content).toHaveClass('custom-class');
      expect(content).toHaveAttribute('aria-label', 'Custom Sheet');
    });
  });
  // #endregion

  // #region Side Variant Tests
  describe('Side Variants', () => {
    it('should render with left side variant', async () => {
      // Render with left side variant
      renderSheet({ defaultOpen: true, side: 'left' });
      const content = await screen.findByTestId('content');

      // Verify left side classes
      expect(content).toHaveClass('left-0');
      expect(content).toHaveClass('data-[state=closed]:slide-out-to-left');
      expect(content).toHaveClass('data-[state=open]:slide-in-from-left');
    });

    it('should render with right side variant', async () => {
      // Render with right side variant
      renderSheet({ defaultOpen: true, side: 'right' });
      const content = await screen.findByTestId('content');

      // Verify right side classes
      expect(content).toHaveClass('right-0');
      expect(content).toHaveClass('data-[state=closed]:slide-out-to-right');
      expect(content).toHaveClass('data-[state=open]:slide-in-from-right');
    });
  });
  // #endregion
});
