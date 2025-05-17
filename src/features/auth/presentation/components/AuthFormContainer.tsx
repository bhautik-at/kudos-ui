import { useAuth } from '../contexts/AuthContext';
import { SignupForm } from './SignupForm';
import { LoginForm } from './LoginForm';
import { OtpVerificationForm } from './OtpVerificationForm';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { httpService } from '@/shared/services/http/HttpService';
import { AcceptInvitation } from '@/features/users/presentation/components/AcceptInvitation';

interface AuthFormContainerProps {
  initialForm: 'signup' | 'login';
}

export const AuthFormContainer = ({ initialForm }: AuthFormContainerProps) => {
  const { awaitingOtpVerification } = useAuth();
  const router = useRouter();
  const [showInvitationAccept, setShowInvitationAccept] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Extract query parameters
  const invite = router.query.invite as string | undefined;
  const orgId = router.query.orgId as string | undefined;
  const hasInvite = !!invite;
  const hasOrgId = !!orgId;

  // When this component mounts, we're on an auth page, so clear auth state
  useEffect(() => {
    // Clear auth token to prevent API calls
    httpService.clearAuthToken();

    // Check if invitation parameters are present
    if (hasInvite && hasOrgId) {
      // Check for user ID in localStorage
      if (typeof window !== 'undefined') {
        const userId = localStorage.getItem('kudos_user_id');
        if (userId) {
          // User is logged in
          setIsLoggedIn(true);
          setShowInvitationAccept(true);
        } else {
          // User is not logged in, but we have invitation parameters
          // Still show the login page, AcceptInvitation will be shown after successful login
          setIsLoggedIn(false);
        }
      }
    } else if (typeof window !== 'undefined') {
      // Normal authentication flow (no invitation)
      const userId = localStorage.getItem('kudos_user_id');
      if (userId) {
        // User is already logged in, redirect to dashboard
        router.replace('/dashboard');
      }
    }
  }, [router, hasInvite, hasOrgId, invite, orgId]);

  // Show invitation acceptance UI if needed and user is logged in
  if (showInvitationAccept && hasOrgId && orgId && isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="w-full max-w-md">
          <AcceptInvitation
            organizationId={orgId}
            autoAccept={false}
            onSuccess={acceptedOrgId => {
              // Navigate to dashboard with orgId parameter
              router.push(`/dashboard?orgId=${acceptedOrgId}`);
            }}
            onError={error => {
              // If invitation fails, redirect to default dashboard
              const queryParams = new URLSearchParams();
              if (invite) queryParams.append('invite', invite);

              const queryString = queryParams.toString();
              const redirectUrl = queryString ? `/dashboard?${queryString}` : '/dashboard';
              router.replace(redirectUrl);
            }}
          />
        </div>
      </div>
    );
  }

  // Show OTP verification form if we're awaiting OTP verification
  if (awaitingOtpVerification) {
    return <OtpVerificationForm />;
  }

  // Show either login or signup form based on the initialForm prop
  // and pass along any query parameters
  return initialForm === 'signup' ? (
    <SignupForm invite={invite} orgId={orgId} />
  ) : (
    <LoginForm invite={invite} orgId={orgId} />
  );
};
