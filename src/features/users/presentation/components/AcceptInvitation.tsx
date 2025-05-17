import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAcceptInvitation } from '../hooks/useAcceptInvitation';
import { Button } from '@/shared/components/atoms/Button';
import { Card } from '@/shared/components/atoms/Card';
import { useToast } from '@/shared/hooks/use-toast';

interface AcceptInvitationProps {
  organizationId: string;
  autoAccept?: boolean;
  onSuccess?: (organizationId: string) => void;
  onError?: (error: string) => void;
}

export const AcceptInvitation = ({
  organizationId,
  autoAccept = false,
  onSuccess,
  onError,
}: AcceptInvitationProps) => {
  const { acceptInvitation, loading, error, result } = useAcceptInvitation();
  const [hasAttempted, setHasAttempted] = useState(false);
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    if (autoAccept && organizationId && !hasAttempted) {
      handleAcceptInvitation();
    }
  }, [autoAccept, organizationId]);

  useEffect(() => {
    if (result && result.success) {
      toast.success('Invitation accepted successfully');
      if (onSuccess) {
        onSuccess(result.organizationId);
      }
    }
  }, [result]);

  useEffect(() => {
    if (error && hasAttempted) {
      toast.error(`Failed to accept invitation: ${error}`);
      if (onError) {
        onError(error);
      }
    }
  }, [error, hasAttempted]);

  const handleAcceptInvitation = async () => {
    if (!organizationId) {
      toast.error('Organization ID is required');
      return;
    }

    setHasAttempted(true);
    const result = await acceptInvitation(organizationId);

    if (result.success) {
      // Redirect to organization page or dashboard on success
      router.push(`/organizations/${result.organizationId}`);
    }
  };

  if (!organizationId) {
    return (
      <Card className="p-4 w-full max-w-md mx-auto">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Invalid Invitation</h2>
          <p className="text-gray-600 mb-4">
            This invitation is invalid or has expired. Please contact your organization
            administrator.
          </p>
          <Button onClick={() => router.push('/')}>Go to Home</Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 w-full max-w-md mx-auto">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Organization Invitation</h2>
        <p className="text-gray-600 mb-6">
          You have been invited to join an organization. Would you like to accept the invitation?
        </p>

        {error && <div className="bg-red-50 text-red-700 p-3 mb-4 rounded">{error}</div>}

        <div className="flex justify-center space-x-4">
          <Button variant="outline" onClick={() => router.push('/')} disabled={loading}>
            Decline
          </Button>
          <Button onClick={handleAcceptInvitation} disabled={loading}>
            {loading ? 'Accepting...' : 'Accept Invitation'}
          </Button>
        </div>
      </div>
    </Card>
  );
};
