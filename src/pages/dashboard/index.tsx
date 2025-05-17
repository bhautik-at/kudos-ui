import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { NextPage } from 'next';
import { useAuth } from '@/features/auth/presentation/contexts/AuthContext';
import { DashboardTemplate } from '@/features/dashboard/presentation/templates/DashboardTemplate';

const DashboardPage: NextPage = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  console.log('Dashboard Page - Auth State:', { isAuthenticated, isLoading });

  useEffect(() => {
    // Redirect to login page if not authenticated and not loading
    if (!isAuthenticated && !isLoading) {
      console.log('Dashboard Page - Not authenticated, redirecting to login');
      router.replace('/');
    }
  }, [isAuthenticated, isLoading, router]);

  // Show nothing while loading or redirecting
  if (isLoading || !isAuthenticated) {
    console.log('Dashboard Page - Rendering null (loading or not authenticated)');
    return null;
  }

  console.log('Dashboard Page - Rendering dashboard template (user is authenticated)');
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
