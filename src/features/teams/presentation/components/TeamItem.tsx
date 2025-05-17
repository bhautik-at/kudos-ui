import { useState } from 'react';
import { TeamOutputDto } from '../../application/dtos/TeamOutputDto';
import { TeamMemberWithUserInfoOutputDto } from '../../application/dtos/TeamMemberOutputDto';
import { useUserRole } from '@/shared/hooks/useUserRole';
import { Button, Card } from '@/shared/components/atoms';
import { EditTeamModal } from './EditTeamModal';
import { DeleteTeamModal } from './DeleteTeamModal';
import { useTeamMembers } from '../hooks/useTeamMembers';

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
      <Card className="p-6 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">{team.name}</h3>
            <p className="text-sm text-gray-500">
              {displayMembers.length} {displayMembers.length === 1 ? 'member' : 'members'}
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={toggleMembers}>
              {showMembers ? 'Hide Members' : 'Show Members'}
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsEditModalOpen(true)}
              disabled={!isTechLeader}
            >
              Edit
            </Button>
            <Button
              variant="destructive"
              onClick={() => setIsDeleteModalOpen(true)}
              disabled={!isTechLeader}
            >
              Delete
            </Button>
          </div>
        </div>

        {showMembers && (
          <div className="mt-4 border-t pt-4">
            <h4 className="font-medium mb-2">Team Members</h4>
            {!hasMembers && isLoading ? (
              <p className="text-sm text-gray-500">Loading members...</p>
            ) : displayMembers.length === 0 ? (
              <p className="text-sm text-gray-500">No members in this team</p>
            ) : (
              <ul className="space-y-2">
                {displayMembers.map(member => (
                  <li key={member.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="rounded-full bg-gray-200 w-8 h-8 flex items-center justify-center mr-2">
                        {member.firstName?.[0] || ''}
                        {member.lastName?.[0] || ''}
                      </div>
                      <div>
                        <p className="font-medium">{member.fullName}</p>
                        <p className="text-sm text-gray-500">{member.email}</p>
                      </div>
                    </div>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">{member.role}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </Card>

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
