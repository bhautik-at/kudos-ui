import { useRouter } from 'next/router';
import { TeamList } from '../components/TeamList';

export function TeamListTemplate() {
  const router = useRouter();
  const { orgId } = router.query;
  const organizationId = typeof orgId === 'string' ? orgId : '';

  if (!organizationId) {
    return (
      <div className="container mx-auto py-8">
        <div
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <p className="font-medium">Missing organization ID</p>
          <p className="text-sm">Please select an organization first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <TeamList organizationId={organizationId} />
    </div>
  );
}
