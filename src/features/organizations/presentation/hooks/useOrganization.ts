import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { OrganizationOutputDto } from '../../application/dtos/OrganizationOutputDto';
import { GetOrganizationUseCase } from '../../application/useCases/GetOrganizationUseCase';
import {
  UpdateOrganizationUseCase,
  UpdateOrganizationInputDto,
} from '../../application/useCases/UpdateOrganizationUseCase';
import { DeleteOrganizationUseCase } from '../../application/useCases/DeleteOrganizationUseCase';
import { OrganizationRepository } from '../../infrastructure/repositories/OrganizationRepository';
import { OrganizationApiClient } from '../../infrastructure/api/OrganizationApiClient';
import { useToast } from '@/shared/hooks/use-toast';

export function useOrganization(id?: string) {
  const [organization, setOrganization] = useState<OrganizationOutputDto | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(id ? true : false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  // Create dependencies once
  const apiClient = new OrganizationApiClient();
  const repository = new OrganizationRepository(apiClient);

  const fetchOrganization = useCallback(async () => {
    if (!id) return;

    setIsLoading(true);
    setError(null);

    try {
      const useCase = new GetOrganizationUseCase(repository);
      const result = await useCase.execute(id);
      setOrganization(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);

      toast({
        title: 'Error',
        description: `Failed to fetch organization: ${error.message}`,
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  }, [id, repository, toast]);

  const updateOrganization = async (data: { name?: string; description?: string }) => {
    if (!id || !organization) return null;

    setIsUpdating(true);
    setError(null);

    try {
      const useCase = new UpdateOrganizationUseCase(repository);

      const input: UpdateOrganizationInputDto = {
        id,
        ...data,
      };

      const result = await useCase.execute(input);
      setOrganization(result);

      toast({
        title: 'Success',
        description: 'Organization updated successfully',
      });

      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);

      toast({
        title: 'Error',
        description: `Failed to update organization: ${error.message}`,
        type: 'error',
      });

      return null;
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteOrganization = async () => {
    if (!id) return false;

    setIsDeleting(true);
    setError(null);

    try {
      const useCase = new DeleteOrganizationUseCase(repository);
      await useCase.execute(id);

      toast({
        title: 'Success',
        description: 'Organization deleted successfully',
      });

      // Redirect to organizations list page
      router.push('/organizations');
      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);

      toast({
        title: 'Error',
        description: `Failed to delete organization: ${error.message}`,
        type: 'error',
      });

      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchOrganization();
    }
  }, [id, fetchOrganization]);

  return {
    organization,
    isLoading,
    isUpdating,
    isDeleting,
    error,
    fetchOrganization,
    updateOrganization,
    deleteOrganization,
  };
}
