import { GetUsersUseCase } from './GetUsersUseCase';
import { IUserManagementRepository } from '../../domain/interfaces/IUserManagementRepository';
import { UserManagementUser } from '../../domain/entities/UserManagementUser';
import { UserRole } from '../../domain/entities/UserRole';
import { UserManagementMapper } from '../mappers/UserManagementMapper';

// Mock the mapper
jest.mock('../mappers/UserManagementMapper');

describe('GetUsersUseCase', () => {
  // Mock repository
  let mockRepository: jest.Mocked<IUserManagementRepository>;
  let getUsersUseCase: GetUsersUseCase;

  beforeEach(() => {
    // Create a mock repository
    mockRepository = {
      getUsers: jest.fn(),
      updateUserRole: jest.fn(),
      inviteUsers: jest.fn(),
      deleteUser: jest.fn(),
    } as jest.Mocked<IUserManagementRepository>;

    // Reset mapper mock
    jest.clearAllMocks();

    // Set up the use case with the mock repository
    getUsersUseCase = new GetUsersUseCase(mockRepository);
  });

  it('should call repository and return mapped result', async () => {
    // Arrange
    const mockInputDto = {
      page: 1,
      pageSize: 10,
      organizationId: 'org123',
      sortDirection: 'asc' as const,
    };

    const mockUser1 = new UserManagementUser({
      id: 'user1',
      email: 'user1@example.com',
      firstName: 'John',
      lastName: 'Doe',
      role: UserRole.Member,
    });

    const mockUser2 = new UserManagementUser({
      id: 'user2',
      email: 'user2@example.com',
      firstName: 'Jane',
      lastName: 'Smith',
      role: UserRole.TechLeader,
    });

    const mockPaginatedResult = {
      items: [mockUser1, mockUser2],
      totalItems: 2,
      totalPages: 1,
      currentPage: 1,
    };

    const mockMappedResult = {
      users: [
        {
          id: 'user1',
          email: 'user1@example.com',
          firstName: 'John',
          lastName: 'Doe',
          fullName: 'John Doe',
          role: UserRole.Member,
          isVerified: false,
        },
        {
          id: 'user2',
          email: 'user2@example.com',
          firstName: 'Jane',
          lastName: 'Smith',
          fullName: 'Jane Smith',
          role: UserRole.TechLeader,
          isVerified: false,
        },
      ],
      totalUsers: 2,
      totalPages: 1,
      currentPage: 1,
    };

    // Set up mocks
    mockRepository.getUsers.mockResolvedValue(mockPaginatedResult);
    (UserManagementMapper.toPaginatedUsersDto as jest.Mock).mockReturnValue(mockMappedResult);

    // Act
    const result = await getUsersUseCase.execute(mockInputDto);

    // Assert
    expect(mockRepository.getUsers).toHaveBeenCalledWith({
      page: mockInputDto.page,
      pageSize: mockInputDto.pageSize,
      organizationId: mockInputDto.organizationId,
      sortDirection: mockInputDto.sortDirection,
    });
    expect(UserManagementMapper.toPaginatedUsersDto).toHaveBeenCalledWith(mockPaginatedResult);
    expect(result).toEqual(mockMappedResult);
  });

  it('should propagate repository errors', async () => {
    // Arrange
    const mockInputDto = {
      page: 1,
      pageSize: 10,
      organizationId: 'org123',
    };

    const mockError = new Error('Repository error');
    mockRepository.getUsers.mockRejectedValue(mockError);

    // Act & Assert
    await expect(getUsersUseCase.execute(mockInputDto)).rejects.toThrow(mockError);
    expect(mockRepository.getUsers).toHaveBeenCalledTimes(1);
    expect(UserManagementMapper.toPaginatedUsersDto).not.toHaveBeenCalled();
  });
});
