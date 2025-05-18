import { useState } from 'react';
import { TeamApiClient } from '../../infrastructure/api/TeamApiClient';
import { TeamRepository } from '../../infrastructure/repositories/TeamRepository';
import { TeamMemberRepository } from '../../infrastructure/repositories/TeamMemberRepository';
import { RemoveTeamMemberUseCase } from '../../application/useCases/RemoveTeamMemberUseCase';

export function useRemoveTeamMember() {
  const [isRemoving, setIsRemoving] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const removeTeamMember = async (teamId: string, userId: string): Promise<boolean> => {
    setIsRemoving(true);
    setError(null);

    try {
      // Initialize dependencies
      const apiClient = new TeamApiClient();
      const teamRepository = new TeamRepository(apiClient);
      const teamMemberRepository = new TeamMemberRepository(apiClient);

      // Create use case
      const removeTeamMemberUseCase = new RemoveTeamMemberUseCase(
        teamRepository,
        teamMemberRepository
      );

      // Execute use case
      await removeTeamMemberUseCase.execute(teamId, userId);
      return true;
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      setError(errorObj);
      console.error('Error removing team member:', err);
      return false;
    } finally {
      setIsRemoving(false);
    }
  };

  return { removeTeamMember, isRemoving, error };
}
