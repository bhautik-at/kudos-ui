import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Toaster } from '@/shared/components/molecules/toaster';
import { AuthProvider } from '@/features/auth/presentation/contexts/AuthContext';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
      <Toaster />
    </AuthProvider>
  );
}
