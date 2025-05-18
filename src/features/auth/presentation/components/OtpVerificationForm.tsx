import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '@/features/users/presentation/contexts/UserContext';
import { Button } from '@/shared/components/atoms/Button';
import { Input } from '@/shared/components/atoms/Input';
import { Label } from '@/shared/components/atoms/Label';
import { toastService } from '@/shared/services/toast';
import { AcceptInvitation } from '@/features/users/presentation/components/AcceptInvitation';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/shared/components/atoms/Form';
import { Loader2, KeyRound, AlertCircle } from 'lucide-react';

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
  const { verifyOtp, resendOtp, isAuthLoading, clearError, currentEmail, isSignup } = useAuth();
  const { setUserFromAuth } = useUser();
  const [cooldownTime, setCooldownTime] = useState<number>(0);
  const [canResend, setCanResend] = useState<boolean>(false);
  const [showAcceptInvitation, setShowAcceptInvitation] = useState(false);
  const [verifiedOrgId, setVerifiedOrgId] = useState<string | null>(null);
  const [attemptCount, setAttemptCount] = useState<number>(0);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  // Get orgId and invite from URL
  const orgId = router.query.orgId as string | undefined;

  // Store orgId in localStorage when component loads
  useEffect(() => {
    if (orgId) {
      localStorage.setItem('kudos_invite_orgId', orgId);
    }
  }, [orgId]);

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

  useEffect(() => {
    if (attemptCount >= 3) {
      toastService.error('Too many failed attempts. Redirecting to home page.');
      setVerificationError('Too many failed attempts. Redirecting to home page.');

      // Redirect to root route after a short delay
      const timer = setTimeout(() => {
        window.location.href = '/';
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [attemptCount]);

  const onSubmit = async (values: OtpFormValues) => {
    clearError();
    try {
      // Increment attempt count when verifying OTP
      const newAttemptCount = attemptCount + 1;
      setAttemptCount(newAttemptCount);

      const result = await verifyOtp(currentEmail, values.otp);

      if (result.success) {
        toastService.success('Verification Successful - Redirecting...');

        // Set user in UserContext if user data is present
        if (result.user) {
          setUserFromAuth(result.user);
        }

        // Store userId in localStorage if available
        if (result.user?.id) {
          localStorage.setItem('kudos_user_id', result.user.id);
        }

        // Navigation logic
        if (orgId) {
          // If we have an orgId, show the invitation acceptance screen
          setVerifiedOrgId(orgId);
          setShowAcceptInvitation(true);
        } else if (isSignup) {
          // New user - redirect to organization creation
          window.location.href = '/organization';
        } else {
          // Existing user - redirect to organization selection
          window.location.href = '/organizations';
        }
      } else {
        // Show remaining attempts
        const attemptsLeft = 3 - newAttemptCount;
        if (attemptsLeft > 0) {
          toastService.error(
            `Verification Failed: ${result.message}. Attempts remaining: ${attemptsLeft}`
          );
        } else {
          toastService.error(`Verification Failed: ${result.message}.`);
        }
      }
    } catch (err: any) {
      const errorMessage = err.message || 'An unexpected error occurred';
      toastService.error(`Verification Error: ${errorMessage}`);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;

    clearError();
    setVerificationError(null);
    setCanResend(false);

    try {
      const result = await resendOtp(currentEmail);

      if (!result.success) {
        setVerificationError(`Resend Failed: ${result.message}`);
        toastService.error(`Resend Failed: ${result.message}`);
      } else {
        toastService.success('A new OTP has been sent to your email');
        if (result.cooldownSeconds) {
          setCooldownTime(result.cooldownSeconds);
        } else {
          // Default cooldown if not specified by server
          setCooldownTime(60);
        }
        // Reset attempt counter when new OTP is sent
        setAttemptCount(0);
      }
    } catch (err: any) {
      const errorMessage = err.message || 'An unexpected error occurred';
      setVerificationError(`Resend Error: ${errorMessage}`);
      toastService.error(`Resend Error: ${errorMessage}`);
      setCanResend(true);
    }
  };

  const handleInvitationSuccess = (orgId: string) => {
    // Redirect to dashboard with the orgId parameter after successful acceptance
    window.location.href = `/dashboard?orgId=${orgId}`;

    // Clean up localStorage
    localStorage.removeItem('kudos_invite_orgId');
  };

  const handleInvitationError = () => {
    // If invitation acceptance fails, go back to regular navigation
    if (isSignup) {
      window.location.href = '/organization';
    } else {
      window.location.href = '/organizations';
    }
  };

  if (showAcceptInvitation && verifiedOrgId) {
    return (
      <div className="w-full max-w-md mx-auto">
        <AcceptInvitation
          organizationId={verifiedOrgId}
          onSuccess={handleInvitationSuccess}
          onError={handleInvitationError}
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-4">
              <KeyRound className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold">Verify OTP</h1>
            <p className="text-white/80 mt-2">
              We've sent a 4-digit code to <span className="font-semibold">{currentEmail}</span>
            </p>
            <p className="text-white/70 text-sm mt-1">
              {isSignup
                ? 'Enter the code to complete your registration'
                : 'Enter the code to login to your account'}
            </p>
          </div>
        </div>

        <div className="p-6">
          {attemptCount > 0 && attemptCount < 3 && (
            <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg flex items-start">
              <AlertCircle className="h-5 w-5 text-amber-500 dark:text-amber-400 mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-sm text-amber-600 dark:text-amber-400">
                Attempts remaining: {3 - attemptCount}
              </p>
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="otp" required className="text-gray-700 dark:text-gray-300">
                      OTP Code
                    </Label>
                    <FormControl>
                      <div className="relative">
                        <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <Input
                          id="otp"
                          placeholder="Enter 4-digit code"
                          maxLength={4}
                          className={`pl-10 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center font-medium text-lg tracking-wider ${
                            !!form.formState.errors.otp ? 'border-red-500' : ''
                          }`}
                          error={!!form.formState.errors.otp}
                          disabled={isAuthLoading || attemptCount >= 3}
                          {...field}
                          onChange={e => {
                            // Allow only digits
                            const value = e.target.value.replace(/[^0-9]/g, '');
                            field.onChange(value);
                          }}
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
                disabled={isAuthLoading || attemptCount >= 3}
              >
                {isAuthLoading ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </span>
                ) : (
                  'Verify OTP'
                )}
              </Button>

              <div className="text-center mt-6">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  Didn't receive the code?
                </p>
                <button
                  type="button"
                  className={`text-sm py-2 px-4 rounded-md transition-colors ${
                    canResend && attemptCount < 3
                      ? 'text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                      : 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  }`}
                  onClick={handleResendOtp}
                  disabled={!canResend || attemptCount >= 3}
                >
                  {canResend ? 'Resend OTP' : `Resend OTP in ${cooldownTime}s`}
                </button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};
