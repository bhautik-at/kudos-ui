# Kudo Categories Implementation Plan

This document outlines the implementation plan for the Kudo Categories feature using clean architecture principles.

## 1. Feature Overview

Kudo Categories allow organization administrators to create and manage categories for kudos, which helps in organizing and categorizing recognition within the organization.

## 2. Architecture Implementation

Following the clean architecture approach, we'll organize code into the following layers:

1. **Domain Layer** - Core business logic and entities
2. **Application Layer** - Use cases that orchestrate domain entities
3. **Infrastructure Layer** - API clients and storage implementations
4. **Presentation Layer** - UI components and state management

## 3. Domain Layer Implementation

### 3.1 Entities

```typescript
// features/kudoCategories/domain/entities/KudoCategory.ts
interface KudoCategoryProps {
  id?: string;
  name: string;
  organizationId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class KudoCategory {
  readonly id?: string;
  readonly name: string;
  readonly organizationId: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(props: KudoCategoryProps) {
    this.id = props.id;
    this.name = props.name;
    this.organizationId = props.organizationId;
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();

    this.validate();
  }

  private validate(): void {
    if (!this.name || this.name.trim().length === 0) {
      throw new Error('Category name is required');
    }

    if (!this.organizationId) {
      throw new Error('Organization ID is required');
    }
  }
}
```

### 3.2 Repository Interface

```typescript
// features/kudoCategories/domain/interfaces/KudoCategoryRepository.ts
import { KudoCategory } from '../entities/KudoCategory';

export interface KudoCategoryRepository {
  create(category: KudoCategory): Promise<KudoCategory>;
  findAll(organizationId: string): Promise<KudoCategory[]>;
  findById(organizationId: string, id: string): Promise<KudoCategory | null>;
  update(category: KudoCategory): Promise<KudoCategory>;
  delete(organizationId: string, id: string): Promise<void>;
}
```

### 3.3 Domain Errors

```typescript
// features/kudoCategories/domain/errors/KudoCategoryNotFoundError.ts
export class KudoCategoryNotFoundError extends Error {
  constructor(id: string) {
    super(`Kudo category with id ${id} not found`);
    this.name = 'KudoCategoryNotFoundError';
  }
}

// features/kudoCategories/domain/errors/InvalidKudoCategoryError.ts
export class InvalidKudoCategoryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidKudoCategoryError';
  }
}
```

## 4. Application Layer Implementation

### 4.1 DTOs

```typescript
// features/kudoCategories/application/dtos/CreateKudoCategoryInputDto.ts
export interface CreateKudoCategoryInputDto {
  name: string;
  organizationId: string;
}

// features/kudoCategories/application/dtos/UpdateKudoCategoryInputDto.ts
export interface UpdateKudoCategoryInputDto {
  id: string;
  name: string;
  organizationId: string;
}

// features/kudoCategories/application/dtos/KudoCategoryOutputDto.ts
export interface KudoCategoryOutputDto {
  id: string;
  name: string;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}
```

### 4.2 Mappers

```typescript
// features/kudoCategories/application/mappers/KudoCategoryMapper.ts
import { KudoCategory } from '../../domain/entities/KudoCategory';
import { KudoCategoryOutputDto } from '../dtos/KudoCategoryOutputDto';
import { CreateKudoCategoryInputDto } from '../dtos/CreateKudoCategoryInputDto';
import { UpdateKudoCategoryInputDto } from '../dtos/UpdateKudoCategoryInputDto';

export class KudoCategoryMapper {
  static toEntity(dto: CreateKudoCategoryInputDto | UpdateKudoCategoryInputDto): KudoCategory {
    return new KudoCategory({
      id: 'id' in dto ? dto.id : undefined,
      name: dto.name,
      organizationId: dto.organizationId,
    });
  }

  static toDto(entity: KudoCategory): KudoCategoryOutputDto {
    return {
      id: entity.id!,
      name: entity.name,
      organizationId: entity.organizationId,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }

  static toDtoList(entities: KudoCategory[]): KudoCategoryOutputDto[] {
    return entities.map(entity => this.toDto(entity));
  }
}
```

### 4.3 Use Cases

