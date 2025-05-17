import Head from 'next/head';
import { NextPage } from 'next';
import { AuthTemplate } from '@/features/auth/presentation/templates';
import { AuthFormContainer } from '@/features/auth/presentation/components';

const SignupPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Sign Up | Your App</title>
        <meta name="description" content="Create a new account" />
      </Head>
      <AuthTemplate>
        <AuthFormContainer initialForm="signup" />
      </AuthTemplate>
    </>
  );
};

export default SignupPage;
