import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { NextPage } from 'next';

const AuthIndexPage: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace('/');
  }, [router]);

  return null;
};

export default AuthIndexPage;
