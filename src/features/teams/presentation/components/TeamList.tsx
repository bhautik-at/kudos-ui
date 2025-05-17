import { useState } from 'react';
import { useRouter } from 'next/router';
import { useTeamList } from '../hooks/useTeamList';
import { TeamItem } from './TeamItem';
import { Spinner, Button } from '@/shared/components/atoms';
import { useUserRole } from '@/shared/hooks/useUserRole';
import { CreateTeamModal } from './CreateTeamModal';
import { useUser } from '@/features/users/presentation/contexts/UserContext';

interface TeamListProps {
  organizationId: string;
}

export function TeamList({ organizationId }: TeamListProps) {
  const router = useRouter();
  const { teams, isLoading, error } = useTeamList(organizationId);
  const { isTechLeader } = useUserRole();
  const { user } = useUser();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleTeamUpdated = () => {
    // Refresh the team list
    router.replace(router.asPath);
  };

  const handleCreateTeam = () => {
    setIsCreateModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <p className="font-medium">Error loading teams</p>
        <p className="text-sm">{error.message}</p>
      </div>
    );
  }

  return (
    <>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Teams</h2>
          {isTechLeader && <Button onClick={handleCreateTeam}>Create Team</Button>}
        </div>

        {teams.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-md p-6 text-center">
            <p className="text-gray-500">No teams found for this organization.</p>
            {isTechLeader && (
              <Button onClick={handleCreateTeam} className="mt-4">
                Create Your First Team
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {teams.map(team => (
              <TeamItem key={team.id} team={team} onTeamUpdated={handleTeamUpdated} />
            ))}
          </div>
        )}
      </div>

      {/* Create Team Modal */}
      {isCreateModalOpen && user && (
        <CreateTeamModal
          organizationId={organizationId}
          userId={user.id}
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onTeamCreated={handleTeamUpdated}
        />
      )}
    </>
  );
}
