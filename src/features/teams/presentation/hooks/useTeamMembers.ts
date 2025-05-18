import { useState, useEffect, useCallback } from 'react';
import { TeamApiClient } from '../../infrastructure/api/TeamApiClient';
import { TeamRepository } from '../../infrastructure/repositories/TeamRepository';
import { TeamMemberRepository } from '../../infrastructure/repositories/TeamMemberRepository';
import { GetTeamMembersUseCase } from '../../application/useCases/GetTeamMembersUseCase';
import { TeamMemberWithUserInfoOutputDto } from '../../application/dtos/TeamMemberOutputDto';

export function useTeamMembers(teamId: string, skipFetch: boolean = false) {
  const [teamMembers, setTeamMembers] = useState<TeamMemberWithUserInfoOutputDto[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(!skipFetch);
  const [error, setError] = useState<Error | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  const fetchTeamMembers = useCallback(async () => {
    if (!teamId) return;

    setIsLoading(true);
    setError(null);

    try {
      // Initialize dependencies
      const apiClient = new TeamApiClient();
      const teamRepository = new TeamRepository(apiClient);
      const teamMemberRepository = new TeamMemberRepository(apiClient);

      // Create use case
      const getTeamMembersUseCase = new GetTeamMembersUseCase(teamRepository, teamMemberRepository);

      // Fetch members
      const members = await getTeamMembersUseCase.execute(teamId);
      setTeamMembers(members);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      console.error('Error fetching team members:', err);
    } finally {
      setIsLoading(false);
    }
  }, [teamId]);

  // Function to trigger a refresh
  const refetchMembers = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  useEffect(() => {
    if (skipFetch) return;
    fetchTeamMembers();
  }, [fetchTeamMembers, skipFetch, refreshTrigger]);

  return { teamMembers, isLoading, error, refetchMembers };
}
