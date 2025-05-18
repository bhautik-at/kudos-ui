import { GetCurrentUserUseCase } from './GetCurrentUserUseCase';
import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import { User } from '../../domain/entities/User';

// Mock the UserMapper
jest.mock('../mappers/UserMapper', () => ({
  UserMapper: {
    toDto: jest.fn(user => ({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      isVerified: user.isVerified,
      role: user.role,
    })),
  },
}));

// Mock the repository interface
const mockUserRepository: jest.Mocked<IUserRepository> = {
  getCurrentUser: jest.fn(),
  acceptInvitation: jest.fn(),
};

describe('GetCurrentUserUseCase', () => {
  let useCase: GetCurrentUserUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new GetCurrentUserUseCase(mockUserRepository);
  });

  it('should return user DTO when user exists', async () => {
    // Arrange
    const mockUser = new User({
      id: 'user-123',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      role: 'Admin',
      isVerified: true,
    });

    mockUserRepository.getCurrentUser.mockResolvedValue(mockUser);

    // Act
    const result = await useCase.execute();

    // Assert
    expect(result).not.toBeNull();
    expect(result).toEqual({
      id: 'user-123',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      fullName: 'John Doe',
      isVerified: true,
      role: 'Admin',
    });
    expect(mockUserRepository.getCurrentUser).toHaveBeenCalledTimes(1);
  });

  it('should return null when user does not exist', async () => {
    // Arrange
    mockUserRepository.getCurrentUser.mockResolvedValue(null);

    // Act
    const result = await useCase.execute();

    // Assert
    expect(result).toBeNull();
    expect(mockUserRepository.getCurrentUser).toHaveBeenCalledTimes(1);
  });

  it('should propagate errors from repository', async () => {
    // Arrange
    const error = new Error('Repository error');
    mockUserRepository.getCurrentUser.mockRejectedValue(error);

    // Act & Assert
    await expect(useCase.execute()).rejects.toThrow('Repository error');
    expect(mockUserRepository.getCurrentUser).toHaveBeenCalledTimes(1);
  });
});
