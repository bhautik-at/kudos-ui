import Head from 'next/head';
import { NextPage } from 'next';
import { AuthTemplate } from '@/features/auth/presentation/templates';
import { AuthFormContainer } from '@/features/auth/presentation/components';

const HomePage: NextPage = () => {
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
