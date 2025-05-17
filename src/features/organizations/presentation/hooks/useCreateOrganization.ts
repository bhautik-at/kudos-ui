import { useState } from 'react';
import { useRouter } from 'next/router';
import { CreateOrganizationInputDto } from '../../application/dtos/CreateOrganizationInputDto';
import { OrganizationOutputDto } from '../../application/dtos/OrganizationOutputDto';
import { CreateOrganizationUseCase } from '../../application/useCases/CreateOrganizationUseCase';
import { OrganizationRepository } from '../../infrastructure/repositories/OrganizationRepository';
import { OrganizationApiClient } from '../../infrastructure/api/OrganizationApiClient';
import { useToast } from '@/shared/hooks/use-toast';

export function useCreateOrganization() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const createOrganization = async (
    orgName: string,
    description?: string
  ): Promise<OrganizationOutputDto | null> => {
    setIsLoading(true);
    setError(null);

    try {
      // Create dependencies
      const apiClient = new OrganizationApiClient();
      const repository = new OrganizationRepository(apiClient);
      const useCase = new CreateOrganizationUseCase(repository);

      // Create input DTO
      const input: CreateOrganizationInputDto = {
        name: orgName,
        description,
      };

      // Execute use case
      const result = await useCase.execute(input);

      // Show success message
      toast({
        title: `Organization created - Successfully created organization: ${result.name}`,
      });

      // Navigate to dashboard with orgId
      router.push(`/dashboard?orgId=${result.id}`);

      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);

      // Show error message
      toast({
        title: `Error - Failed to create organization: ${error.message}`,
        type: 'error',
      });

      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createOrganization,
    isLoading,
    error,
  };
}
