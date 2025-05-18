import { useState, useCallback, useRef } from 'react';
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
  const { teams, isLoading, error, refetchTeams } = useTeamList(organizationId);
  const { isTechLeader } = useUserRole();
  const { user, isLoading: isUserLoading } = useUser();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [refreshCounter, setRefreshCounter] = useState(0);
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleTeamUpdated = useCallback(() => {
    // Clear any existing timeout
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }

    // Refresh the team list
    refetchTeams();

    // Increment the refresh counter to force re-render of team items
    setRefreshCounter(prev => prev + 1);

    // Schedule a hard refresh after a short delay if needed
    refreshTimeoutRef.current = setTimeout(() => {
      router.replace(router.asPath);
    }, 300);
  }, [router, refetchTeams]);

  const handleCreateTeam = () => {
    setIsCreateModalOpen(true);
  };

  const renderHeader = () => (
    <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
      <div className="flex items-center space-x-3">
        <div className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 p-3 text-white shadow-md">
          <Users className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Teams
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Manage teams in your organization</p>
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
  );

  const renderTeamSkeleton = () => (
    <div className="space-y-4">
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-850 rounded-xl border shadow-sm overflow-hidden animate-pulse"
        >
          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="rounded-full bg-gray-200 dark:bg-gray-700 p-2 h-9 w-9"></div>
                <div>
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-28"></div>
                {isTechLeader && (
                  <>
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      <div>
        {renderHeader()}

        {isLoading ? (
          renderTeamSkeleton()
        ) : teams.length === 0 ? (
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
              <TeamItem
                key={`${team.id}-${refreshCounter}`}
                team={team as any}
                onTeamUpdated={handleTeamUpdated}
              />
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
