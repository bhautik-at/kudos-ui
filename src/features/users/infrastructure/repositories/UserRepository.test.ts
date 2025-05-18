import { UserRepository } from './UserRepository';
import { UserApiClient } from '../api/UserApiClient';
import { ApiError } from '@/shared/errors/ApiError';
import { User } from '../../domain/entities/User';
import { UserMapper } from '../../application/mappers/UserMapper';

// Mock the API client
jest.mock('../api/UserApiClient');
const MockedUserApiClient = UserApiClient as jest.MockedClass<typeof UserApiClient>;

// Mock the UserMapper
jest.mock('../../application/mappers/UserMapper');
const MockedUserMapper = UserMapper as jest.Mocked<typeof UserMapper>;

describe('UserRepository', () => {
  let repository: UserRepository;
  let mockApiClient: jest.Mocked<UserApiClient>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockApiClient = new MockedUserApiClient() as jest.Mocked<UserApiClient>;
    repository = new UserRepository(mockApiClient);

    // Set up default mock implementation for the mapper
    (MockedUserMapper.fromApiResponse as jest.Mock).mockImplementation(
      data =>
        new User({
          id: data.id,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          role: data.role,
          isVerified: data.isVerified,
        })
    );
  });

  describe('getCurrentUser', () => {
    it('should return User entity when API client returns user data', async () => {
      // Arrange
      const mockUserData = {
        id: 'user-123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        fullName: 'John Doe',
        role: 'Admin',
        isVerified: true,
      };

      mockApiClient.getCurrentUser.mockResolvedValue(mockUserData);

      // Act
      const result = await repository.getCurrentUser();

      // Assert
      expect(result).toMatchObject({
        id: 'user-123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'Admin',
        isVerified: true,
      });
      expect(mockApiClient.getCurrentUser).toHaveBeenCalledTimes(1);
      expect(MockedUserMapper.fromApiResponse).toHaveBeenCalledWith(mockUserData);
    });

    it('should return null when API client returns null', async () => {
      // Arrange
      mockApiClient.getCurrentUser.mockResolvedValue(null);

      // Act
      const result = await repository.getCurrentUser();

      // Assert
      expect(result).toBeNull();
      expect(mockApiClient.getCurrentUser).toHaveBeenCalledTimes(1);
      expect(MockedUserMapper.fromApiResponse).not.toHaveBeenCalled();
    });

    it('should return null when API client throws 401 error', async () => {
      // Arrange
      const apiError = new ApiError('Unauthorized', 401);
      mockApiClient.getCurrentUser.mockRejectedValue(apiError);

      // Act
      const result = await repository.getCurrentUser();

      // Assert
      expect(result).toBeNull();
      expect(mockApiClient.getCurrentUser).toHaveBeenCalledTimes(1);
    });

    it('should propagate other API errors', async () => {
      // Arrange
      const apiError = new ApiError('Bad Request', 400);
      mockApiClient.getCurrentUser.mockRejectedValue(apiError);

      // Act & Assert
      await expect(repository.getCurrentUser()).rejects.toThrow(apiError);
      expect(mockApiClient.getCurrentUser).toHaveBeenCalledTimes(1);
    });

    it('should propagate unexpected errors', async () => {
      // Arrange
      const error = new Error('Unexpected error');
      mockApiClient.getCurrentUser.mockRejectedValue(error);

      // Act & Assert
      await expect(repository.getCurrentUser()).rejects.toThrow(error);
      expect(mockApiClient.getCurrentUser).toHaveBeenCalledTimes(1);
    });
  });

  describe('acceptInvitation', () => {
    it('should return organization ID when API client successfully accepts invitation', async () => {
      // Arrange
      const organizationId = 'org-123';
      mockApiClient.acceptInvitation.mockResolvedValue({ organizationId });

      // Act
      const result = await repository.acceptInvitation(organizationId);

      // Assert
      expect(result).toBe(organizationId);
      expect(mockApiClient.acceptInvitation).toHaveBeenCalledWith(organizationId);
    });

    it('should propagate API errors', async () => {
      // Arrange
      const organizationId = 'org-123';
      const apiError = new ApiError('Invalid invitation', 400);
      mockApiClient.acceptInvitation.mockRejectedValue(apiError);

      // Act & Assert
      await expect(repository.acceptInvitation(organizationId)).rejects.toThrow(apiError);
      expect(mockApiClient.acceptInvitation).toHaveBeenCalledWith(organizationId);
    });

    it('should propagate unexpected errors', async () => {
      // Arrange
      const organizationId = 'org-123';
      const error = new Error('Unexpected error');
      mockApiClient.acceptInvitation.mockRejectedValue(error);

      // Act & Assert
      await expect(repository.acceptInvitation(organizationId)).rejects.toThrow(error);
      expect(mockApiClient.acceptInvitation).toHaveBeenCalledWith(organizationId);
    });
  });
});