```typescript
// features/kudoCategories/application/useCases/CreateKudoCategoryUseCase.ts
import { KudoCategoryRepository } from '../../domain/interfaces/KudoCategoryRepository';
import { CreateKudoCategoryInputDto } from '../dtos/CreateKudoCategoryInputDto';
import { KudoCategoryOutputDto } from '../dtos/KudoCategoryOutputDto';
import { KudoCategoryMapper } from '../mappers/KudoCategoryMapper';

export class CreateKudoCategoryUseCase {
  constructor(private repository: KudoCategoryRepository) {}

  async execute(input: CreateKudoCategoryInputDto): Promise<KudoCategoryOutputDto> {
    const category = KudoCategoryMapper.toEntity(input);
    const savedCategory = await this.repository.create(category);
    return KudoCategoryMapper.toDto(savedCategory);
  }
}

// features/kudoCategories/application/useCases/GetKudoCategoriesUseCase.ts
import { KudoCategoryRepository } from '../../domain/interfaces/KudoCategoryRepository';
import { KudoCategoryOutputDto } from '../dtos/KudoCategoryOutputDto';
import { KudoCategoryMapper } from '../mappers/KudoCategoryMapper';

export class GetKudoCategoriesUseCase {
  constructor(private repository: KudoCategoryRepository) {}

  async execute(organizationId: string): Promise<KudoCategoryOutputDto[]> {
    const categories = await this.repository.findAll(organizationId);
    return KudoCategoryMapper.toDtoList(categories);
  }
}

// Additional use cases for Get, Update, and Delete would follow similar patterns
```

## 5. Infrastructure Layer Implementation

### 5.1 HttpService

````typescript
// shared/services/HttpService.ts
export class HttpService {
  private baseUrl: string;

  constructor(baseUrl = '/api') {
    this.baseUrl = baseUrl;
  }

  async get<T>(path: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  }

  async post<T>(path: string, body: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  }

  async put<T>(path: string, body: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  }

  async delete<T>(path: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  }
}

### 5.2 API Client

```typescript
// features/kudoCategories/infrastructure/api/KudoCategoryApiClient.ts
import { HttpService } from '@/shared/services/HttpService';

interface KudoCategoryApiResponse {
  id: string;
  name: string;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}

interface CategoryResponse {
  success: boolean;
  category: KudoCategoryApiResponse;
}

interface CategoriesResponse {
  success: boolean;
  categories: KudoCategoryApiResponse[];
}

export class KudoCategoryApiClient {
  private httpService: HttpService;

  constructor(httpService?: HttpService) {
    this.httpService = httpService || new HttpService();
  }

  async createCategory(organizationId: string, name: string): Promise<KudoCategoryApiResponse> {
    const response = await this.httpService.post<CategoryResponse>(
      `/organizations/${organizationId}/kudo-categories`,
      { name }
    );

    return response.category;
  }

  async getCategories(organizationId: string): Promise<KudoCategoryApiResponse[]> {
    const response = await this.httpService.get<CategoriesResponse>(
      `/organizations/${organizationId}/kudo-categories`
    );

    return response.categories;
  }

  async getCategory(organizationId: string, id: string): Promise<KudoCategoryApiResponse> {
    const response = await this.httpService.get<CategoryResponse>(
      `/organizations/${organizationId}/kudo-categories/${id}`
    );

    return response.category;
  }

  async updateCategory(organizationId: string, id: string, name: string): Promise<KudoCategoryApiResponse> {
    const response = await this.httpService.put<CategoryResponse>(
      `/organizations/${organizationId}/kudo-categories/${id}`,
      { name }
    );

    return response.category;
  }

  async deleteCategory(organizationId: string, id: string): Promise<{ success: boolean, message: string }> {
    return await this.httpService.delete<{ success: boolean, message: string }>(
      `/organizations/${organizationId}/kudo-categories/${id}`
    );
  }
}
````

### 5.3 Repository Implementation

```typescript
// features/kudoCategories/infrastructure/repositories/KudoCategoryRepository.ts
import { KudoCategory } from '../../domain/entities/KudoCategory';
import { KudoCategoryRepository as KudoCategoryRepositoryInterface } from '../../domain/interfaces/KudoCategoryRepository';
import { KudoCategoryApiClient } from '../api/KudoCategoryApiClient';
import { HttpService } from '@/shared/services/HttpService';
import { KudoCategoryNotFoundError } from '../../domain/errors/KudoCategoryNotFoundError';

export class KudoCategoryRepository implements KudoCategoryRepositoryInterface {
  constructor(private apiClient: KudoCategoryApiClient) {}

  async create(category: KudoCategory): Promise<KudoCategory> {
    try {
      const data = await this.apiClient.createCategory(category.organizationId, category.name);

      return new KudoCategory({
        id: data.id,
        name: data.name,
        organizationId: data.organizationId,
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
      });
    } catch (error) {
      console.error('Error creating kudo category:', error);
      throw error;
    }
  }

  async findAll(organizationId: string): Promise<KudoCategory[]> {
    try {
      const data = await this.apiClient.getCategories(organizationId);

      return data.map(
        item =>
          new KudoCategory({
            id: item.id,
            name: item.name,
            organizationId: item.organizationId,
            createdAt: new Date(item.createdAt),
            updatedAt: new Date(item.updatedAt),
          })
      );
    } catch (error) {
      console.error('Error fetching kudo categories:', error);
      throw error;
    }
  }

