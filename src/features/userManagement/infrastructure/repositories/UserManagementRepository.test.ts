import { UserManagementRepository } from './UserManagementRepository';
import { UserManagementApiClient } from '../api/UserManagementApiClient';
import { UserRole } from '../../domain/entities/UserRole';
import { ApiError } from '@/shared/errors/ApiError';
import { UserManagementUser } from '../../domain/entities/UserManagementUser';

// Mock the API client
jest.mock('../api/UserManagementApiClient');

describe('UserManagementRepository', () => {
  let repository: UserManagementRepository;
  let mockApiClient: jest.Mocked<UserManagementApiClient>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockApiClient = new UserManagementApiClient() as jest.Mocked<UserManagementApiClient>;
    repository = new UserManagementRepository(mockApiClient);
  });

  describe('getUsers', () => {
    it('should return domain entities when API client returns user data', async () => {
      // Arrange
      const mockApiResponse = {
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
      };

      mockApiClient.getUsers.mockResolvedValue(mockApiResponse);

      // Act
      const result = await repository.getUsers({
        page: 1,
        pageSize: 10,
        organizationId: 'org123',
        sortDirection: 'asc',
      });

      // Assert
      expect(mockApiClient.getUsers).toHaveBeenCalledWith(1, 10, 'firstName', 'org123', 'asc');

      expect(result.items[0]).toBeInstanceOf(UserManagementUser);
      expect(result.items[1]).toBeInstanceOf(UserManagementUser);

      expect(result.items[0].id).toBe('user1');
      expect(result.items[0].email).toBe('user1@example.com');
      expect(result.items[0].firstName).toBe('John');
      expect(result.items[0].lastName).toBe('Doe');
      expect(result.items[0].role).toBe(UserRole.Member);
      expect(result.items[0].isVerified).toBe(false);

      expect(result.items[1].id).toBe('user2');
      expect(result.items[1].email).toBe('user2@example.com');
      expect(result.items[1].firstName).toBe('Jane');
      expect(result.items[1].lastName).toBe('Smith');
      expect(result.items[1].teamName).toBe('Marketing');
      expect(result.items[1].role).toBe(UserRole.TechLeader);
      expect(result.items[1].isVerified).toBe(true);

      expect(result.totalItems).toBe(2);
      expect(result.totalPages).toBe(1);
      expect(result.currentPage).toBe(1);
    });

    it('should propagate API errors', async () => {
      // Arrange
      const apiError = new ApiError('Failed to fetch users', 500);
      mockApiClient.getUsers.mockRejectedValue(apiError);

      // Act & Assert
      await expect(
        repository.getUsers({
          page: 1,
          pageSize: 10,
          organizationId: 'org123',
        })
      ).rejects.toThrow(apiError);
    });
  });

  describe('updateUserRole', () => {
    it('should return updated user when API client succeeds', async () => {
      // Arrange
      const mockUpdatedUser = {
        id: 'user1',
        email: 'user1@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: UserRole.TechLeader,
        isVerified: true,
      };

      mockApiClient.updateUserRole.mockResolvedValue(mockUpdatedUser);

      // Act
      const result = await repository.updateUserRole('user1', UserRole.TechLeader);

      // Assert
      expect(mockApiClient.updateUserRole).toHaveBeenCalledWith('user1', UserRole.TechLeader);
      expect(result).toBeInstanceOf(UserManagementUser);
      expect(result.id).toBe('user1');
      expect(result.role).toBe(UserRole.TechLeader);
    });

    it('should propagate API errors', async () => {
      // Arrange
      const apiError = new ApiError('User not found', 404);
      mockApiClient.updateUserRole.mockRejectedValue(apiError);

      // Act & Assert
      await expect(repository.updateUserRole('user1', UserRole.TechLeader)).rejects.toThrow(
        apiError
      );
    });
  });

  describe('inviteUsers', () => {
    it('should return invited count when API client succeeds', async () => {
      // Arrange
      const mockInviteResult = {
        invitedCount: 2,
      };

      mockApiClient.inviteUsers.mockResolvedValue(mockInviteResult);

      // Act
      const result = await repository.inviteUsers(
        ['user1@example.com', 'user2@example.com'],
        'org123'
      );

      // Assert
      expect(mockApiClient.inviteUsers).toHaveBeenCalledWith(
        ['user1@example.com', 'user2@example.com'],
        'org123'
      );
      expect(result).toBe(2);
    });
  });

  describe('deleteUser', () => {
    it('should return success when API client succeeds', async () => {
      // Arrange
      mockApiClient.deleteUser.mockResolvedValue(true);

      // Act
      const result = await repository.deleteUser('user1');

      // Assert
      expect(mockApiClient.deleteUser).toHaveBeenCalledWith('user1');
      expect(result).toBe(true);
    });

    it('should propagate API errors', async () => {
      // Arrange
      const apiError = new ApiError('Failed to delete user', 400);
      mockApiClient.deleteUser.mockRejectedValue(apiError);

      // Act & Assert
      await expect(repository.deleteUser('user1')).rejects.toThrow(apiError);
    });
  });
});
