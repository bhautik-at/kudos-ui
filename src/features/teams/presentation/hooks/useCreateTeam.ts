import { useState } from 'react';
import { TeamApiClient } from '../../infrastructure/api/TeamApiClient';
import { TeamRepository } from '../../infrastructure/repositories/TeamRepository';
import { CreateTeamUseCase } from '../../application/useCases/CreateTeamUseCase';
import { CreateTeamInputDto } from '../../application/dtos/CreateTeamInputDto';
import { TeamOutputDto } from '../../application/dtos/TeamOutputDto';

export function useCreateTeam() {
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const createTeam = async (data: CreateTeamInputDto): Promise<TeamOutputDto | null> => {
    setIsCreating(true);
    setError(null);

    try {
      // Initialize dependencies
      const apiClient = new TeamApiClient();
      const teamRepository = new TeamRepository(apiClient);

      // Create use case
      const createTeamUseCase = new CreateTeamUseCase(teamRepository);

      // Execute creation
      const createdTeam = await createTeamUseCase.execute(data);
      return createdTeam;
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      setError(errorObj);
      return null;
    } finally {
      setIsCreating(false);
    }
  };

  return { createTeam, isCreating, error };
}