  // Additional methods for findById, update, and delete would follow similar patterns
}
```

## 6. Presentation Layer Implementation

### 6.1 Components

```typescript
// features/kudoCategories/presentation/components/KudoCategoryForm.tsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/shared/components/atoms/Button';
import { Input } from '@/shared/components/atoms/Input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/atoms/Form';

// Form validation schema
const formSchema = z.object({
  name: z.string().min(1, 'Category name is required'),
});

type FormValues = z.infer<typeof formSchema>;

interface KudoCategoryFormProps {
  initialData?: { name: string };
  onSubmit: (data: { name: string }) => Promise<void>;
  isLoading?: boolean;
}

export function KudoCategoryForm({ initialData, onSubmit, isLoading = false }: KudoCategoryFormProps) {
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || { name: '' },
  });

  const handleSubmit = async (values: FormValues) => {
    setError(null);
    try {
      await onSubmit(values);
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Name</FormLabel>
              <FormControl>
                <Input {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {error && <div className="text-red-500 text-sm">{error}</div>}

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : initialData ? 'Update Category' : 'Create Category'}
        </Button>
      </form>
    </Form>
  );
}

// features/kudoCategories/presentation/components/KudoCategoryList.tsx
import { Button } from '@/shared/components/atoms/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/atoms/Table';
import { KudoCategoryOutputDto } from '../../application/dtos/KudoCategoryOutputDto';

interface KudoCategoryListProps {
  categories: KudoCategoryOutputDto[];
  isLoading: boolean;
  onEdit: (category: KudoCategoryOutputDto) => void;
  onDelete: (category: KudoCategoryOutputDto) => void;
}

