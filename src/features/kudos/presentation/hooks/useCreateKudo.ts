import { useState } from 'react';
import { CreateKudoInputDto } from '../../application/dtos/CreateKudoInputDto';
import { KudoOutputDto } from '../../application/dtos/KudoOutputDto';
import { KudoRepository } from '../../infrastructure/repositories/KudoRepository';
import { KudoApiClient } from '../../infrastructure/api/KudoApiClient';
import { CreateKudoUseCase } from '../../application/useCases/CreateKudoUseCase';
import { useAuth } from '@/features/auth/presentation/hooks/useAuth';
import { CategoryRepository } from '../../infrastructure/repositories/CategoryRepository';
import { CategoryApiClient } from '../../infrastructure/api/CategoryApiClient';

// These would be imported from their respective feature modules - using placeholder interfaces
interface UserRepository {
  findById(id: string, organizationId: string): Promise<{ id: string; fullName: string } | null>;
}

interface TeamRepository {
  findById(id: string, organizationId: string): Promise<{ id: string; name: string } | null>;
}

export const useCreateKudo = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  const createKudo = async (kudoData: CreateKudoInputDto): Promise<KudoOutputDto> => {
    if (!user?.id) {
      throw new Error('User not authenticated');
    }

    setIsLoading(true);
    setError(null);

    try {
      // Create dependencies
      const kudoApiClient = new KudoApiClient();
      const kudoRepository = new KudoRepository(kudoApiClient);

      const categoryApiClient = new CategoryApiClient();
      const categoryRepository = new CategoryRepository(categoryApiClient);

      // Placeholder repositories - in a real app, you'd inject these from the appropriate features
      const userRepository: UserRepository = {
        findById: async (id, orgId) => ({ id, fullName: 'User Name' }), // Placeholder implementation
      };

      const teamRepository: TeamRepository = {
        findById: async (id, orgId) => ({ id, name: 'Team Name' }), // Placeholder implementation
      };

      // Create use case
      const createKudoUseCase = new CreateKudoUseCase(
        kudoRepository,
        userRepository,
        teamRepository,
        categoryRepository
      );

      // Execute use case
      const result = await createKudoUseCase.execute(kudoData, user.id);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An unknown error occurred');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { createKudo, isLoading, error };
};
