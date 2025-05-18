import { UserManagementApiClient } from './UserManagementApiClient';
import { httpService } from '@/shared/services/http/HttpService';
import { ApiError } from '@/shared/errors/ApiError';
import { UserRole } from '../../domain/entities/UserRole';

// Mock the httpService
jest.mock('@/shared/services/http/HttpService', () => ({
  httpService: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('UserManagementApiClient', () => {
  let apiClient: UserManagementApiClient;

  beforeEach(() => {
    jest.clearAllMocks();
    apiClient = new UserManagementApiClient();
  });

  describe('getUsers', () => {
    it('should fetch users successfully', async () => {
      // Arrange
      const mockResponse = {
        data: {
          success: true,
          data: {
            items: [
              {
                id: 'user1',
                email: 'user1@example.com',
                firstName: 'John',
                lastName: 'Doe',
                role: UserRole.Member,
                isVerified: false,
              },
              {
                id: 'user2',
                email: 'user2@example.com',
                firstName: 'Jane',
                lastName: 'Smith',
                teamName: 'Marketing',
                role: UserRole.TechLeader,
                isVerified: true,
              },
            ],
            totalItems: 2,
            totalPages: 1,
            currentPage: 1,
          },
        },
        status: 200,
      };

      (httpService.get as jest.Mock).mockResolvedValue(mockResponse);

      // Act
      const result = await apiClient.getUsers(1, 10, 'firstName', 'org123', 'asc');

      // Assert
      expect(httpService.get).toHaveBeenCalledWith(
        '/api/users?page=1&pageSize=10&organizationId=org123&sortField=firstName&sortDirection=asc'
      );
      expect(result).toEqual(mockResponse.data.data);
    });

    it('should require organizationId', async () => {
      // Act & Assert
      await expect(apiClient.getUsers(1, 10, 'firstName', '')).rejects.toThrow(
        new ApiError('Organization ID is required', 400)
      );
      expect(httpService.get).not.toHaveBeenCalled();
    });

    it('should handle API error responses', async () => {
      // Arrange
      const mockResponse = {
        data: {
          success: false,
          message: 'Failed to fetch users',
        },
        status: 500,
      };

      (httpService.get as jest.Mock).mockResolvedValue(mockResponse);

      // Act & Assert
      await expect(apiClient.getUsers(1, 10, 'firstName', 'org123')).rejects.toThrow(
        new ApiError('Failed to fetch users', 500)
      );
    });

    it('should handle network errors', async () => {
      // Arrange
      const networkError = new Error('Network error');
      (httpService.get as jest.Mock).mockRejectedValue(networkError);

      // Act & Assert
      await expect(apiClient.getUsers(1, 10, 'firstName', 'org123')).rejects.toThrow(
        new ApiError('Network error', 500)
      );
    });
  });

  describe('updateUserRole', () => {
    it('should update user role successfully', async () => {
      // Arrange
      const userId = 'user123';
      const role = UserRole.TechLeader;
      const mockResponse = {
        data: {
          success: true,
          data: {
            id: userId,
            email: 'user@example.com',
            firstName: 'John',
            lastName: 'Doe',
            role: role,
            isVerified: true,
          },
        },
        status: 200,
      };

      (httpService.put as jest.Mock).mockResolvedValue(mockResponse);

      // Act
      const result = await apiClient.updateUserRole(userId, role);

      // Assert
      expect(httpService.put).toHaveBeenCalledWith(`/api/users/${userId}/role`, { role });
      expect(result).toEqual(mockResponse.data.data);
    });

    it('should handle API error responses', async () => {
      // Arrange
      const userId = 'user123';
      const role = UserRole.TechLeader;
      const mockResponse = {
        data: {
          success: false,
          message: 'User not found',
        },
        status: 404,
      };

      (httpService.put as jest.Mock).mockResolvedValue(mockResponse);

      // Act & Assert
      await expect(apiClient.updateUserRole(userId, role)).rejects.toThrow(
        new ApiError('User not found', 404)
      );
    });
  });

  describe('inviteUsers', () => {
    it('should invite users successfully', async () => {
      // Arrange
      const emails = ['new1@example.com', 'new2@example.com'];
      const organizationId = 'org123';
      const mockResponse = {
        data: {
          success: true,
          data: {
            invitedCount: 2,
          },
        },
        status: 200,
      };

      (httpService.post as jest.Mock).mockResolvedValue(mockResponse);

      // Act
      const result = await apiClient.inviteUsers(emails, organizationId);

      // Assert
      expect(httpService.post).toHaveBeenCalledWith('/api/users/invite', {
        emails,
        organizationId,
      });
      expect(result).toEqual({ invitedCount: 2 });
    });

    it('should invite users without organizationId', async () => {
      // Arrange
      const emails = ['new1@example.com', 'new2@example.com'];
      const mockResponse = {
        data: {
          success: true,
          data: {
            invitedCount: 2,
          },
        },
        status: 200,
      };

      (httpService.post as jest.Mock).mockResolvedValue(mockResponse);

      // Act
      const result = await apiClient.inviteUsers(emails);

      // Assert
      expect(httpService.post).toHaveBeenCalledWith('/api/users/invite', { emails });
      expect(result).toEqual({ invitedCount: 2 });
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      // Arrange
      const userId = 'user123';
      const mockResponse = {
        data: {
          success: true,
          data: {
            success: true,
          },
        },
        status: 200,
      };

      (httpService.delete as jest.Mock).mockResolvedValue(mockResponse);

      // Act
      const result = await apiClient.deleteUser(userId);

      // Assert
      expect(httpService.delete).toHaveBeenCalledWith(`/api/users/${userId}`);
      expect(result).toBe(true);
    });

    it('should handle API error responses', async () => {
      // Arrange
      const userId = 'user123';
      const mockResponse = {
        data: {
          success: false,
          message: 'Cannot delete user',
        },
        status: 400,
      };

      (httpService.delete as jest.Mock).mockResolvedValue(mockResponse);

      // Act & Assert
      await expect(apiClient.deleteUser(userId)).rejects.toThrow(
        new ApiError('Cannot delete user', 400)
      );
    });
  });
});
