import { useCallback } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';

export function useAuthNavigation() {
  const { clearError } = useAuth();
  const router = useRouter();

  const navigateToSignup = useCallback(() => {
    clearError();
    router.push('/signup');
  }, [clearError, router]);

  const navigateToLogin = useCallback(() => {
    clearError();
    router.push('/');
  }, [clearError, router]);

  return {
    navigateToSignup,
    navigateToLogin,
  };
}
