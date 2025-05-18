import { CategoryApiClient } from './CategoryApiClient';
import { httpService } from '@/shared/services/http/HttpService';
import { ApiError } from '@/shared/errors/ApiError';
import { IHttpResponse } from '@/shared/services/http/interfaces/IHttpResponse';

// Mock the http service
jest.mock('@/shared/services/http/HttpService', () => ({
  httpService: {
    get: jest.fn(),
  },
}));

describe('CategoryApiClient', () => {
  let apiClient: CategoryApiClient;
  const mockHttpService = httpService as jest.Mocked<typeof httpService>;
  
  beforeEach(() => {
    apiClient = new CategoryApiClient('/test-api');
    jest.clearAllMocks();
  });
  
  describe('getCategories', () => {
    it('should fetch categories successfully', async () => {
      // Arrange
      const organizationId = 'org-123';
      
      const mockResponse: IHttpResponse = {
        data: {
          success: true,
          data: [
            {
              id: 'cat-123',
              name: 'Teamwork',
              description: 'Recognizing great collaboration',
              organization_id: 'org-123',
            },
            {
              id: 'cat-456',
              name: 'Innovation',
              description: 'New ideas and approaches',
              organization_id: 'org-123',
            },
          ],
        },
        status: 200,
        statusText: 'OK',
        headers: {},
      };
      
      mockHttpService.get.mockResolvedValueOnce(mockResponse);
      
      // Act
      const result = await apiClient.getCategories(organizationId);
      
      // Assert
      expect(mockHttpService.get).toHaveBeenCalledWith('/test-api/kudos/categories', {
        params: { organization_id: organizationId },
      });
      
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('cat-123');
      expect(result[1].id).toBe('cat-456');
    });
    
    it('should throw ApiError when http request fails', async () => {
      // Arrange
      const organizationId = 'org-123';
      const apiError = new ApiError('Unauthorized', 401);
      
      mockHttpService.get.mockRejectedValueOnce(apiError);
      
      // Act & Assert
      await expect(apiClient.getCategories(organizationId)).rejects.toThrow(apiError);
    });
    
    it('should wrap non-ApiError errors', async () => {
      // Arrange
      const organizationId = 'org-123';
      const networkError = new Error('Network error');
      
      mockHttpService.get.mockRejectedValueOnce(networkError);
      
      // Act & Assert
      await expect(apiClient.getCategories(organizationId)).rejects.toThrow(ApiError);
      await expect(apiClient.getCategories(organizationId)).rejects.toMatchObject({
        message: 'Failed to fetch categories',
        status: 500,
      });
    });
  });
  
  describe('getCategoryById', () => {
    it('should fetch a category by id successfully', async () => {
      // Arrange
      const categoryId = 'cat-123';
      const organizationId = 'org-123';
      
      const mockResponse: IHttpResponse = {
        data: {
          success: true,
          data: {
            id: 'cat-123',
            name: 'Teamwork',
            description: 'Recognizing great collaboration',
            organization_id: 'org-123',
          },
        },
        status: 200,
        statusText: 'OK',
        headers: {},
      };
      
      mockHttpService.get.mockResolvedValueOnce(mockResponse);
      
      // Act
      const result = await apiClient.getCategoryById(categoryId, organizationId);
      
      // Assert
      expect(mockHttpService.get).toHaveBeenCalledWith('/test-api/kudos/categories/cat-123', {
        params: { organization_id: organizationId },
      });
      
      expect(result).toEqual({
        id: 'cat-123',
        name: 'Teamwork',
        description: 'Recognizing great collaboration',
        organization_id: 'org-123',
      });
    });
    
    it('should return null when receiving a 404 error', async () => {
      // Arrange
      const categoryId = 'non-existent-category';
      const organizationId = 'org-123';
      
      // Create an error object with a status property
      const notFoundError = new Error('Not found') as Error & { status: number };
      notFoundError.status = 404;
      
      mockHttpService.get.mockRejectedValueOnce(notFoundError);
      
      // Act
      const result = await apiClient.getCategoryById(categoryId, organizationId);
      
      // Assert
      expect(result).toBeNull();
    });
    
    it('should propagate ApiError when http request fails with non-404 error', async () => {
      // Arrange
      const categoryId = 'cat-123';
      const organizationId = 'org-123';
      const apiError = new ApiError('Unauthorized', 401);
      
      mockHttpService.get.mockRejectedValueOnce(apiError);
      
      // Act & Assert
      await expect(apiClient.getCategoryById(categoryId, organizationId)).rejects.toThrow(apiError);
    });
    
    it('should wrap non-ApiError errors', async () => {
      // Arrange
      const categoryId = 'cat-123';
      const organizationId = 'org-123';
      const networkError = new Error('Network error');
      
      mockHttpService.get.mockRejectedValueOnce(networkError);
      
      // Act & Assert
      await expect(apiClient.getCategoryById(categoryId, organizationId)).rejects.toThrow(ApiError);
      await expect(apiClient.getCategoryById(categoryId, organizationId)).rejects.toMatchObject({
        message: 'Failed to fetch category',
        status: 500,
      });
    });
  });
}); 