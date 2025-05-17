import { render, screen } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import React from 'react';

// Mock the shadcn form components before importing our components
jest.mock('@/components/ui/form', () => ({
  Form: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="shadcn-form">{children}</div>
  ),
  FormField: ({ render }: { render: (props: any) => React.ReactNode }) =>
    render({ field: { value: '', onChange: jest.fn() } }),
  FormItem: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="form-item">{children}</div>
  ),
  FormLabel: ({ children }: { children: React.ReactNode }) => (
    <label data-testid="form-label">{children}</label>
  ),
  FormControl: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="form-control">{children}</div>
  ),
  FormMessage: ({ children }: { children: React.ReactNode }) => (
    <p data-testid="form-message">{children}</p>
  ),
  useFormField: () => ({
    id: 'test-id',
    name: 'test-name',
    formItemId: 'test-form-item-id',
    formDescriptionId: 'test-description-id',
    formMessageId: 'test-message-id',
  }),
}));

// Now import our components after mocking
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from './index';

// Test schema for the form
const testSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
});

// Test form component
const TestForm = () => {
  const form = useForm<z.infer<typeof testSchema>>({
    resolver: zodResolver(testSchema),
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = (data: z.infer<typeof testSchema>) => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} data-testid="test-form">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <input {...field} data-testid="name-input" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <button type="submit">Submit</button>
      </form>
    </Form>
  );
};

// Mock react-hook-form
jest.mock('react-hook-form', () => ({
  useForm: jest.fn(() => ({
    handleSubmit: jest.fn(callback => jest.fn()),
    control: {},
    formState: { errors: {} },
  })),
}));

jest.mock('@hookform/resolvers/zod', () => ({
  zodResolver: jest.fn(() => jest.fn()),
}));

describe('Form Component', () => {
  it('renders the form component', () => {
    render(<TestForm />);
    expect(screen.getByTestId('test-form')).toBeInTheDocument();
  });

  it('renders form elements correctly', () => {
    render(<TestForm />);
    expect(screen.getByTestId('form-label')).toHaveTextContent('Name');
    expect(screen.getByTestId('name-input')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });
});
