import { UserApiClient } from './UserApiClient';
import { httpService } from '@/shared/services';
import { ApiError } from '@/shared/errors/ApiError';

// Mock the httpService
jest.mock('@/shared/services', () => ({
  httpService: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

describe('UserApiClient', () => {
  let apiClient: UserApiClient;

  beforeEach(() => {
    jest.clearAllMocks();
    apiClient = new UserApiClient();
  });

  describe('getCurrentUser', () => {
    it('should return user data on successful API response', async () => {
      // Arrange
      const mockUserData = {
        id: 'user-123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        fullName: 'John Doe',
        isVerified: true,
        role: 'Admin',
      };

      const mockResponse = {
        data: {
          success: true,
          data: mockUserData,
        },
        status: 200,
      };

      (httpService.get as jest.Mock).mockResolvedValue(mockResponse);

      // Act
      const result = await apiClient.getCurrentUser();

      // Assert
      expect(result).toEqual(mockUserData);
      expect(httpService.get).toHaveBeenCalledWith('/api/users/me');
    });

    it('should throw ApiError when API response is not successful', async () => {
      // Arrange
      const mockResponse = {
        data: {
          success: false,
          message: 'Failed to fetch user details',
        },
        status: 400,
      };

      (httpService.get as jest.Mock).mockResolvedValue(mockResponse);

      // Act & Assert
      await expect(apiClient.getCurrentUser()).rejects.toThrow('Failed to fetch user details');
      expect(httpService.get).toHaveBeenCalledWith('/api/users/me');
    });

    it('should handle network errors', async () => {
      // Arrange
      const networkError = new Error('Network error');
      (httpService.get as jest.Mock).mockRejectedValue(networkError);

      // Act & Assert
      await expect(apiClient.getCurrentUser()).rejects.toThrow('Network error');
      expect(httpService.get).toHaveBeenCalledWith('/api/users/me');
    });
  });

  describe('acceptInvitation', () => {
    it('should return organization ID on successful API response', async () => {
      // Arrange
      const organizationId = 'org-123';
      const mockResponse = {
        data: {
          success: true,
          data: {
            organizationId,
          },
        },
        status: 200,
      };

      (httpService.post as jest.Mock).mockResolvedValue(mockResponse);

      // Act
      const result = await apiClient.acceptInvitation(organizationId);

      // Assert
      expect(result).toEqual({ organizationId });
      expect(httpService.post).toHaveBeenCalledWith('/api/users/accept-invitation', {
        organizationId,
      });
    });

    it('should throw ApiError when API response is not successful', async () => {
      // Arrange
      const organizationId = 'org-123';
      const mockResponse = {
        data: {
          success: false,
          message: 'Invalid invitation',
        },
        status: 400,
      };

      (httpService.post as jest.Mock).mockResolvedValue(mockResponse);

      // Act & Assert
      await expect(apiClient.acceptInvitation(organizationId)).rejects.toThrow(
        'Invalid invitation'
      );
      expect(httpService.post).toHaveBeenCalledWith('/api/users/accept-invitation', {
        organizationId,
      });
    });

    it('should handle network errors', async () => {
      // Arrange
      const organizationId = 'org-123';
      const networkError = new Error('Network error');
      (httpService.post as jest.Mock).mockRejectedValue(networkError);

      // Act & Assert
      await expect(apiClient.acceptInvitation(organizationId)).rejects.toThrow('Network error');
      expect(httpService.post).toHaveBeenCalledWith('/api/users/accept-invitation', {
        organizationId,
      });
    });
  });
});
