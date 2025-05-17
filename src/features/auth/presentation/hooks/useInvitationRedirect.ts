import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAcceptInvitation } from '@/features/users/presentation/hooks/useAcceptInvitation';
import { useToast } from '@/shared/hooks/use-toast';

export const useInvitationRedirect = () => {
  const [isProcessingInvitation, setIsProcessingInvitation] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const { acceptInvitation } = useAcceptInvitation();
  const router = useRouter();
  const toast = useToast();

  const handleInvitation = async (orgId: string) => {
    setIsProcessingInvitation(true);
    try {
      const result = await acceptInvitation(orgId);
      if (result.success) {
        toast.success('Invitation accepted successfully');
        // Set redirect to the organization page
        setRedirectUrl(`/organizations/${result.organizationId}`);
        return true;
      } else {
        toast.error(`Failed to accept invitation: ${result.message}`);
        // Still redirect to dashboard if invitation fails
        setRedirectUrl('/dashboard');
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Error accepting invitation: ${errorMessage}`);
      // Still redirect to dashboard if invitation fails
      setRedirectUrl('/dashboard');
      return false;
    } finally {
      setIsProcessingInvitation(false);
    }
  };

  return {
    handleInvitation,
    isProcessingInvitation,
    redirectUrl,
    setRedirectUrl,
  };
};
