import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { Toaster } from './index';
import * as useToastModule from '@/components/hooks/use-toast';

// Mock the useToast hook
jest.mock('@/components/hooks/use-toast', () => ({
  useToast: jest.fn(),
}));

describe('Toaster Component', () => {
  beforeEach(() => {
    // Reset the mock before each test
    jest.clearAllMocks();

    // Default mock implementation
    jest.spyOn(useToastModule, 'useToast').mockReturnValue({
      toasts: [],
      toast: jest.fn(),
      dismiss: jest.fn(),
    } as any);
  });

  it('renders without crashing', () => {
    const { container } = render(<Toaster />);
    expect(container).toBeInTheDocument();
  });

  it('renders toasts from the useToast hook', () => {
    // Mock toasts array
    jest.spyOn(useToastModule, 'useToast').mockReturnValue({
      toasts: [
        {
          id: '1',
          title: 'Test Toast Title',
          description: 'Test Toast Description',
          open: true,
        },
      ],
      toast: jest.fn(),
      dismiss: jest.fn(),
    } as any);

    const { getByText } = render(<Toaster />);

    expect(getByText('Test Toast Title')).toBeInTheDocument();
    expect(getByText('Test Toast Description')).toBeInTheDocument();
  });

  it('renders multiple toasts', () => {
    // Mock toasts array with multiple items
    jest.spyOn(useToastModule, 'useToast').mockReturnValue({
      toasts: [
        {
          id: '1',
          title: 'First Toast',
          description: 'First Description',
          open: true,
        },
        {
          id: '2',
          title: 'Second Toast',
          description: 'Second Description',
          open: true,
        },
      ],
      toast: jest.fn(),
      dismiss: jest.fn(),
    } as any);

    const { getByText } = render(<Toaster />);

    expect(getByText('First Toast')).toBeInTheDocument();
    expect(getByText('First Description')).toBeInTheDocument();
    expect(getByText('Second Toast')).toBeInTheDocument();
    expect(getByText('Second Description')).toBeInTheDocument();
  });
});
