import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { NextPage } from 'next';
import { useAuth } from '@/features/auth/presentation/contexts/AuthContext';
import { useUser } from '@/features/users/presentation/contexts/UserContext';
import { DashboardTemplate } from '@/features/dashboard/presentation/templates/DashboardTemplate';

const DashboardPage: NextPage = () => {
  const { isAuthLoading } = useAuth();
  const { isAuthenticated, user, isLoading: userLoading } = useUser();
  const router = useRouter();

  const isLoading = isAuthLoading || userLoading;

  useEffect(() => {
    // Redirect to login page if not authenticated and not loading
    if (!isAuthenticated && !isLoading) {
      router.replace('/');
    }
  }, [isAuthenticated, isLoading, router]);

  // Show nothing while loading or redirecting
  if (isLoading || !isAuthenticated) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Dashboard | Your App</title>
        <meta name="description" content="Your dashboard" />
      </Head>
      <DashboardTemplate />
    </>
  );
};

export default DashboardPage;
