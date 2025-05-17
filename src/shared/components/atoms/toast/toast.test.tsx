import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { ReactElement, ReactNode } from 'react';

// Mock the shadcn components for testing
jest.mock('@/components/ui/toast', () => ({
  Toast: ({
    children,
    className,
    variant,
    ...props
  }: {
    children: ReactNode;
    className?: string;
    variant?: string;
    [key: string]: any;
  }) => (
    <div data-testid="toast" data-variant={variant} className={className} {...props}>
      {children}
    </div>
  ),
  ToastTitle: ({ children, ...props }: { children: ReactNode; [key: string]: any }) => (
    <div data-testid="toast-title" {...props}>
      {children}
    </div>
  ),
  ToastDescription: ({ children, ...props }: { children: ReactNode; [key: string]: any }) => (
    <div data-testid="toast-description" {...props}>
      {children}
    </div>
  ),
  ToastAction: ({
    children,
    altText,
    ...props
  }: {
    children: ReactNode;
    altText: string;
    [key: string]: any;
  }) => (
    <button data-testid="toast-action" data-alt-text={altText} {...props}>
      {children}
    </button>
  ),
  ToastClose: () => <button data-testid="toast-close">Close</button>,
  ToastProvider: ({ children }: { children: ReactNode }) => (
    <div data-testid="toast-provider">{children}</div>
  ),
  ToastViewport: ({ children }: { children: ReactNode }) => (
    <div data-testid="toast-viewport">{children}</div>
  ),
}));

import {
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
  ToastProvider,
} from './index';

describe('Toast Component', () => {
  // Rendering test
  it('renders content correctly', () => {
    const { getByTestId, getByText } = render(
      <Toast>
        <div>Test Toast Content</div>
      </Toast>
    );
    expect(getByTestId('toast')).toBeInTheDocument();
    expect(getByText('Test Toast Content')).toBeInTheDocument();
  });

  // Props test
  it('forwards props to the underlying toast component', () => {
    const { getByTestId } = render(<Toast data-foo="test-value">Test Toast</Toast>);
    expect(getByTestId('toast')).toHaveAttribute('data-foo', 'test-value');
  });

  // Custom behavior test
  it('applies custom variant classes for success variant', () => {
    const { getByTestId } = render(<Toast variant="success">Success Toast</Toast>);
    const toast = getByTestId('toast');
    expect(toast).toHaveClass('bg-emerald-50');
    expect(toast).toHaveClass('border-emerald-500');
  });

  it('applies custom variant classes for warning variant', () => {
    const { getByTestId } = render(<Toast variant="warning">Warning Toast</Toast>);
    const toast = getByTestId('toast');
    expect(toast).toHaveClass('bg-amber-50');
    expect(toast).toHaveClass('border-amber-500');
  });

  it('applies custom variant classes for info variant', () => {
    const { getByTestId } = render(<Toast variant="info">Info Toast</Toast>);
    const toast = getByTestId('toast');
    expect(toast).toHaveClass('bg-blue-50');
    expect(toast).toHaveClass('border-blue-500');
  });

  it('uses destructive variant for destructive toast', () => {
    const { getByTestId } = render(<Toast variant="destructive">Destructive Toast</Toast>);
    const toast = getByTestId('toast');
    // Here we'd check for the destructive variant properties
    // Since we're using shadcn, the actual classes may vary
    expect(toast).toHaveAttribute('data-variant', 'destructive');
  });
});

describe('Toast Sub-Components', () => {
  it('renders ToastTitle correctly', () => {
    const { getByTestId, getByText } = render(<ToastTitle>Test Title</ToastTitle>);
    expect(getByTestId('toast-title')).toBeInTheDocument();
    expect(getByText('Test Title')).toBeInTheDocument();
  });

  it('renders ToastDescription correctly', () => {
    const { getByTestId, getByText } = render(
      <ToastDescription>Test Description</ToastDescription>
    );
    expect(getByTestId('toast-description')).toBeInTheDocument();
    expect(getByText('Test Description')).toBeInTheDocument();
  });

  it('renders ToastAction correctly', () => {
    const { getByTestId, getByText } = render(
      <ToastAction altText="Test Action">Test Action</ToastAction>
    );
    expect(getByTestId('toast-action')).toBeInTheDocument();
    expect(getByText('Test Action')).toBeInTheDocument();
  });

  it('composes all components correctly', () => {
    const { getByTestId, getByText } = render(
      <Toast>
        <ToastTitle>Test Title</ToastTitle>
        <ToastDescription>Test Description</ToastDescription>
        <ToastAction altText="Action">Action</ToastAction>
        <ToastClose />
      </Toast>
    );

    const toast = getByTestId('toast');
    expect(getByTestId('toast-title')).toBeInTheDocument();
    expect(getByTestId('toast-description')).toBeInTheDocument();
    expect(getByTestId('toast-action')).toBeInTheDocument();
    expect(getByTestId('toast-close')).toBeInTheDocument();
    expect(getByText('Test Title')).toBeInTheDocument();
    expect(getByText('Test Description')).toBeInTheDocument();
    expect(getByText('Action')).toBeInTheDocument();
  });
});
