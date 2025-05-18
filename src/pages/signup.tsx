import Head from 'next/head';
import { NextPage } from 'next';
import { AuthTemplate } from '@/features/auth/presentation/templates';
import { AuthFormContainer } from '@/features/auth/presentation/components';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { httpService } from '@/shared/services/http/HttpService';

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
