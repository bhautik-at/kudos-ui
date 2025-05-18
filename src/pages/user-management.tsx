import { NextPage } from 'next';
import Head from 'next/head';
import { UserManagementTemplate } from '@/features/userManagement/presentation/templates/UserManagementTemplate';

const UserManagementPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>User Management | Kudos</title>
        <meta name="description" content="Manage users and team members" />
      </Head>
      <UserManagementTemplate />
    </>
  );
};

export default UserManagementPage;
