import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { OrganizationTemplate } from '@/features/organizations/presentation/templates/OrganizationTemplate';

const OrganizationPage: NextPage = () => {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Create Organization</title>
        <meta name="description" content="Create your organization" />
      </Head>
      <OrganizationTemplate />
    </>
  );
};

export default OrganizationPage;
