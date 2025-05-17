import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Toaster } from '@/shared/components/molecules/toaster';
import { AuthProvider } from '@/features/auth/presentation/contexts/AuthContext';
import { UserProvider } from '@/features/users/presentation/contexts/UserContext';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <UserProvider>
        <Component {...pageProps} />
        <Toaster />
      </UserProvider>
    </AuthProvider>
  );
}
