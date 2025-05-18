import { useState, useEffect } from 'react';
import { OrganizationOutputDto } from '../../application/dtos/OrganizationOutputDto';
import { GetOrganizationsUseCase } from '../../application/useCases/GetOrganizationsUseCase';
import { OrganizationRepository } from '../../infrastructure/repositories/OrganizationRepository';
import { OrganizationApiClient } from '../../infrastructure/api/OrganizationApiClient';
import { useToast } from '@/shared/hooks/use-toast';

export function useOrganizations() {
  const [organizations, setOrganizations] = useState<OrganizationOutputDto[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchOrganizations = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Create dependencies
      const apiClient = new OrganizationApiClient();
      const repository = new OrganizationRepository(apiClient);
      const useCase = new GetOrganizationsUseCase(repository);

      // Execute use case
      const result = await useCase.execute();
      setOrganizations(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);

      // Show error message
      toast({
        title: `Error - Failed to fetch organizations: ${error.message}`,
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  return {
    organizations,
    isLoading,
    error,
    refreshOrganizations: fetchOrganizations,
  };
}
