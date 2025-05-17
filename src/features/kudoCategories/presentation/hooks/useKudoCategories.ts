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

export const useKudoCategories = (organizationId: string) => {
  const [categories, setCategories] = useState<KudoCategoryOutputDto[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const isMounted = useRef(false);
  const httpServiceRef = useRef<HttpService | null>(null);

  // Initialize HTTP service only once to prevent re-creating on each render
  if (!httpServiceRef.current) {
    httpServiceRef.current = new HttpService();
  }

  const httpService = httpServiceRef.current;
  const categoryRepository = KudoCategoryInfrastructureFactory.createRepository(httpService);
  const categoryValidator = KudoCategoryInfrastructureFactory.createValidator(httpService);

  const fetchCategories = useCallback(async () => {
    // Skip fetching if organizationId is not provided
    if (!organizationId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const getAllCategoriesUseCase = new GetAllKudoCategoriesUseCase(categoryRepository);
      const categoriesData = await getAllCategoriesUseCase.execute(organizationId);
      setCategories(categoriesData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, [organizationId, categoryRepository]);

  const createCategory = useCallback(
    async (name: string) => {
      if (!organizationId) return false;

      setError(null);
      try {
        const createCategoryUseCase = new CreateKudoCategoryUseCase(
          categoryRepository,
          categoryValidator
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
    [organizationId, categoryRepository, categoryValidator, fetchCategories]
  );

  const updateCategory = useCallback(
    async (id: string, name: string) => {
      if (!organizationId) return false;

      setError(null);
      try {
        const updateCategoryUseCase = new UpdateKudoCategoryUseCase(
          categoryRepository,
          categoryValidator
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
    [organizationId, categoryRepository, categoryValidator, fetchCategories]
  );

  const deleteCategory = useCallback(
    async (id: string) => {
      if (!organizationId) return false;

      setError(null);
      try {
        const deleteCategoryUseCase = new DeleteKudoCategoryUseCase(categoryRepository);
        await deleteCategoryUseCase.execute(id, organizationId);
        await fetchCategories(); // Refresh the list
        return true;
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
        return false;
      }
    },
    [organizationId, categoryRepository, fetchCategories]
  );

  const getCategory = useCallback(
    async (id: string) => {
      if (!organizationId) return null;

      setError(null);
      try {
        const getCategoryUseCase = new GetKudoCategoryByIdUseCase(categoryRepository);
        return await getCategoryUseCase.execute(id, organizationId);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
        return null;
      }
    },
    [organizationId, categoryRepository]
  );

  // Load categories on mount and when organizationId changes
  useEffect(() => {
    // Skip initial fetch if organizationId is not set
    if (!organizationId) {
      setIsLoading(false);
      return;
    }

    // Only fetch on the client side and when component is mounted
    if (typeof window !== 'undefined') {
      // Set mounted flag
      isMounted.current = true;
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
