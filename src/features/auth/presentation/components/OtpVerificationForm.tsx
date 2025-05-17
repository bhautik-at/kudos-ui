import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
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

// Validation schema for the OTP verification form
const otpFormSchema = z.object({
  otp: z
    .string()
    .min(4, 'OTP must be 4 digits')
    .max(4, 'OTP must be 4 digits')
    .regex(/^\d+$/, 'OTP must contain only digits'),
});

type OtpFormValues = z.infer<typeof otpFormSchema>;

export const OtpVerificationForm = () => {
  const router = useRouter();
  const { verifyOtp, resendOtp, isLoading, clearError, currentEmail, isSignup } = useAuth();
  const [cooldownTime, setCooldownTime] = useState<number>(0);
  const [canResend, setCanResend] = useState<boolean>(false);

  const form = useForm<OtpFormValues>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: {
      otp: '',
    },
  });

  useEffect(() => {
    // Set initial resend capability
    setCanResend(true);
  }, []);

  useEffect(() => {
    // Cooldown timer for resend button
    if (cooldownTime <= 0) {
      setCanResend(true);
      return;
    }

    const timer = setTimeout(() => {
      setCooldownTime(cooldownTime - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [cooldownTime]);

  const onSubmit = async (values: OtpFormValues) => {
    clearError();
    try {
      console.log('Verifying OTP...');
      const result = await verifyOtp(currentEmail, values.otp);

      if (result.success) {
        console.log('OTP verification successful, preparing to navigate to dashboard...');
        toastService.success('Verification Successful', 'Redirecting to dashboard...');

        // Add a short delay to ensure auth state is updated
        // and toast is displayed before navigation
        setTimeout(() => {
          console.log('Navigating to dashboard now...');

          // Try both navigation methods for maximum reliability
          try {
            router.push('/dashboard');

            // As a fallback, also use window.location after a slight delay
            // if router.push doesn't work
            setTimeout(() => {
              console.log('Fallback navigation with window.location...');
              window.location.href = '/dashboard';
            }, 500);
          } catch (navError) {
            console.error('Router navigation failed, using direct location:', navError);
            window.location.href = '/dashboard';
          }
        }, 1000);
      } else {
        console.log('OTP verification failed:', result.message);
        toastService.error('Verification Failed', result.message);
      }
    } catch (err: any) {
      const errorMessage = err.message || 'An unexpected error occurred';
      console.error('OTP verification error:', err);
      toastService.error('Verification Error', errorMessage);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;

    clearError();
    setCanResend(false);

    try {
      const result = await resendOtp(currentEmail);

      if (!result.success) {
        toastService.error('Resend Failed', result.message);
      } else {
        toastService.success('OTP Resent', 'A new OTP has been sent to your email');
        if (result.cooldownSeconds) {
          setCooldownTime(result.cooldownSeconds);
        } else {
          // Default cooldown if not specified by server
          setCooldownTime(60);
        }
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to resend OTP';
      toastService.error('Resend Error', errorMessage);
      setCanResend(true);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Verify OTP</h1>
        <p className="text-gray-500">We've sent a 4-digit code to {currentEmail}</p>
        <p className="text-sm text-gray-500">
          {isSignup
            ? 'Enter the code to complete your registration'
            : 'Enter the code to login to your account'}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="otp" required>
                  OTP Code
                </Label>
                <FormControl>
                  <Input
                    id="otp"
                    placeholder="Enter 4-digit code"
                    maxLength={4}
                    error={!!form.formState.errors.otp}
                    disabled={isLoading}
                    {...field}
                    onChange={e => {
                      // Allow only digits
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      field.onChange(value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Verifying...' : 'Verify OTP'}
          </Button>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-500">Didn't receive the code?</p>
            <button
              type="button"
              className={`text-sm mt-1 ${
                canResend
                  ? 'text-blue-600 hover:underline cursor-pointer'
                  : 'text-gray-400 cursor-not-allowed'
              }`}
              onClick={handleResendOtp}
              disabled={!canResend}
            >
              {canResend ? 'Resend OTP' : `Resend OTP in ${cooldownTime} seconds`}
            </button>
          </div>
        </form>
      </Form>
    </div>
  );
};
