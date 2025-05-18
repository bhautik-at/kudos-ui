import { useRouter } from 'next/router';
import { AcceptInvitation } from '../components/AcceptInvitation';

export const AcceptInvitationTemplate = () => {
  const router = useRouter();
  const { organizationId } = router.query;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md">
        <AcceptInvitation
          organizationId={typeof organizationId === 'string' ? organizationId : ''}
          autoAccept={false}
          onSuccess={orgId => {
            // Successfully accepted invitation, router push will be handled by the component
          }}
          onError={error => {
            // Error is already displayed by the component
            console.error('Invitation error:', error);
          }}
        />
      </div>
    </div>
  );
};
