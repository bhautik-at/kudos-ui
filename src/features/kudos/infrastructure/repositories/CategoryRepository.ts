import {
  Category,
  CategoryRepository as CategoryRepositoryInterface,
} from '../../domain/interfaces/CategoryRepository';
import { CategoryApiClient } from '../api/CategoryApiClient';
import { ApiError } from '@/shared/errors/ApiError';

export class CategoryRepository implements CategoryRepositoryInterface {
  constructor(private apiClient: CategoryApiClient) {}

  async findById(id: string, organizationId: string): Promise<Category | null> {
    try {
      const categoryData = await this.apiClient.getCategoryById(id, organizationId);

      if (!categoryData) {
        return null;
      }

      return {
        id: categoryData.id,
        name: categoryData.name,
        description: categoryData.description,
        organizationId: categoryData.organization_id,
      };
    } catch (error) {
      console.error('Error fetching category:', error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to fetch category');
    }
  }

  async findAll(organizationId: string): Promise<Category[]> {
    try {
      const categories = await this.apiClient.getCategories(organizationId);

      return categories.map(categoryData => ({
        id: categoryData.id,
        name: categoryData.name,
        description: categoryData.description,
        organizationId: categoryData.organization_id,
      }));
    } catch (error) {
      console.error('Error fetching categories:', error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to fetch categories');
    }
  }
}
