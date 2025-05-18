import { useState } from 'react';
import { TeamOutputDto } from '../../application/dtos/TeamOutputDto';
import { TeamMemberWithUserInfoOutputDto } from '../../application/dtos/TeamMemberOutputDto';
import { useUserRole } from '@/shared/hooks/useUserRole';
import { Button } from '@/shared/components/atoms/Button';
import { EditTeamModal } from './EditTeamModal';
import { DeleteTeamModal } from './DeleteTeamModal';
import { useTeamMembers } from '../hooks/useTeamMembers';
import { Users, ChevronDown, ChevronUp, Pencil, Trash2, UserPlus } from 'lucide-react';

// Define a type that can be either TeamOutputDto or a team with TeamMemberWithUserInfoOutputDto[] members
type TeamItemTeam = Omit<TeamOutputDto, 'members'> & {
  members?: string[] | TeamMemberWithUserInfoOutputDto[];
};

interface TeamItemProps {
  team: TeamItemTeam;
  onTeamUpdated: () => void;
}

export function TeamItem({ team, onTeamUpdated }: TeamItemProps) {
  const { isTechLeader } = useUserRole();
  const [showMembers, setShowMembers] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Check if members property exists and contains array of objects (not strings)
  const hasMembers =
    'members' in team &&
    Array.isArray(team.members) &&
    team.members.length > 0 &&
    typeof team.members[0] !== 'string';

  // Fetch team members if not provided
  const { teamMembers, isLoading } = useTeamMembers(team.id, !hasMembers);

  // Use the provided members if they're objects, otherwise use fetched members
  const displayMembers = hasMembers
    ? (team.members as TeamMemberWithUserInfoOutputDto[])
    : teamMembers;

  const toggleMembers = () => {
    setShowMembers(!showMembers);
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-850 rounded-xl border shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="rounded-full bg-blue-50 dark:bg-blue-900/20 p-2 text-blue-600 dark:text-blue-400">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{team.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {displayMembers.length} {displayMembers.length === 1 ? 'member' : 'members'}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleMembers}
                className="flex items-center gap-1.5 border-gray-200 hover:bg-gray-50 text-gray-700"
              >
                {showMembers ? (
                  <>
                    <ChevronUp className="h-4 w-4" />
                    <span>Hide Members</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4" />
                    <span>Show Members</span>
                  </>
                )}
              </Button>
              {isTechLeader && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditModalOpen(true)}
                    className="flex items-center gap-1.5 text-blue-600 border-blue-200 hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-900/20"
                  >
                    <Pencil className="h-4 w-4" />
                    <span>Edit</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="flex items-center gap-1.5 text-red-600 border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete</span>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {showMembers && (
          <div className="border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/30">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-gray-900 dark:text-gray-100">Team Members</h4>
                {isTechLeader && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditModalOpen(true)}
                    className="flex items-center gap-1.5 text-blue-600 border-blue-200 hover:bg-blue-50"
                  >
                    <UserPlus className="h-4 w-4" />
                    <span>Manage Members</span>
                  </Button>
                )}
              </div>

              {!hasMembers && isLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="flex items-center space-x-3 animate-pulse">
                      <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : displayMembers.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No members in this team
                  </p>
                  {isTechLeader && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditModalOpen(true)}
                      className="mt-4"
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add Members
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid gap-3">
                  {displayMembers.map(member => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50">
                          <div className="flex h-full w-full items-center justify-center rounded-full bg-white/80 dark:bg-gray-900/80 text-blue-600 font-medium">
                            {member.firstName?.[0] || ''}
                            {member.lastName?.[0] || ''}
                          </div>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            {member.fullName || `${member.firstName} ${member.lastName}`}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{member.email}</p>
                        </div>
                      </div>
                      <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 border border-blue-100 dark:border-blue-800">
                        {member.role.toLowerCase()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Edit Team Modal - Cast team to TeamOutputDto */}
      {isEditModalOpen && (
        <EditTeamModal
          team={{
            id: team.id,
            name: team.name,
            organizationId: team.organizationId,
            createdBy: team.createdBy,
            createdAt: team.createdAt,
            updatedAt: team.updatedAt,
            members:
              Array.isArray(team.members) &&
              team.members.length > 0 &&
              typeof team.members[0] === 'string'
                ? (team.members as string[])
                : undefined,
          }}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onTeamUpdated={onTeamUpdated}
        />
      )}

      {/* Delete Team Modal - Cast team to TeamOutputDto */}
      {isDeleteModalOpen && (
        <DeleteTeamModal
          team={{
            id: team.id,
            name: team.name,
            organizationId: team.organizationId,
            createdBy: team.createdBy,
            createdAt: team.createdAt,
            updatedAt: team.updatedAt,
          }}
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onTeamDeleted={onTeamUpdated}
        />
      )}
    </>
  );
}
