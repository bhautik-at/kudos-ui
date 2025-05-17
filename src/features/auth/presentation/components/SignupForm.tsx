import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../contexts/AuthContext';
import { useAuthNavigation } from '../hooks/useAuthNavigation';
import { Button } from '@/shared/components/atoms/Button';
import { Input } from '@/shared/components/atoms/Input';
import { Label } from '@/shared/components/atoms/Label';
import { toastService } from '@/shared/services/toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/shared/components/atoms/Form';

// Validation schema for the signup form
const signupFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email'),
});

type SignupFormValues = z.infer<typeof signupFormSchema>;

interface SignupFormProps {
  invite?: string;
  orgId?: string;
}

export const SignupForm = ({ invite, orgId }: SignupFormProps) => {
  const { signup, isAuthLoading, clearError } = useAuth();
  const { navigateToLogin } = useAuthNavigation();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
    },
  });

  const onSubmit = async (values: SignupFormValues) => {
    clearError();
    try {
      const result = await signup(values.email, values.firstName, values.lastName);

      if (result.success) {
        toastService.success('Signup Successful - OTP has been sent to your email');
      } else {
        toastService.error(`Signup Failed: ${result.message}`);
      }
    } catch (err: any) {
      const errorMessage = err.message || 'An unexpected error occurred';
      toastService.error(`Signup Error: ${errorMessage}`);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Sign Up</h1>
        <p className="text-gray-500">Enter your information to create an account</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="firstName" required>
                  First Name
                </Label>
                <FormControl>
                  <Input
                    id="firstName"
                    placeholder="Enter your first name"
                    error={!!form.formState.errors.firstName}
                    disabled={isAuthLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="lastName" required>
                  Last Name
                </Label>
                <FormControl>
                  <Input
                    id="lastName"
                    placeholder="Enter your last name"
                    error={!!form.formState.errors.lastName}
                    disabled={isAuthLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="email" required>
                  Email
                </Label>
                <FormControl>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    error={!!form.formState.errors.email}
                    disabled={isAuthLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isAuthLoading}>
            {isAuthLoading ? 'Signing up...' : 'Sign Up'}
          </Button>

          <div className="text-center text-sm mt-4">
            <span className="text-gray-500">Already have an account?</span>{' '}
            <button
              type="button"
              className="text-blue-600 hover:underline"
              onClick={() => navigateToLogin(invite, orgId)}
            >
              Log in
            </button>
          </div>
        </form>
      </Form>
    </div>
  );
};