export function KudoCategoryList({ categories, isLoading, onEdit, onDelete }: KudoCategoryListProps) {
  if (isLoading) {
    return <div>Loading categories...</div>;
  }

  if (categories.length === 0) {
    return <div>No categories found.</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {categories.map((category) => (
          <TableRow key={category.id}>
            <TableCell>{category.name}</TableCell>
            <TableCell>{new Date(category.createdAt).toLocaleDateString()}</TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => onEdit(category)}>
                  Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => onDelete(category)}>
                  Delete
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

### 6.2 Hooks

```typescript
// features/kudoCategories/presentation/hooks/useKudoCategories.ts
import { useState, useEffect, useCallback } from 'react';
import { KudoCategoryApiClient } from '../../infrastructure/api/KudoCategoryApiClient';
import { KudoCategoryRepository } from '../../infrastructure/repositories/KudoCategoryRepository';
import { GetKudoCategoriesUseCase } from '../../application/useCases/GetKudoCategoriesUseCase';
import { CreateKudoCategoryUseCase } from '../../application/useCases/CreateKudoCategoryUseCase';
import { UpdateKudoCategoryUseCase } from '../../application/useCases/UpdateKudoCategoryUseCase';
import { DeleteKudoCategoryUseCase } from '../../application/useCases/DeleteKudoCategoryUseCase';
import { KudoCategoryOutputDto } from '../../application/dtos/KudoCategoryOutputDto';

export function useKudoCategories(organizationId: string) {
  const [categories, setCategories] = useState<KudoCategoryOutputDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Create dependencies
  const httpService = new HttpService();
  const apiClient = new KudoCategoryApiClient(httpService);
  const repository = new KudoCategoryRepository(apiClient);

  // Create use cases
  const getCategoriesUseCase = new GetKudoCategoriesUseCase(repository);
  const createCategoryUseCase = new CreateKudoCategoryUseCase(repository);
  const updateCategoryUseCase = new UpdateKudoCategoryUseCase(repository);
  const deleteCategoryUseCase = new DeleteKudoCategoryUseCase(repository);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getCategoriesUseCase.execute(organizationId);
      setCategories(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [organizationId, getCategoriesUseCase]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const createCategory = async (name: string) => {
    try {
      const createDto = { name, organizationId };
      await createCategoryUseCase.execute(createDto);
      await fetchCategories();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    }
  };

  const updateCategory = async (id: string, name: string) => {
    try {
      const updateDto = { id, name, organizationId };
      await updateCategoryUseCase.execute(updateDto);
      await fetchCategories();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await deleteCategoryUseCase.execute(organizationId, id);
      await fetchCategories();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    }
  };

  return {
    categories,
    loading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    refreshCategories: fetchCategories,
  };
}
```

### 6.3 Templates

```typescript
// features/kudoCategories/presentation/templates/KudoCategoriesTemplate.tsx
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/atoms/Dialog';
import { Button } from '@/shared/components/atoms/Button';
import { useKudoCategories } from '../hooks/useKudoCategories';
import { KudoCategoryForm } from '../components/KudoCategoryForm';
import { KudoCategoryList } from '../components/KudoCategoryList';
import { KudoCategoryOutputDto } from '../../application/dtos/KudoCategoryOutputDto';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/shared/components/atoms/AlertDialog';

interface KudoCategoriesTemplateProps {
  organizationId: string;
}

export function KudoCategoriesTemplate({ organizationId }: KudoCategoriesTemplateProps) {
  const { categories, loading, error, createCategory, updateCategory, deleteCategory } = useKudoCategories(organizationId);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<KudoCategoryOutputDto | null>(null);

  const handleCreateSubmit = async (data: { name: string }) => {
    await createCategory(data.name);
    setIsCreateModalOpen(false);
  };

  const handleEditSubmit = async (data: { name: string }) => {
    if (selectedCategory) {
      await updateCategory(selectedCategory.id, data.name);
      setIsEditModalOpen(false);
      setSelectedCategory(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedCategory) {
      await deleteCategory(selectedCategory.id);
      setIsDeleteModalOpen(false);
      setSelectedCategory(null);
    }
  };

  const openEditModal = (category: KudoCategoryOutputDto) => {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (category: KudoCategoryOutputDto) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Kudo Categories</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>Create Category</Button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error.message}
        </div>
      )}

      <KudoCategoryList
        categories={categories}
        isLoading={loading}
        onEdit={openEditModal}
        onDelete={openDeleteModal}
      />

      {/* Create Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Category</DialogTitle>
          </DialogHeader>
          <KudoCategoryForm onSubmit={handleCreateSubmit} isLoading={loading} />
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          {selectedCategory && (
            <KudoCategoryForm
              initialData={{ name: selectedCategory.name }}
              onSubmit={handleEditSubmit}
              isLoading={loading}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the category "{selectedCategory?.name}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
```

## 7. Page Implementation

```typescript
// pages/organizations/[organizationId]/categories.tsx
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { KudoCategoriesTemplate } from '@/features/kudoCategories/presentation/templates/KudoCategoriesTemplate';

const KudoCategoriesPage: NextPage = () => {
  const router = useRouter();
  const { organizationId } = router.query;

  if (!organizationId || typeof organizationId !== 'string') {
    return <div>Invalid organization ID</div>;
  }

  return (
    <>
      <Head>
        <title>Kudo Categories</title>
        <meta name="description" content="Manage kudo categories for your organization" />
      </Head>
      <KudoCategoriesTemplate organizationId={organizationId} />
    </>
  );
};

export default KudoCategoriesPage;
```

## 8. Testing Strategy

### 8.1 Unit Tests

1. **Domain Entity Tests**: Test validation rules and behaviors
2. **Use Case Tests**: Test business logic with mocked repositories
3. **Mapper Tests**: Test entity to DTO and DTO to entity mappings

### 8.2 Integration Tests

1. **Repository Tests**: Test repository implementation with mock API
2. **Hook Tests**: Test custom hooks with mock API responses

### 8.3 Component Tests

1. **Component Rendering Tests**: Test UI components render correctly
2. **Component Interaction Tests**: Test user interactions and callbacks

### 8.4 E2E Tests

1. **User Flow Tests**: Test complete category management flow

## 9. Implementation Steps

1. Create Domain Layer

   - Implement KudoCategory entity
   - Define repository interfaces
   - Implement domain errors

2. Create Application Layer

   - Implement DTOs
   - Implement Mappers
   - Implement Use Cases

3. Create Infrastructure Layer

   - Implement API Client
   - Implement Repository

4. Create Presentation Layer

   - Implement UI Components
   - Implement Custom Hooks
   - Implement Template

5. Create Page Component

   - Implement Categories Page

6. Implement Tests
   - Write unit tests
   - Write integration tests
   - Write component tests
   - Write E2E tests

## 10. Error Handling Strategy

1. **Domain Layer**: Throw specific domain errors
2. **Application Layer**: Catch domain errors and transform as needed
3. **Infrastructure Layer**: Handle API errors and transform to domain errors
4. **Presentation Layer**: Display appropriate error messages to users

## 11. Performance Considerations

1. **Memoization**: Use React.memo for performance-critical components
2. **Optimistic Updates**: Update UI before API calls complete for better UX
3. **Pagination**: If categories grow large, implement pagination

## 12. Accessibility Considerations

1. **ARIA Attributes**: Ensure proper ARIA attributes for all components
2. **Keyboard Navigation**: Implement keyboard navigation for all interactive elements
3. **Screen Reader Support**: Test with screen readers for accessibility
