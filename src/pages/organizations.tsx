import { NextPage } from 'next';
import Head from 'next/head';
import { OrganizationsTemplate } from '@/features/organizations/presentation/templates/OrganizationsTemplate';

const OrganizationsPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Your Organizations</title>
        <meta name="description" content="Select or create an organization" />
      </Head>
      <OrganizationsTemplate />
    </>
  );
};

export default OrganizationsPage;
