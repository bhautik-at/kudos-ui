import { useState } from 'react';
import { TeamApiClient } from '../../infrastructure/api/TeamApiClient';
import { TeamRepository } from '../../infrastructure/repositories/TeamRepository';
import { DeleteTeamUseCase } from '../../application/useCases/DeleteTeamUseCase';

export function useDeleteTeam() {
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const deleteTeam = async (teamId: string): Promise<boolean> => {
    setIsDeleting(true);
    setError(null);

    try {
      // Initialize dependencies
      const apiClient = new TeamApiClient();
      const teamRepository = new TeamRepository(apiClient);

      // Create use case
      const deleteTeamUseCase = new DeleteTeamUseCase(teamRepository);

      // Execute deletion
      await deleteTeamUseCase.execute(teamId);
      return true;
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      setError(errorObj);
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return { deleteTeam, isDeleting, error };
}
