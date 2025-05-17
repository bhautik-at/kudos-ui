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

    // Check for user ID in localStorage
    if (typeof window !== 'undefined') {
      const userId = localStorage.getItem('kudos_user_id');
      if (userId) {
        // User is already logged in, redirect to dashboard
        router.replace('/dashboard');
      }
    }
  }, [router]);

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
