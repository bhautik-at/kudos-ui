import Head from 'next/head';
import { NextPage } from 'next';
import { AuthTemplate } from '@/features/auth/presentation/templates';
import { AuthFormContainer } from '@/features/auth/presentation/components';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { httpService } from '@/shared/services/http/HttpService';

const HomePage: NextPage = () => {
  const router = useRouter();

  // This runs on the login page, clear auth state immediately
  useEffect(() => {
    // Clear auth token to prevent API calls
    httpService.clearAuthToken();

    // Get query parameters
    const { orgId, invite } = router.query;

    // Check for user ID in localStorage
    if (typeof window !== 'undefined') {
      const userId = localStorage.getItem('kudos_user_id');

      if (userId) {
        // User is already logged in
        if (orgId) {
          // If we have an orgId parameter, store it and redirect to dashboard with the orgId
          router.replace(`/dashboard?orgId=${orgId}`);

          // Clean up localStorage after navigation
          setTimeout(() => {
            localStorage.removeItem('kudos_invite_orgId');
          }, 1000);
        } else {
          // No orgId parameter, just redirect to dashboard
          router.replace('/dashboard');
        }
      } else if (orgId) {
        // User not logged in but has orgId - store it for later use after login
        localStorage.setItem('kudos_invite_orgId', orgId as string);
      }
    }
  }, [router, router.query]);

  return (
    <>
      <Head>
        <title>Log In | Your App</title>
        <meta name="description" content="Log in to your account" />
      </Head>
      <AuthTemplate>
        <AuthFormContainer initialForm="login" />
      </AuthTemplate>
    </>
  );
};

export default HomePage;
