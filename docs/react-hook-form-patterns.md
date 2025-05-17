# React Hook Form Best Practices

## Overview

This document outlines the recommended patterns for implementing forms using React Hook Form in our application. Following these guidelines will ensure consistency, maintainability, and optimal user experience across all forms.

## Form Setup

### Basic Form Structure

```tsx
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { useForm } from 'react-hook-form';

// 1. Define schema for type safety and validation
const formSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  email: z.string().email('Invalid email format'),
  // Other fields...
});

// 2. Create TypeScript type from schema
type FormValues = z.infer<typeof formSchema>;

export const MyForm = () => {
  // 3. Initialize form with validation resolver
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
    setError,
    clearErrors,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      // Initial values for other fields...
    },
  });

  // 4. Form submission handler
  const onSubmit = async (data: FormValues) => {
    try {
      // API call or data processing
      await api.submitData(data);

      // Reset form or navigate away
      reset();
    } catch (err) {
      // Handle API errors by setting form errors
      if (err.field) {
        setError(err.field, {
          type: 'server',
          message: err.message,
        });
      } else {
        setError('root', {
          type: 'server',
          message: 'Failed to submit form. Please try again.',
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Form fields with validation */}
      <FormField
        label="Name"
        {...register('name')}
        error={!!errors.name}
        errorMessage={errors.name?.message}
        required
      />

      <FormField
        label="Email"
        {...register('email')}
        error={!!errors.email}
        errorMessage={errors.email?.message}
        required
      />

      {/* Display root error messages */}
      {errors.root && <div className="text-destructive">{errors.root.message}</div>}

      {/* Submit button with loading state */}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </Button>
    </form>
  );
};
```

## Validation Strategies

### Field-Level Validation

Use field-level validation for simple rules:

```tsx
<FormField
  label="Username"
  {...register('username', {
    required: 'Username is required',
    minLength: {
      value: 3,
      message: 'Username must be at least 3 characters',
    },
    pattern: {
      value: /^[a-zA-Z0-9_]+$/,
      message: 'Username can only contain letters, numbers and underscore',
    },
  })}
  error={!!errors.username}
  errorMessage={errors.username?.message}
/>
```

### Schema Validation with Zod

For complex validation including conditional rules, use Zod:

```tsx
// Complex validation schema
const userSchema = z.object({
  accountType: z.enum(['personal', 'business']),
  email: z.string().email('Invalid email address'),
  // Conditional validation based on account type
  businessName: z
    .string()
    .optional()
    .refine(val => (accountType === 'business' ? !!val : true), {
      message: 'Business name is required for business accounts',
    }),
  // ...other fields
});
```

## Conditional Field Rendering

Watch for field values to conditionally show/hide other fields:

```tsx
const Form = () => {
  const { register, watch, formState } = useForm();

  // Watch specific fields for conditional rendering
  const accountType = watch('accountType');

  return (
    <form>
      {/* Account type selection */}
      <Select label="Account Type" {...register('accountType')}>
        <option value="personal">Personal</option>
        <option value="business">Business</option>
      </Select>

      {/* Conditionally render based on selection */}
      {accountType === 'business' && (
        <FormField
          label="Business Name"
          {...register('businessName', {
            required: 'Business name is required',
          })}
          error={!!formState.errors.businessName}
          errorMessage={formState.errors.businessName?.message}
        />
      )}
    </form>
  );
};
```

## Error Handling

### Form Error Handling

Handle errors appropriately in your forms:

```tsx
// Handling API errors in the submission handler
const onSubmit = async data => {
  try {
    await api.submitForm(data);
    // Success handling
  } catch (err) {
    // Set a general form error
    setError('root', {
      type: 'server',
      message: 'Failed to submit. Please try again.',
    });

    // Or set field-specific errors
    if (err.field) {
      setError(err.field, {
        type: 'server',
        message: err.message,
      });
    }
  }
};
```

## Performance Tips

1. **Memoize Event Handlers**: Use `useCallback` for event handlers to prevent unnecessary rerenders.

2. **Controlled vs Uncontrolled**: React Hook Form uses uncontrolled components by default for better performance. Only use controlled components when necessary.

3. **Form Resetting**: Use the `reset` function for resetting forms instead of manually clearing fields.

4. **Field Arrays**: For dynamic form fields, use the `useFieldArray` hook.

## Common Patterns

### Multi-Step Forms

Use the `useFormContext` hook to share form state across multiple components:

```tsx
const FormProvider = () => {
  const methods = useForm();

  return (
    <FormProvider {...methods}>
      {/* Form steps go here */}
      {currentStep === 1 && <StepOne />}
      {currentStep === 2 && <StepTwo />}
      {/* Navigation buttons */}
    </FormProvider>
  );
};

const StepOne = () => {
  const { register, formState } = useFormContext();

  return (
    <>
      <FormField {...register('firstName')} />
      {/* More fields */}
    </>
  );
};
```

### Form Arrays

For dynamic fields, use `useFieldArray`:

```tsx
const { control, register } = useForm();
const { fields, append, remove } = useFieldArray({
  control,
  name: 'items',
});

return (
  <form>
    {fields.map((field, index) => (
      <div key={field.id}>
        <FormField {...register(`items.${index}.name`)} />
        <Button onClick={() => remove(index)}>Remove</Button>
      </div>
    ))}
    <Button onClick={() => append({ name: '' })}>Add Item</Button>
  </form>
);
```

## Conclusion

Following these patterns will ensure consistent form implementation across the application while leveraging React Hook Form's capabilities for validation, error handling, and performance optimization.

When implementing new forms, prefer schema-based validation with Zod and avoid manual validation in submission handlers unless dealing with server-side validation that cannot be predicted client-side.
