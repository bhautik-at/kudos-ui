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
import { Loader2, UserPlus, User, Mail } from 'lucide-react';

// Validation schema for the signup form
const signupFormSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(40, 'First name cannot exceed 40 characters'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(40, 'Last name cannot exceed 40 characters'),
  email: z.string().min(1, 'Email is required').email('Please enter a valid email'),
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
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-4">
              <UserPlus className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold">Sign Up</h1>
            <p className="text-white/80 mt-2">Sign up to nurture a culture of gratitude</p>
          </div>
        </div>

        <div className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <Label
                      htmlFor="firstName"
                      required
                      className="text-gray-700 dark:text-gray-300"
                    >
                      First Name
                    </Label>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <Input
                          id="firstName"
                          placeholder="Enter your first name"
                          className={`pl-10 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            !!form.formState.errors.firstName ? 'border-red-500' : ''
                          }`}
                          error={!!form.formState.errors.firstName}
                          disabled={isAuthLoading}
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm mt-1" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="lastName" required className="text-gray-700 dark:text-gray-300">
                      Last Name
                    </Label>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <Input
                          id="lastName"
                          placeholder="Enter your last name"
                          className={`pl-10 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            !!form.formState.errors.lastName ? 'border-red-500' : ''
                          }`}
                          error={!!form.formState.errors.lastName}
                          disabled={isAuthLoading}
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm mt-1" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="email" required className="text-gray-700 dark:text-gray-300">
                      Email
                    </Label>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          className={`pl-10 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            !!form.formState.errors.email ? 'border-red-500' : ''
                          }`}
                          error={!!form.formState.errors.email}
                          disabled={isAuthLoading}
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm mt-1" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg shadow-md transition-all"
                disabled={isAuthLoading}
              >
                {isAuthLoading ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing up...
                  </span>
                ) : (
                  'Sign Up'
                )}
              </Button>

              <div className="text-center mt-6">
                <span className="text-gray-500 dark:text-gray-400">Already have an account?</span>{' '}
                <button
                  type="button"
                  className="text-blue-600 dark:text-blue-400 font-medium hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                  onClick={() => navigateToLogin(invite, orgId)}
                >
                  Log in
                </button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};
