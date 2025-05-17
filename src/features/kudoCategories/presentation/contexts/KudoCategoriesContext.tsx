import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
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
import { useToast } from '@/shared/hooks/use-toast';

interface KudoCategoriesContextType {
  // State
  categories: KudoCategoryOutputDto[];
  isLoading: boolean;
  error: Error | null;

  // Actions
  fetchCategories: () => Promise<void>;
  createCategory: (name: string) => Promise<boolean>;
  updateCategory: (id: string, name: string) => Promise<boolean>;
  deleteCategory: (id: string) => Promise<boolean>;
  getCategory: (id: string) => Promise<KudoCategoryOutputDto | null>;
}

const KudoCategoriesContext = createContext<KudoCategoriesContextType | undefined>(undefined);

export const useKudoCategoriesContext = () => {
  const context = useContext(KudoCategoriesContext);
  if (!context) {
    throw new Error('useKudoCategoriesContext must be used within a KudoCategoriesProvider');
  }
  return context;
};

interface KudoCategoriesProviderProps {
  children: React.ReactNode;
}

// Default organization ID to use if none is found in the URL
const DEFAULT_ORG_ID = '0091b8bd-db42-4494-bd69-5ec436dd2868';

export const KudoCategoriesProvider: React.FC<KudoCategoriesProviderProps> = ({ children }) => {
  const router = useRouter();
  const { toast } = useToast();

  // Get organization ID from URL parameters
  const getOrganizationIdFromUrl = useCallback(() => {
    const { orgId } = router.query;
    return Array.isArray(orgId) ? orgId[0] : orgId || DEFAULT_ORG_ID;
  }, [router.query]);

  // Use a ref to store the organization ID to prevent re-renders
  const organizationIdRef = useRef<string>(getOrganizationIdFromUrl());

  // Create infrastructure components only once using refs
  const httpServiceRef = useRef<HttpService>(new HttpService());
  const repositoryRef = useRef(
    KudoCategoryInfrastructureFactory.createRepository(httpServiceRef.current)
  );
  const validatorRef = useRef(
    KudoCategoryInfrastructureFactory.createValidator(httpServiceRef.current)
  );

  // Create use cases with refs
  const getAllCategoriesUseCaseRef = useRef(new GetAllKudoCategoriesUseCase(repositoryRef.current));
  const createCategoryUseCaseRef = useRef(
    new CreateKudoCategoryUseCase(repositoryRef.current, validatorRef.current)
  );
  const updateCategoryUseCaseRef = useRef(
    new UpdateKudoCategoryUseCase(repositoryRef.current, validatorRef.current)
  );
  const deleteCategoryUseCaseRef = useRef(new DeleteKudoCategoryUseCase(repositoryRef.current));
  const getCategoryByIdUseCaseRef = useRef(new GetKudoCategoryByIdUseCase(repositoryRef.current));

  // State
  const [categories, setCategories] = useState<KudoCategoryOutputDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isRouterReady, setIsRouterReady] = useState(false);

  // Check if router is ready
  useEffect(() => {
    if (router.isReady) {
      setIsRouterReady(true);
      // Update organization ID ref when router is ready
      organizationIdRef.current = getOrganizationIdFromUrl();
    }
  }, [router.isReady, getOrganizationIdFromUrl]);

  // Fetch categories when router is ready
  useEffect(() => {
    if (isRouterReady) {
      fetchCategories();
    }
  }, [isRouterReady]);

  // Update organization ID ref when URL query changes
  useEffect(() => {
    if (router.isReady) {
      const newOrgId = getOrganizationIdFromUrl();
      if (newOrgId !== organizationIdRef.current) {
        organizationIdRef.current = newOrgId;
        fetchCategories();
      }
    }
  }, [router.query, getOrganizationIdFromUrl, router.isReady]);

  const fetchCategories = useCallback(async () => {
    const organizationId = organizationIdRef.current;

    if (!organizationId) {
      setError(new Error('Organization ID is required to fetch categories'));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const categoriesData = await getAllCategoriesUseCaseRef.current.execute(organizationId);
      setCategories(categoriesData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      console.error('Error fetching categories:', err);
      toast({
        title: 'Error - Failed to fetch categories',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createCategory = useCallback(
    async (name: string) => {
      const organizationId = organizationIdRef.current;

      if (!organizationId) {
        setError(new Error('Organization ID is required to create category'));
        return false;
      }

      setIsLoading(true);
      setError(null);

      try {
        const categoryDto: CreateKudoCategoryInputDto = {
          name,
          organizationId,
        };
        await createCategoryUseCaseRef.current.execute(categoryDto);

        toast({
          title: 'Success - Category created successfully',
        });

        await fetchCategories(); // Refresh the list
        return true;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        toast({
          title: `Error - Failed to create category: ${errorMsg}`,
          type: 'destructive',
        });
        setError(err instanceof Error ? err : new Error(String(err)));
        console.error('Error creating category:', err);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchCategories, toast]
  );

  const updateCategory = useCallback(
    async (id: string, name: string) => {
      const organizationId = organizationIdRef.current;

      if (!organizationId) {
        setError(new Error('Organization ID is required to update category'));
        return false;
      }

      setIsLoading(true);
      setError(null);

      try {
        const categoryDto: UpdateKudoCategoryInputDto = {
          name,
        };
        await updateCategoryUseCaseRef.current.execute(id, organizationId, categoryDto);

        toast({
          title: 'Success - Category updated successfully',
        });

        await fetchCategories(); // Refresh the list
        return true;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        toast({
          title: `Error - Failed to update category: ${errorMsg}`,
          type: 'destructive',
        });
        setError(err instanceof Error ? err : new Error(String(err)));
        console.error('Error updating category:', err);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchCategories, toast]
  );

  const deleteCategory = useCallback(
    async (id: string) => {
      const organizationId = organizationIdRef.current;

      if (!organizationId) {
        setError(new Error('Organization ID is required to delete category'));
        return false;
      }

      setIsLoading(true);
      setError(null);

      try {
        await deleteCategoryUseCaseRef.current.execute(id, organizationId);

        toast({
          title: 'Success - Category deleted successfully',
        });

        await fetchCategories(); // Refresh the list
        return true;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        toast({
          title: `Error - Failed to delete category: ${errorMsg}`,
          type: 'destructive',
        });
        setError(err instanceof Error ? err : new Error(String(err)));
        console.error('Error deleting category:', err);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchCategories, toast]
  );

  const getCategory = useCallback(async (id: string) => {
    const organizationId = organizationIdRef.current;

    if (!organizationId) {
      setError(new Error('Organization ID is required to get category'));
      return null;
    }

    setError(null);

    try {
      return await getCategoryByIdUseCaseRef.current.execute(id, organizationId);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      console.error('Error fetching category:', err);
      return null;
    }
  }, []);

  // Context value with memoization to prevent unnecessary re-renders
  const value = React.useMemo(
    () => ({
      categories,
      isLoading,
      error,
      fetchCategories,
      createCategory,
      updateCategory,
      deleteCategory,
      getCategory,
    }),
    [
      categories,
      isLoading,
      error,
      fetchCategories,
      createCategory,
      updateCategory,
      deleteCategory,
      getCategory,
    ]
  );

  return <KudoCategoriesContext.Provider value={value}>{children}</KudoCategoriesContext.Provider>;
};
