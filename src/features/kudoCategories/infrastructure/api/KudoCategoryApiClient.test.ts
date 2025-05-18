import { KudoCategoryApiClient } from './KudoCategoryApiClient';
import { HttpService } from '@/shared/services/http/HttpService';
import { HttpError } from '@/shared/services/http/HttpError';

// Mock HttpService
jest.mock('@/shared/services/http/HttpService');

describe('KudoCategoryApiClient', () => {
  let apiClient: KudoCategoryApiClient;
  let mockHttpService: jest.Mocked<HttpService>;
  const organizationId = 'org-123';
  const categoryId = 'cat-456';

  beforeEach(() => {
    mockHttpService = new HttpService() as jest.Mocked<HttpService>;
    apiClient = new KudoCategoryApiClient(mockHttpService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createKudoCategory', () => {
    it('should create a kudo category successfully', async () => {
      // Arrange
      const requestData = { name: 'Test Category' };
      const responseData = {
        success: true,
        category: {
          id: categoryId,
          name: 'Test Category',
          organizationId,
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z',
        },
      };

      mockHttpService.post.mockResolvedValue({
        data: responseData,
        status: 201,
        statusText: 'Created',
        headers: {},
      });

      // Act
      const result = await apiClient.createKudoCategory(organizationId, requestData);

      // Assert
      expect(result).toEqual(responseData);
      expect(mockHttpService.post).toHaveBeenCalledWith(
        `/api/organizations/${organizationId}/kudo-categories`,
        requestData
      );
    });

    it('should handle errors when creating a kudo category', async () => {
      // Arrange
      const requestData = { name: 'Test Category' };
      const error = new HttpError(400, 'Bad Request', '/api/test', { message: 'Invalid data' });

      mockHttpService.post.mockRejectedValue(error);

      // Act & Assert
      await expect(apiClient.createKudoCategory(organizationId, requestData)).rejects.toThrow(error);
    });
  });

  describe('getAllKudoCategories', () => {
    it('should get all kudo categories successfully', async () => {
      // Arrange
      const responseData = {
        success: true,
        categories: [
          {
            id: 'cat-1',
            name: 'Category 1',
            organizationId,
            createdAt: '2023-01-01T00:00:00.000Z',
            updatedAt: '2023-01-01T00:00:00.000Z',
          },
          {
            id: 'cat-2',
            name: 'Category 2',
            organizationId,
            createdAt: '2023-01-01T00:00:00.000Z',
            updatedAt: '2023-01-01T00:00:00.000Z',
          },
        ],
      };

      mockHttpService.get.mockResolvedValue({
        data: responseData,
        status: 200,
        statusText: 'OK',
        headers: {},
      });

      // Act
      const result = await apiClient.getAllKudoCategories(organizationId);

      // Assert
      expect(result).toEqual(responseData);
      expect(mockHttpService.get).toHaveBeenCalledWith(
        `/api/organizations/${organizationId}/kudo-categories`
      );
    });

    it('should propagate errors when getting kudo categories fails', async () => {
      // Arrange
      const error = new HttpError(500, 'Server Error', '/api/test', { message: 'Server error' });
      mockHttpService.get.mockRejectedValue(error);

      // Act & Assert
      await expect(apiClient.getAllKudoCategories(organizationId)).rejects.toThrow();
    });
  });

  describe('getKudoCategoryById', () => {
    it('should get a kudo category by id successfully', async () => {
      // Arrange
      const responseData = {
        success: true,
        category: {
          id: categoryId,
          name: 'Test Category',
          organizationId,
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z',
        },
      };

      mockHttpService.get.mockResolvedValue({
        data: responseData,
        status: 200,
        statusText: 'OK',
        headers: {},
      });

      // Act
      const result = await apiClient.getKudoCategoryById(organizationId, categoryId);

      // Assert
      expect(result).toEqual(responseData);
      expect(mockHttpService.get).toHaveBeenCalledWith(
        `/api/organizations/${organizationId}/kudo-categories/${categoryId}`
      );
    });

    it('should handle errors when getting a kudo category by id', async () => {
      // Arrange
      const error = new HttpError(404, 'Not Found', '/api/test', { message: 'Category not found' });
      mockHttpService.get.mockRejectedValue(error);

      // Act & Assert
      await expect(apiClient.getKudoCategoryById(organizationId, categoryId)).rejects.toThrow(error);
    });
  });

  describe('updateKudoCategory', () => {
    it('should update a kudo category successfully', async () => {
      // Arrange
      const requestData = { name: 'Updated Category' };
      const responseData = {
        success: true,
        category: {
          id: categoryId,
          name: 'Updated Category',
          organizationId,
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-02T00:00:00.000Z',
        },
      };

      mockHttpService.put.mockResolvedValue({
        data: responseData,
        status: 200,
        statusText: 'OK',
        headers: {},
      });

      // Act
      const result = await apiClient.updateKudoCategory(organizationId, categoryId, requestData);

      // Assert
      expect(result).toEqual(responseData);
      expect(mockHttpService.put).toHaveBeenCalledWith(
        `/api/organizations/${organizationId}/kudo-categories/${categoryId}`,
        requestData
      );
    });

    it('should handle errors when updating a kudo category', async () => {
      // Arrange
      const requestData = { name: 'Updated Category' };
      const error = new HttpError(400, 'Bad Request', '/api/test', { message: 'Invalid data' });

      mockHttpService.put.mockRejectedValue(error);

      // Act & Assert
      await expect(apiClient.updateKudoCategory(organizationId, categoryId, requestData)).rejects.toThrow(
        error
      );
    });
  });

  describe('deleteKudoCategory', () => {
    it('should delete a kudo category successfully', async () => {
      // Arrange
      const responseData = {
        success: true,
        message: 'Category deleted successfully',
      };

      mockHttpService.delete.mockResolvedValue({
        data: responseData,
        status: 200,
        statusText: 'OK',
        headers: {},
      });

      // Act
      const result = await apiClient.deleteKudoCategory(organizationId, categoryId);

      // Assert
      expect(result).toEqual(responseData);
      expect(mockHttpService.delete).toHaveBeenCalledWith(
        `/api/organizations/${organizationId}/kudo-categories/${categoryId}`
      );
    });

    it('should handle errors when deleting a kudo category', async () => {
      // Arrange
      const error = new HttpError(404, 'Not Found', '/api/test', { message: 'Category not found' });

      mockHttpService.delete.mockRejectedValue(error);

      // Act & Assert
      await expect(apiClient.deleteKudoCategory(organizationId, categoryId)).rejects.toThrow(error);
    });
  });
}); 