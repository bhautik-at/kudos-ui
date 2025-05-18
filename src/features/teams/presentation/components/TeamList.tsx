import { useState } from 'react';
import { useRouter } from 'next/router';
import { useTeamList } from '../hooks/useTeamList';
import { TeamItem } from './TeamItem';
import { Button } from '@/shared/components/atoms/Button';
import { useUserRole } from '@/shared/hooks/useUserRole';
import { CreateTeamModal } from './CreateTeamModal';
import { useUser } from '@/features/users/presentation/contexts/UserContext';
import { Users, Plus, AlertCircle } from 'lucide-react';

interface TeamListProps {
  organizationId: string;
}

export function TeamList({ organizationId }: TeamListProps) {
  const router = useRouter();
  const { teams, isLoading, error } = useTeamList(organizationId);
  const { isTechLeader } = useUserRole();
  const { user, isLoading: isUserLoading } = useUser();
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
      <div className="bg-white dark:bg-gray-850 rounded-xl border shadow-sm p-12 text-center">
        <div className="flex flex-col items-center justify-center">
          <div className="h-10 w-10 border-4 border-t-blue-600 border-b-blue-600 border-l-transparent border-r-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-lg font-medium text-gray-600 dark:text-gray-300">Loading teams...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800 p-6 text-red-800 dark:text-red-200">
        <div className="flex items-center space-x-3">
          <AlertCircle className="h-6 w-6 text-red-500" />
          <div>
            <h3 className="font-medium text-red-800 dark:text-red-200">Failed to load teams</h3>
            <p className="text-sm text-red-600 dark:text-red-300">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div>
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 p-3 text-white shadow-md">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Teams
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage teams in your organization
              </p>
            </div>
          </div>

          {isTechLeader && !isUserLoading && (
            <Button
              onClick={handleCreateTeam}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md transition-all flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              <span>Create Team</span>
            </Button>
          )}
        </div>

        {teams.length === 0 ? (
          <div className="bg-white dark:bg-gray-850 rounded-xl border shadow-sm p-12 text-center">
            <div className="flex flex-col items-center justify-center text-muted-foreground">
              <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-3 mb-4">
                <Users className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium mb-1">No teams found</h3>
              <p className="text-sm mb-6">Create your first team to get started</p>

              {isTechLeader && !isUserLoading && (
                <Button
                  onClick={handleCreateTeam}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md transition-all flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create Your First Team</span>
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {teams.map(team => (
              <TeamItem key={team.id} team={team as any} onTeamUpdated={handleTeamUpdated} />
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
