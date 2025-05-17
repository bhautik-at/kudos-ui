import Head from 'next/head';
import { NextPage } from 'next';
import { DashboardTemplate } from '@/features/dashboard/presentation/templates/DashboardTemplate';

const DashboardPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Dashboard | Kudos</title>
        <meta name="description" content="Kudos dashboard" />
      </Head>
      <DashboardTemplate />
    </>
  );
};

export default DashboardPage;
