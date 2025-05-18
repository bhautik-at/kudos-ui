import { NextPage } from 'next';
import Head from 'next/head';
import { TeamListTemplate } from '@/features/teams/presentation/templates/TeamListTemplate';
import { DashboardLayout } from '@/shared/components/templates/DashboardLayout';

const TeamsPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Teams | Kudos UI</title>
      </Head>
      <DashboardLayout>
        <TeamListTemplate />
      </DashboardLayout>
    </>
  );
};

export default TeamsPage;
