import { ApiError } from '@/shared/errors/ApiError';
import { httpService } from '@/shared/services/http/HttpService';
import { Category } from '../../domain/interfaces/CategoryRepository';

interface CategoryApiData {
  id: string;
  name: string;
  description?: string;
  organization_id: string;
}

interface CategoryResponse {
  success: boolean;
  data: CategoryApiData;
}

interface CategoriesListResponse {
  success: boolean;
  data: CategoryApiData[];
}

export class CategoryApiClient {
  private baseUrl: string;

  constructor(baseUrl = '/api') {
    this.baseUrl = baseUrl;
  }

  async getCategories(organizationId: string): Promise<CategoryApiData[]> {
    try {
      const response = await httpService.get(`${this.baseUrl}/kudos/categories`, {
        params: { organization_id: organizationId },
      });

      return response.data.data;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to fetch categories', 500);
    }
  }

  async getCategoryById(id: string, organizationId: string): Promise<CategoryApiData | null> {
    try {
      const response = await httpService.get(`${this.baseUrl}/kudos/categories/${id}`, {
        params: { organization_id: organizationId },
      });

      return response.data.data;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      // Special case for 404 - return null instead of throwing
      if (error && typeof error === 'object' && 'status' in error && error.status === 404) {
        return null;
      }
      throw new ApiError('Failed to fetch category', 500);
    }
  }
}
