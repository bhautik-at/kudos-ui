import { CategoryApiClient } from './CategoryApiClient';
import { httpService } from '@/shared/services/http/HttpService';
import { ApiError } from '@/shared/errors/ApiError';

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
  
  describe('getCategoryById', () => {
    const categoryId = 'cat-123';
    const organizationId = 'org-123';
    
    it('should return null when a 404 error is encountered', async () => {
      // Arrange
      const error: any = new Error('Not found');
      error.status = 404;
      mockHttpService.get.mockRejectedValueOnce(error);
      
      // Act
      const result = await apiClient.getCategoryById(categoryId, organizationId);
      
      // Assert
      expect(mockHttpService.get).toHaveBeenCalledWith('/test-api/kudos/categories/cat-123', {
        params: { organization_id: organizationId },
      });
      expect(result).toBeNull();
    });
    
    it('should rethrow ApiError when it occurs', async () => {
      // Arrange
      const apiError = new ApiError('Unauthorized', 401);
      mockHttpService.get.mockRejectedValueOnce(apiError);
      
      // Act & Assert
      await expect(apiClient.getCategoryById(categoryId, organizationId)).rejects.toThrow(apiError);
      expect(mockHttpService.get).toHaveBeenCalledWith('/test-api/kudos/categories/cat-123', {
        params: { organization_id: organizationId },
      });
    });
    
    it('should wrap other errors with ApiError', async () => {
      // Arrange
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