import { KudoApiClient } from './KudoApiClient';
import { httpService } from '@/shared/services/http/HttpService';
import { ApiError } from '@/shared/errors/ApiError';
import { IHttpResponse } from '@/shared/services/http/interfaces/IHttpResponse';

// Mock the http service
jest.mock('@/shared/services/http/HttpService', () => ({
  httpService: {
    post: jest.fn(),
    put: jest.fn(),
    get: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('KudoApiClient', () => {
  let apiClient: KudoApiClient;
  const mockHttpService = httpService as jest.Mocked<typeof httpService>;
  
  beforeEach(() => {
    apiClient = new KudoApiClient('/test-api');
    jest.clearAllMocks();
  });
  
  describe('createKudo', () => {
    const createKudoData = {
      recipient_id: 'user-123',
      team_id: 'team-456',
      category_id: 'cat-789',
      message: 'Great job!',
      organization_id: 'org-123',
    };
    
    const mockResponse: IHttpResponse = {
      data: {
        data: {
          id: 'kudo-123',
          recipient_id: 'user-123',
          recipient_name: 'John Doe',
          sender_id: 'user-456',
          sender_name: 'Jane Smith',
          team_id: 'team-456',
          team_name: 'Engineering',
          category_id: 'cat-789',
          category_name: 'Innovation',
          message: 'Great job!',
          organization_id: 'org-123',
          created_at: '2023-01-01T00:00:00.000Z',
        }
      },
      status: 200,
      statusText: 'OK',
      headers: {},
    };
    
    it('should create a kudo successfully', async () => {
      // Arrange
      mockHttpService.post.mockResolvedValueOnce(mockResponse);
      
      // Act
      const result = await apiClient.createKudo(createKudoData);
      
      // Assert
      expect(mockHttpService.post).toHaveBeenCalledWith('/test-api/kudos', createKudoData);
      expect(result).toEqual(mockResponse.data.data);
    });
    
    it('should handle direct data response format', async () => {
      // Arrange - API response without data wrapper
      const directResponse: IHttpResponse = {
        data: mockResponse.data.data,
        status: 200,
        statusText: 'OK',
        headers: {},
      };
      mockHttpService.post.mockResolvedValueOnce(directResponse);
      
      // Act
      const result = await apiClient.createKudo(createKudoData);
      
      // Assert
      expect(result).toEqual(mockResponse.data.data);
    });
    
    it('should propagate ApiError when it occurs', async () => {
      // Arrange
      const apiError = new ApiError('Validation failed', 400);
      mockHttpService.post.mockRejectedValueOnce(apiError);
      
      // Act & Assert
      await expect(apiClient.createKudo(createKudoData)).rejects.toThrow(apiError);
    });
    
    it('should wrap non-ApiError errors', async () => {
      // Arrange
      const networkError = new Error('Network error');
      mockHttpService.post.mockRejectedValueOnce(networkError);
      
      // Act & Assert
      await expect(apiClient.createKudo(createKudoData)).rejects.toThrow(ApiError);
      await expect(apiClient.createKudo(createKudoData)).rejects.toMatchObject({
        message: 'Failed to create kudo',
        status: 500
      });
    });
  });
  
  describe('updateKudo', () => {
    const kudoId = 'kudo-123';
    const updateKudoData = {
      recipient_id: 'user-789',
      team_id: 'team-456',
      category_id: 'cat-101',
      message: 'Updated message',
    };
    
    const mockResponse: IHttpResponse = {
      data: {
        data: {
          id: 'kudo-123',
          recipient_id: 'user-789',
          recipient_name: 'Alice Johnson',
          sender_id: 'user-456',
          sender_name: 'Jane Smith',
          team_id: 'team-456',
          team_name: 'Engineering',
          category_id: 'cat-101',
          category_name: 'Teamwork',
          message: 'Updated message',
          organization_id: 'org-123',
          created_at: '2023-01-01T00:00:00.000Z',
          updated_at: '2023-01-02T00:00:00.000Z',
        }
      },
      status: 200,
      statusText: 'OK',
      headers: {},
    };
    
    it('should update a kudo successfully', async () => {
      // Arrange
      mockHttpService.put.mockResolvedValueOnce(mockResponse);
      
      // Act
      const result = await apiClient.updateKudo(kudoId, updateKudoData);
      
      // Assert
      expect(mockHttpService.put).toHaveBeenCalledWith('/test-api/kudos/kudo-123', updateKudoData);
      expect(result).toEqual(mockResponse.data.data);
    });
    
    it('should wrap non-ApiError errors', async () => {
      // Arrange
      const networkError = new Error('Network error');
      mockHttpService.put.mockRejectedValueOnce(networkError);
      
      // Act & Assert
      await expect(apiClient.updateKudo(kudoId, updateKudoData)).rejects.toThrow(ApiError);
      await expect(apiClient.updateKudo(kudoId, updateKudoData)).rejects.toMatchObject({
        message: 'Failed to update kudo',
        status: 500
      });
    });
  });
  
  describe('deleteKudo', () => {
    const kudoId = 'kudo-123';
    
    it('should delete a kudo successfully', async () => {
      // Arrange
      mockHttpService.delete.mockResolvedValueOnce({
        data: { success: true },
        status: 200,
        statusText: 'OK',
        headers: {},
      });
      
      // Act
      const result = await apiClient.deleteKudo(kudoId);
      
      // Assert
      expect(mockHttpService.delete).toHaveBeenCalledWith('/test-api/kudos/kudo-123');
      expect(result).toBe(true);
    });
    
    it('should handle unsuccessful deletion', async () => {
      // Arrange
      mockHttpService.delete.mockResolvedValueOnce({
        data: { success: false },
        status: 200,
        statusText: 'OK',
        headers: {},
      });
      
      // Act
      const result = await apiClient.deleteKudo(kudoId);
      
      // Assert
      expect(result).toBe(false);
    });
    
    it('should wrap non-ApiError errors', async () => {
      // Arrange
      const networkError = new Error('Network error');
      mockHttpService.delete.mockRejectedValueOnce(networkError);
      
      // Act & Assert
      await expect(apiClient.deleteKudo(kudoId)).rejects.toThrow(ApiError);
    });
  });
  
  describe('getKudos', () => {
    const params = {
      recipient_id: 'user-123',
      organization_id: 'org-123',
      page: 1,
      limit: 10,
    };
    
    const mockResponse: IHttpResponse = {
      data: {
        success: true,
        data: [
          {
            id: 'kudo-123',
            recipient_id: 'user-123',
            recipient_name: 'John Doe',
            sender_id: 'user-456',
            sender_name: 'Jane Smith',
            team_id: 'team-456',
            team_name: 'Engineering',
            category_id: 'cat-789',
            category_name: 'Innovation',
            message: 'Great job!',
            organization_id: 'org-123',
            created_at: '2023-01-01T00:00:00.000Z',
          }
        ],
        pagination: {
          total: 1,
          pages: 1,
          current_page: 1,
          limit: 10,
        }
      },
      status: 200,
      statusText: 'OK',
      headers: {},
    };
    
    it('should fetch kudos successfully', async () => {
      // Arrange
      mockHttpService.get.mockResolvedValueOnce(mockResponse);
      
      // Act
      const result = await apiClient.getKudos(params);
      
      // Assert
      expect(mockHttpService.get).toHaveBeenCalledWith('/test-api/kudos', { params });
      expect(result).toEqual(mockResponse.data);
      expect(result.data).toHaveLength(1);
      expect(result.data[0].id).toBe('kudo-123');
    });
    
    it('should propagate ApiError when it occurs', async () => {
      // Arrange
      const apiError = new ApiError('Unauthorized', 401);
      mockHttpService.get.mockRejectedValueOnce(apiError);
      
      // Act & Assert
      await expect(apiClient.getKudos(params)).rejects.toThrow(apiError);
      expect(mockHttpService.get).toHaveBeenCalledWith('/test-api/kudos', { params });
    });
    
    it('should wrap non-ApiError errors', async () => {
      // Arrange
      const networkError = new Error('Network error');
      mockHttpService.get.mockRejectedValueOnce(networkError);
      
      // Act & Assert
      await expect(apiClient.getKudos(params)).rejects.toThrow(ApiError);
      await expect(apiClient.getKudos(params)).rejects.toMatchObject({
        message: 'Failed to fetch kudos',
        status: 500,
      });
    });
  });
  
  describe('getKudoById', () => {
    const kudoId = 'kudo-123';
    const organizationId = 'org-123';
    
    const mockResponse: IHttpResponse = {
      data: {
        data: {
          id: 'kudo-123',
          recipient_id: 'user-123',
          recipient_name: 'John Doe',
          sender_id: 'user-456',
          sender_name: 'Jane Smith',
          team_id: 'team-456',
          team_name: 'Engineering',
          category_id: 'cat-789',
          category_name: 'Innovation',
          message: 'Great job!',
          organization_id: 'org-123',
          created_at: '2023-01-01T00:00:00.000Z',
        }
      },
      status: 200,
      statusText: 'OK',
      headers: {},
    };
    
    it('should fetch a kudo by ID successfully', async () => {
      // Arrange
      mockHttpService.get.mockResolvedValueOnce(mockResponse);
      
      // Act
      const result = await apiClient.getKudoById(kudoId, organizationId);
      
      // Assert
      expect(mockHttpService.get).toHaveBeenCalledWith('/test-api/kudos/kudo-123', {
        params: { organization_id: organizationId },
      });
      expect(result).toEqual(mockResponse.data.data);
    });
    
    it('should handle direct data response format', async () => {
      // Arrange - API response without data wrapper
      const directResponse: IHttpResponse = {
        data: mockResponse.data.data,
        status: 200,
        statusText: 'OK',
        headers: {},
      };
      mockHttpService.get.mockResolvedValueOnce(directResponse);
      
      // Act
      const result = await apiClient.getKudoById(kudoId, organizationId);
      
      // Assert
      expect(result).toEqual(mockResponse.data.data);
    });
    
    it('should propagate ApiError when it occurs', async () => {
      // Arrange
      const apiError = new ApiError('Unauthorized', 401);
      mockHttpService.get.mockRejectedValueOnce(apiError);
      
      // Act & Assert
      await expect(apiClient.getKudoById(kudoId, organizationId)).rejects.toThrow(apiError);
      expect(mockHttpService.get).toHaveBeenCalledWith('/test-api/kudos/kudo-123', {
        params: { organization_id: organizationId },
      });
    });
    
    it('should wrap non-ApiError errors', async () => {
      // Arrange
      const networkError = new Error('Network error');
      mockHttpService.get.mockRejectedValueOnce(networkError);
      
      // Act & Assert
      await expect(apiClient.getKudoById(kudoId, organizationId)).rejects.toThrow(ApiError);
      await expect(apiClient.getKudoById(kudoId, organizationId)).rejects.toMatchObject({
        message: 'Failed to fetch kudo',
        status: 500,
      });
    });
  });
}); 