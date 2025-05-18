import Head from 'next/head';
import { NextPage } from 'next';
import { AuthTemplate } from '@/features/auth/presentation/templates';
import { AuthFormContainer } from '@/features/auth/presentation/components';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { httpService } from '@/shared/services/http/HttpService';
import { AcceptInvitation } from '@/features/users/presentation/components/AcceptInvitation';

const HomePage: NextPage = () => {
  const router = useRouter();
  const [showAcceptInvitation, setShowAcceptInvitation] = useState(false);
  const [organizationId, setOrganizationId] = useState<string | null>(null);

  // This runs on the login page, clear auth state immediately
  useEffect(() => {
    // Clear auth token to prevent API calls
    httpService.clearAuthToken();

    // Get query parameters
    const { orgId, invite } = router.query;

    if (orgId) {
      setOrganizationId(orgId as string);
    }

    // Check for user ID in localStorage
    if (typeof window !== 'undefined') {
      const userId = localStorage.getItem('kudos_user_id');

      if (userId) {
        // User is already logged in
        if (orgId) {
          // If we have an orgId parameter, show the accept invitation component
          setShowAcceptInvitation(true);
        } else {
          // No orgId parameter, just redirect to dashboard
          router.replace('/dashboard');
        }
      } else if (orgId) {
        // User not logged in but has orgId - store it for later use after login
        localStorage.setItem('kudos_invite_orgId', orgId as string);
      }
    }
  }, [router, router.query]);

  const handleInvitationSuccess = (orgId: string) => {
    // Redirect to dashboard with the orgId parameter after successful acceptance
    router.push(`/dashboard?orgId=${orgId}`);

    // Clean up localStorage
    localStorage.removeItem('kudos_invite_orgId');
  };

  return (
    <>
      <Head>
        <title>Log In | Your App</title>
        <meta name="description" content="Log in to your account" />
      </Head>
      {showAcceptInvitation && organizationId ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <AcceptInvitation
            organizationId={organizationId}
            onSuccess={handleInvitationSuccess}
            onError={() => setShowAcceptInvitation(false)}
          />
        </div>
      ) : (
        <AuthTemplate>
          <AuthFormContainer initialForm="login" />
        </AuthTemplate>
      )}
    </>
  );
};

export default HomePage;
