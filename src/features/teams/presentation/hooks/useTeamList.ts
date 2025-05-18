import { useState, useEffect, useCallback } from 'react';
import { TeamApiClient } from '../../infrastructure/api/TeamApiClient';
import { TeamRepository } from '../../infrastructure/repositories/TeamRepository';
import { ListTeamsByOrganizationUseCase } from '../../application/useCases/ListTeamsByOrganizationUseCase';
import { TeamOutputDto } from '../../application/dtos/TeamOutputDto';
import { GetTeamMembersUseCase } from '../../application/useCases/GetTeamMembersUseCase';
import { TeamMemberRepository } from '../../infrastructure/repositories/TeamMemberRepository';
import { TeamMemberWithUserInfoOutputDto } from '../../application/dtos/TeamMemberOutputDto';

interface TeamWithMembers {
  id: string;
  name: string;
  organizationId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  members: TeamMemberWithUserInfoOutputDto[];
}

export function useTeamList(organizationId: string) {
  const [teams, setTeams] = useState<TeamWithMembers[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTeams = useCallback(async () => {
    if (!organizationId) return;

    setIsLoading(true);
    setError(null);

    try {
      // Initialize dependencies
      const apiClient = new TeamApiClient();
      const teamRepository = new TeamRepository(apiClient);
      const teamMemberRepository = new TeamMemberRepository(apiClient);

      // Create use cases
      const listTeamsUseCase = new ListTeamsByOrganizationUseCase(teamRepository);
      const getTeamMembersUseCase = new GetTeamMembersUseCase(teamRepository, teamMemberRepository);

      // Fetch basic team data
      const teamsData = await listTeamsUseCase.execute(organizationId);

      // Fetch members for each team
      const teamsWithMembers = await Promise.all(
        teamsData.map(async team => {
          try {
            const members = await getTeamMembersUseCase.execute(team.id);
            return { ...team, members };
          } catch (memberError) {
            console.error(`Error fetching members for team ${team.id}:`, memberError);
            return { ...team, members: [] };
          }
        })
      );

      setTeams(teamsWithMembers);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, [organizationId]);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  return { teams, isLoading, error, refetchTeams: fetchTeams };
}
