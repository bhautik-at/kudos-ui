import { useAuth } from '../contexts/AuthContext';
import { SignupForm } from './SignupForm';
import { LoginForm } from './LoginForm';
import { OtpVerificationForm } from './OtpVerificationForm';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { httpService } from '@/shared/services/http/HttpService';

interface AuthFormContainerProps {
  initialForm: 'signup' | 'login';
}

export const AuthFormContainer = ({ initialForm }: AuthFormContainerProps) => {
  const { awaitingOtpVerification } = useAuth();
  const router = useRouter();

  // Extract query parameters
  const invite = router.query.invite as string | undefined;
  const orgId = router.query.orgId as string | undefined;

  // When this component mounts, we're on an auth page, so clear auth state
  useEffect(() => {
    // Clear auth token to prevent API calls
    httpService.clearAuthToken();

    // Check for user ID in localStorage
    if (typeof window !== 'undefined') {
      const userId = localStorage.getItem('kudos_user_id');
      if (userId) {
        // User is already logged in, redirect to dashboard with query params
        const queryParams = new URLSearchParams();
        if (invite) queryParams.append('invite', invite);
        if (orgId) queryParams.append('orgId', orgId);

        const queryString = queryParams.toString();
        const redirectUrl = queryString ? `/dashboard?${queryString}` : '/dashboard';

        router.replace(redirectUrl);
      }
    }
  }, [router, invite, orgId]);

  // Show OTP verification form if we're awaiting OTP verification
  if (awaitingOtpVerification) {
    return <OtpVerificationForm />;
  }

  // Show either login or signup form based on the initialForm prop
  // and pass along any query parameters
  return initialForm === 'signup' ? (
    <SignupForm invite={invite} orgId={orgId} />
  ) : (
    <LoginForm invite={invite} orgId={orgId} />
  );
};
