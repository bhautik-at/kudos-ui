import { useState } from 'react';
import { TeamApiClient } from '../../infrastructure/api/TeamApiClient';
import { TeamRepository } from '../../infrastructure/repositories/TeamRepository';
import { TeamMemberRepository } from '../../infrastructure/repositories/TeamMemberRepository';
import { AddTeamMemberUseCase } from '../../application/useCases/AddTeamMemberUseCase';
import { TeamMemberInputDto } from '../../application/dtos/TeamMemberInputDto';
import { TeamMemberOutputDto } from '../../application/dtos/TeamMemberOutputDto';

export function useAddTeamMember() {
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const addTeamMember = async (
    teamId: string,
    userId: string
  ): Promise<TeamMemberOutputDto | null> => {
    setIsAdding(true);
    setError(null);

    try {
      // Initialize dependencies
      const apiClient = new TeamApiClient();
      const teamRepository = new TeamRepository(apiClient);
      const teamMemberRepository = new TeamMemberRepository(apiClient);

      // Create use case
      const addTeamMemberUseCase = new AddTeamMemberUseCase(teamRepository, teamMemberRepository);

      // Create input DTO
      const inputDto: TeamMemberInputDto = {
        teamId,
        memberUserId: userId,
      };

      // Execute use case
      const addedMember = await addTeamMemberUseCase.execute(inputDto);
      return addedMember;
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      setError(errorObj);
      console.error('Error adding team member:', err);
      return null;
    } finally {
      setIsAdding(false);
    }
  };

  return { addTeamMember, isAdding, error };
}
