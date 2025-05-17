import { HttpService } from '@/shared/services/http/HttpService';
import { HttpError } from '@/shared/services/http/HttpError';

// API response types
export interface KudoCategoryResponse {
  id: string;
  name: string;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateKudoCategoryRequest {
  name: string;
}

export interface UpdateKudoCategoryRequest {
  name: string;
}

export interface CreateKudoCategoryResponse {
  success: boolean;
  category: KudoCategoryResponse;
}

export interface GetAllKudoCategoriesResponse {
  success: boolean;
  categories: KudoCategoryResponse[];
}

export interface GetKudoCategoryResponse {
  success: boolean;
  category: KudoCategoryResponse;
}

export interface UpdateKudoCategoryResponse {
  success: boolean;
  category: KudoCategoryResponse;
}

export interface DeleteKudoCategoryResponse {
  success: boolean;
  message: string;
}

export class KudoCategoryApiClient {
  private httpService: HttpService;

  constructor(httpService: HttpService) {
    this.httpService = httpService;
  }

  /**
   * Create a new kudo category
   */
  async createKudoCategory(
    organizationId: string,
    request: CreateKudoCategoryRequest
  ): Promise<CreateKudoCategoryResponse> {
    try {
      const response = await this.httpService.post<CreateKudoCategoryResponse>(
        `/api/organizations/${organizationId}/kudo-categories`,
        request
      );
      return response.data;
    } catch (error) {
      this.handleApiError(error);
      throw error;
    }
  }

  /**
   * Get all kudo categories for an organization
   */
  async getAllKudoCategories(organizationId: string): Promise<GetAllKudoCategoriesResponse> {
    try {
      const response = await this.httpService.get<GetAllKudoCategoriesResponse>(
        `/api/organizations/${organizationId}/kudo-categories`
      );
      return response.data;
    } catch (error) {
      this.handleApiError(error);
    }
  }

  /**
   * Get a kudo category by ID
   */
  async getKudoCategoryById(
    organizationId: string,
    categoryId: string
  ): Promise<GetKudoCategoryResponse> {
    try {
      const response = await this.httpService.get<GetKudoCategoryResponse>(
        `/api/organizations/${organizationId}/kudo-categories/${categoryId}`
      );
      return response.data;
    } catch (error) {
      this.handleApiError(error);
      throw error;
    }
  }

  /**
   * Update a kudo category
   */
  async updateKudoCategory(
    organizationId: string,
    categoryId: string,
    request: UpdateKudoCategoryRequest
  ): Promise<UpdateKudoCategoryResponse> {
    try {
      const response = await this.httpService.put<UpdateKudoCategoryResponse>(
        `/api/organizations/${organizationId}/kudo-categories/${categoryId}`,
        request
      );
      return response.data;
    } catch (error) {
      this.handleApiError(error);
      throw error;
    }
  }

  /**
   * Delete a kudo category
   */
  async deleteKudoCategory(
    organizationId: string,
    categoryId: string
  ): Promise<DeleteKudoCategoryResponse> {
    try {
      const response = await this.httpService.delete<DeleteKudoCategoryResponse>(
        `/api/organizations/${organizationId}/kudo-categories/${categoryId}`
      );
      return response.data;
    } catch (error) {
      this.handleApiError(error);
      throw error;
    }
  }

  /**
   * Handle API errors and transform them into application-specific errors
   */
  private handleApiError(error: unknown): never {
    if (error instanceof HttpError) {
      // Transform HTTP errors as needed
      // You could add specific handling for different status codes
      throw error;
    }

    // If it's not an HttpError, rethrow it
    throw error;
  }
}
