import { useRouter } from 'next/router';
import { TeamList } from '@/features/teams/presentation/components/TeamList';
import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/shared/components/templates';

export default function TeamsPage() {
  const router = useRouter();
  const { organizationId } = router.query;
  const [orgId, setOrgId] = useState<string>('');

  useEffect(() => {
    if (organizationId && typeof organizationId === 'string') {
      setOrgId(organizationId);
    }
  }, [organizationId]);

  if (!orgId) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-6">
          <div className="flex justify-center items-center py-12">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <TeamList organizationId={orgId} />
      </div>
    </DashboardLayout>
  );
}
