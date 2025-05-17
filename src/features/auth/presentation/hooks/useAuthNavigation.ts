import { useCallback } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';

export function useAuthNavigation() {
  const { clearError } = useAuth();
  const router = useRouter();

  const navigateToSignup = useCallback(
    (invite?: string, orgId?: string) => {
      clearError();
      const query: { [key: string]: string } = {};
      if (invite) query.invite = invite;
      if (orgId) query.orgId = orgId;

      router.push({
        pathname: '/signup',
        query,
      });
    },
    [clearError, router]
  );

  const navigateToLogin = useCallback(
    (invite?: string, orgId?: string) => {
      clearError();
      const query: { [key: string]: string } = {};
      if (invite) query.invite = invite;
      if (orgId) query.orgId = orgId;

      router.push({
        pathname: '/',
        query,
      });
    },
    [clearError, router]
  );

  return {
    navigateToSignup,
    navigateToLogin,
  };
}
