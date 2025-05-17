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

// Validation schema for the login form
const loginFormSchema = z.object({
  email: z.string().email('Please enter a valid email'),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export const LoginForm = () => {
  const { login, isAuthLoading, clearError } = useAuth();
  const { navigateToSignup } = useAuthNavigation();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    clearError();
    try {
      const result = await login(values.email);

      if (result.success) {
        toastService.success('Login Initiated', 'OTP has been sent to your email', {
          duration: 3000,
        });
      } else {
        toastService.error('Login Failed', result.message, { duration: 3000 });
      }
    } catch (err: any) {
      const errorMessage = err.message || 'An unexpected error occurred';
      toastService.error('Login Error', errorMessage, { duration: 3000 });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Log In</h1>
        <p className="text-gray-500">Enter your email to login to your account</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
            {isAuthLoading ? 'Logging in...' : 'Log In'}
          </Button>

          <div className="text-center text-sm mt-4">
            <span className="text-gray-500">Don't have an account?</span>{' '}
            <button
              type="button"
              className="text-blue-600 hover:underline"
              onClick={navigateToSignup}
            >
              Sign up
            </button>
          </div>
        </form>
      </Form>
    </div>
  );
};
