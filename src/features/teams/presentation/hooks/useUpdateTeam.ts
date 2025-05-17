import { useState } from 'react';
import { TeamApiClient } from '../../infrastructure/api/TeamApiClient';
import { TeamRepository } from '../../infrastructure/repositories/TeamRepository';
import { UpdateTeamUseCase } from '../../application/useCases/UpdateTeamUseCase';
import { UpdateTeamInputDto } from '../../application/dtos/UpdateTeamInputDto';
import { TeamOutputDto } from '../../application/dtos/TeamOutputDto';

export function useUpdateTeam() {
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const updateTeam = async (data: UpdateTeamInputDto): Promise<TeamOutputDto | null> => {
    setIsUpdating(true);
    setError(null);

    try {
      // Initialize dependencies
      const apiClient = new TeamApiClient();
      const teamRepository = new TeamRepository(apiClient);

      // Create use case
      const updateTeamUseCase = new UpdateTeamUseCase(teamRepository);

      // Execute update
      const updatedTeam = await updateTeamUseCase.execute(data);
      return updatedTeam;
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      setError(errorObj);
      return null;
    } finally {
      setIsUpdating(false);
    }
  };

  return { updateTeam, isUpdating, error };
}
