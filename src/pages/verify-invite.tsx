import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { AcceptInvitation } from '@/features/users/presentation/components/AcceptInvitation';
import { toastService } from '@/shared/services/toast';
import { useUser } from '@/features/users/presentation/contexts/UserContext';

const VerifyInvitePage = () => {
  const router = useRouter();
  const { orgId, invite } = router.query;
  const { user, isLoading } = useUser();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Wait for router and user to be ready
    if (!router.isReady || isLoading) return;

    // Ensure we have the required parameters
    if (!orgId) {
      toastService.error('Missing organization ID');
      router.replace('/organizations');
      return;
    }

    // Ensure user is authenticated
    if (!user) {
      const userId = localStorage.getItem('kudos_user_id');
      if (!userId) {
        toastService.error('You must be logged in to accept an invitation');
        router.replace('/login');
        return;
      }
    }

    setIsReady(true);
  }, [router.isReady, orgId, user, isLoading, router]);

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="w-full max-w-md">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md">
        <AcceptInvitation
          organizationId={orgId as string}
          autoAccept={false}
          onSuccess={acceptedOrgId => {
            // Navigate to dashboard with orgId parameter
            router.push(`/dashboard?orgId=${orgId}`);
          }}
          onError={error => {
            toastService.error(`Failed to accept invitation: ${error}`);
            router.push('/organizations');
          }}
        />
      </div>
    </div>
  );
};

export default VerifyInvitePage;
