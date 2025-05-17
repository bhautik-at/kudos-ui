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

  // When this component mounts, we're on an auth page, so clear auth state
  useEffect(() => {
    // Clear auth token to prevent API calls
    httpService.clearAuthToken();

    // Check for user ID in localStorage
    if (typeof window !== 'undefined') {
      const userId = localStorage.getItem('kudos_user_id');
      if (userId) {
        // User is already logged in, redirect to dashboard
        router.replace('/dashboard');
      }
    }
  }, [router]);

  // Show OTP verification form if we're awaiting OTP verification
  if (awaitingOtpVerification) {
    return <OtpVerificationForm />;
  }

  // Show either login or signup form based on the initialForm prop
  return initialForm === 'signup' ? <SignupForm /> : <LoginForm />;
};
