import { useState, useEffect, useCallback, useRef } from 'react';
import { HttpService } from '@/shared/services/http/HttpService';
import { KudoCategoryInfrastructureFactory } from '../../infrastructure/KudoCategoryInfrastructureFactory';
import { KudoCategoryOutputDto } from '../../application/dtos/KudoCategoryOutputDto';
import { CreateKudoCategoryInputDto } from '../../application/dtos/CreateKudoCategoryInputDto';
import { UpdateKudoCategoryInputDto } from '../../application/dtos/UpdateKudoCategoryInputDto';
import { CreateKudoCategoryUseCase } from '../../application/useCases/CreateKudoCategoryUseCase';
import { GetAllKudoCategoriesUseCase } from '../../application/useCases/GetAllKudoCategoriesUseCase';
import { GetKudoCategoryByIdUseCase } from '../../application/useCases/GetKudoCategoryByIdUseCase';
import { UpdateKudoCategoryUseCase } from '../../application/useCases/UpdateKudoCategoryUseCase';
import { DeleteKudoCategoryUseCase } from '../../application/useCases/DeleteKudoCategoryUseCase';
import { httpService } from '@/shared/services/http/HttpService';

// Static data for categories as a fallback
const STATIC_CATEGORIES: KudoCategoryOutputDto[] = [
  {
    id: '1',
    name: 'Teamwork',
    organizationId: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Innovation',
    organizationId: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Leadership',
    organizationId: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Problem Solving',
    organizationId: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Customer Focus',
    organizationId: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Quality',
    organizationId: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const useKudoCategories = (organizationId: string) => {
  const [categories, setCategories] = useState<KudoCategoryOutputDto[]>(STATIC_CATEGORIES);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const isMounted = useRef(false);

  // Use a ref to store repository and validator instances to prevent recreating on each render
  const repoRef = useRef({
    repository: KudoCategoryInfrastructureFactory.createRepository(httpService),
    validator: KudoCategoryInfrastructureFactory.createValidator(httpService),
  });

  const fetchCategories = useCallback(async () => {
    // Skip fetching if organizationId is not provided
    if (!organizationId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const getAllCategoriesUseCase = new GetAllKudoCategoriesUseCase(repoRef.current.repository);
      const categoriesData = await getAllCategoriesUseCase.execute(organizationId);

      if (isMounted.current) {
        setCategories(categoriesData);
      }
    } catch (err) {
      // If we fail to load categories, update the static ones with the organization ID
      const staticWithOrgId = STATIC_CATEGORIES.map(cat => ({
        ...cat,
        organizationId,
      }));

      if (isMounted.current) {
        setCategories(staticWithOrgId);
        setError(err instanceof Error ? err : new Error(String(err)));
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, [organizationId]);

  const createCategory = useCallback(
    async (name: string) => {
      if (!organizationId) return false;

      setError(null);
      try {
        const createCategoryUseCase = new CreateKudoCategoryUseCase(
          repoRef.current.repository,
          repoRef.current.validator
        );
        const categoryDto: CreateKudoCategoryInputDto = {
          name,
          organizationId,
        };
        await createCategoryUseCase.execute(categoryDto);
        await fetchCategories(); // Refresh the list
        return true;
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
        return false;
      }
    },
    [organizationId, fetchCategories]
  );

  const updateCategory = useCallback(
    async (id: string, name: string) => {
      if (!organizationId) return false;

      setError(null);
      try {
        const updateCategoryUseCase = new UpdateKudoCategoryUseCase(
          repoRef.current.repository,
          repoRef.current.validator
        );
        const categoryDto: UpdateKudoCategoryInputDto = {
          name,
        };
        await updateCategoryUseCase.execute(id, organizationId, categoryDto);
        await fetchCategories(); // Refresh the list
        return true;
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
        return false;
      }
    },
    [organizationId, fetchCategories]
  );

  const deleteCategory = useCallback(
    async (id: string) => {
      if (!organizationId) return false;

      setError(null);
      try {
        const deleteCategoryUseCase = new DeleteKudoCategoryUseCase(repoRef.current.repository);
        await deleteCategoryUseCase.execute(id, organizationId);
        await fetchCategories(); // Refresh the list
        return true;
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
        return false;
      }
    },
    [organizationId, fetchCategories]
  );

  const getCategory = useCallback(
    async (id: string) => {
      if (!organizationId) return null;

      setError(null);
      try {
        const getCategoryUseCase = new GetKudoCategoryByIdUseCase(repoRef.current.repository);
        return await getCategoryUseCase.execute(id, organizationId);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
        return null;
      }
    },
    [organizationId]
  );

  // Load categories on mount and when organizationId changes
  useEffect(() => {
    // Skip initial fetch if organizationId is not set
    if (!organizationId) {
      // Update the static categories with empty organization IDs
      setCategories(STATIC_CATEGORIES);
      setIsLoading(false);
      return;
    }

    // Only fetch on the client side
    if (typeof window !== 'undefined') {
      // Set mounted flag
      isMounted.current = true;

      // Update the static categories with the correct organization ID
      const staticWithOrgId = STATIC_CATEGORIES.map(cat => ({
        ...cat,
        organizationId,
      }));
      setCategories(staticWithOrgId);

      // Attempt to fetch real categories (will fall back to static if it fails)
      fetchCategories();
    }

    // Cleanup function
    return () => {
      isMounted.current = false;
    };
  }, [organizationId, fetchCategories]);

  return {
    categories,
    isLoading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategory,
  };
};
