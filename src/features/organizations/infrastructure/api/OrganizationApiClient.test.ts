import { OrganizationApiClient } from './OrganizationApiClient';
import { httpService } from '@/shared/services/http/HttpService';
import { HttpError } from '@/shared/services/http/HttpError';
import { IHttpResponse } from '@/shared/services/http/interfaces/IHttpResponse';

// Mock the http service
jest.mock('@/shared/services/http/HttpService', () => ({
  httpService: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('OrganizationApiClient', () => {
  let apiClient: OrganizationApiClient;
  const mockHttpService = httpService as jest.Mocked<typeof httpService>;
  
  beforeEach(() => {
    apiClient = new OrganizationApiClient('/test-api');
    jest.clearAllMocks();
  });
  
  describe('createOrganization', () => {
    const createOrgData = {
      name: 'Test Organization',
      description: 'This is a test organization',
    };
    
    const mockResponse: IHttpResponse = {
      data: {
        success: true,
        organization: {
          id: 'org-123',
          name: 'Test Organization',
          description: 'This is a test organization',
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z',
        }
      },
      status: 200,
      statusText: 'OK',
      headers: {},
    };
    
    it('should create an organization successfully', async () => {
      // Arrange
      mockHttpService.post.mockResolvedValueOnce(mockResponse);
      
      // Act
      const result = await apiClient.createOrganization(createOrgData);
      
      // Assert
      expect(mockHttpService.post).toHaveBeenCalledWith('/test-api/organizations', createOrgData);
      expect(result).toEqual(mockResponse.data.organization);
    });
    
    it('should throw error when API returns failure', async () => {
      // Arrange
      const errorResponse: IHttpResponse = {
        data: {
          success: false,
          message: 'Failed to create organization',
        },
        status: 400,
        statusText: 'Bad Request',
        headers: {},
      };
      
      mockHttpService.post.mockResolvedValueOnce(errorResponse);
      
      // Act & Assert
      await expect(apiClient.createOrganization(createOrgData))
        .rejects.toThrow('Failed to create organization');
    });
    
    it('should propagate HTTP errors', async () => {
      // Arrange
      const httpError = new HttpError(500, 'Internal Server Error', '/test-api/organizations');
      mockHttpService.post.mockRejectedValueOnce(httpError);
      
      // Act & Assert
      await expect(apiClient.createOrganization(createOrgData)).rejects.toThrow(httpError);
    });
  });
  
  describe('getOrganizations', () => {
    const mockResponse: IHttpResponse = {
      data: {
        success: true,
        organizations: [
          {
            id: 'org-123',
            name: 'Organization 1',
            description: 'Description 1',
            createdAt: '2023-01-01T00:00:00.000Z',
            updatedAt: '2023-01-01T00:00:00.000Z',
          },
          {
            id: 'org-456',
            name: 'Organization 2',
            description: 'Description 2',
            createdAt: '2023-01-02T00:00:00.000Z',
            updatedAt: '2023-01-02T00:00:00.000Z',
          }
        ]
      },
      status: 200,
      statusText: 'OK',
      headers: {},
    };
    
    it('should fetch organizations successfully', async () => {
      // Arrange
      mockHttpService.get.mockResolvedValueOnce(mockResponse);
      
      // Act
      const result = await apiClient.getOrganizations();
      
      // Assert
      expect(mockHttpService.get).toHaveBeenCalledWith('/test-api/organizations');
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('org-123');
      expect(result[1].id).toBe('org-456');
    });
    
    it('should throw error when API returns failure', async () => {
      // Arrange
      const errorResponse: IHttpResponse = {
        data: {
          success: false,
          message: 'Failed to fetch organizations',
        },
        status: 400,
        statusText: 'Bad Request',
        headers: {},
      };
      
      mockHttpService.get.mockResolvedValueOnce(errorResponse);
      
      // Act & Assert
      await expect(apiClient.getOrganizations())
        .rejects.toThrow('Failed to fetch organizations');
    });
    
    it('should propagate HTTP errors', async () => {
      // Arrange
      const httpError = new HttpError(500, 'Internal Server Error', '/test-api/organizations');
      mockHttpService.get.mockRejectedValueOnce(httpError);
      
      // Act & Assert
      await expect(apiClient.getOrganizations()).rejects.toThrow(httpError);
    });
  });
  
  describe('getOrganization', () => {
    const orgId = 'org-123';
    const mockResponse: IHttpResponse = {
      data: {
        success: true,
        organization: {
          id: 'org-123',
          name: 'Test Organization',
          description: 'This is a test organization',
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z',
        }
      },
      status: 200,
      statusText: 'OK',
      headers: {},
    };
    
    it('should fetch a single organization successfully', async () => {
      // Arrange
      mockHttpService.get.mockResolvedValueOnce(mockResponse);
      
      // Act
      const result = await apiClient.getOrganization(orgId);
      
      // Assert
      expect(mockHttpService.get).toHaveBeenCalledWith('/test-api/organizations/org-123');
      expect(result).toEqual(mockResponse.data.organization);
    });
    
    it('should throw error when API returns failure', async () => {
      // Arrange
      const errorResponse: IHttpResponse = {
        data: {
          success: false,
          message: 'Organization not found',
        },
        status: 404,
        statusText: 'Not Found',
        headers: {},
      };
      
      mockHttpService.get.mockResolvedValueOnce(errorResponse);
      
      // Act & Assert
      await expect(apiClient.getOrganization(orgId))
        .rejects.toThrow('Organization not found');
    });
    
    it('should propagate HTTP errors', async () => {
      // Arrange
      const httpError = new HttpError(500, 'Internal Server Error', `/test-api/organizations/${orgId}`);
      mockHttpService.get.mockRejectedValueOnce(httpError);
      
      // Act & Assert
      await expect(apiClient.getOrganization(orgId)).rejects.toThrow(httpError);
    });
  });
  
  describe('updateOrganization', () => {
    const orgId = 'org-123';
    const updateData = {
      name: 'Updated Organization',
      description: 'Updated description',
    };
    
    const mockResponse: IHttpResponse = {
      data: {
        success: true,
        organization: {
          id: 'org-123',
          name: 'Updated Organization',
          description: 'Updated description',
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-02T00:00:00.000Z',
        }
      },
      status: 200,
      statusText: 'OK',
      headers: {},
    };
    
    it('should update an organization successfully', async () => {
      // Arrange
      mockHttpService.put.mockResolvedValueOnce(mockResponse);
      
      // Act
      const result = await apiClient.updateOrganization(orgId, updateData);
      
      // Assert
      expect(mockHttpService.put).toHaveBeenCalledWith('/test-api/organizations/org-123', updateData);
      expect(result).toEqual(mockResponse.data.organization);
    });
    
    it('should throw error when API returns failure', async () => {
      // Arrange
      const errorResponse: IHttpResponse = {
        data: {
          success: false,
          message: 'Failed to update organization',
        },
        status: 400,
        statusText: 'Bad Request',
        headers: {},
      };
      
      mockHttpService.put.mockResolvedValueOnce(errorResponse);
      
      // Act & Assert
      await expect(apiClient.updateOrganization(orgId, updateData))
        .rejects.toThrow('Failed to update organization');
    });
    
    it('should propagate HTTP errors', async () => {
      // Arrange
      const httpError = new HttpError(500, 'Internal Server Error', `/test-api/organizations/${orgId}`);
      mockHttpService.put.mockRejectedValueOnce(httpError);
      
      // Act & Assert
      await expect(apiClient.updateOrganization(orgId, updateData)).rejects.toThrow(httpError);
    });
  });
  
  describe('deleteOrganization', () => {
    const orgId = 'org-123';
    
    const mockResponse: IHttpResponse = {
      data: {
        success: true,
      },
      status: 200,
      statusText: 'OK',
      headers: {},
    };
    
    it('should delete an organization successfully', async () => {
      // Arrange
      mockHttpService.delete.mockResolvedValueOnce(mockResponse);
      
      // Act
      await apiClient.deleteOrganization(orgId);
      
      // Assert
      expect(mockHttpService.delete).toHaveBeenCalledWith('/test-api/organizations/org-123');
    });
    
    it('should throw error when API returns failure', async () => {
      // Arrange
      const errorResponse: IHttpResponse = {
        data: {
          success: false,
          message: 'Failed to delete organization',
        },
        status: 400,
        statusText: 'Bad Request',
        headers: {},
      };
      
      mockHttpService.delete.mockResolvedValueOnce(errorResponse);
      
      // Act & Assert
      await expect(apiClient.deleteOrganization(orgId))
        .rejects.toThrow('Failed to delete organization');
    });
    
    it('should propagate HTTP errors', async () => {
      // Arrange
      const httpError = new HttpError(500, 'Internal Server Error', `/test-api/organizations/${orgId}`);
      mockHttpService.delete.mockRejectedValueOnce(httpError);
      
      // Act & Assert
      await expect(apiClient.deleteOrganization(orgId)).rejects.toThrow(httpError);
    });
  });
}); 