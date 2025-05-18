import React, { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { AnalyticsDashboardTemplate } from '@/features/analytics/presentation/templates';

const AnalyticsDashboardPage = () => {
  const router = useRouter();
  const { orgId } = router.query;

  // Redirect if no organization ID is provided
  useEffect(() => {
    if (router.isReady && !orgId) {
      router.push('/');
    }
  }, [router, orgId]);

  // Don't render anything until we have the orgId
  if (!orgId) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Analytics Dashboard | Kudos</title>
        <meta name="description" content="Analytics dashboard for kudos activity" />
      </Head>

      <AnalyticsDashboardTemplate organizationId={orgId as string} />
    </>
  );
};

export default AnalyticsDashboardPage;
