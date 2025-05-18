import { UserManagementMapper } from './UserManagementMapper';
import { UserManagementUser } from '../../domain/entities/UserManagementUser';
import { UserRole } from '../../domain/entities/UserRole';
import { PaginatedResult } from '../../domain/interfaces/IUserManagementRepository';

describe('UserManagementMapper', () => {
  describe('toUserDto', () => {
    it('should correctly map User to UserDto', () => {
      // Arrange
      const user = new UserManagementUser({
        id: 'user123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        teamName: 'Engineering',
        role: UserRole.Member,
        isVerified: true,
      });

      // Act
      const dto = UserManagementMapper.toUserDto(user);

      // Assert
      expect(dto).toEqual({
        id: 'user123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        teamName: 'Engineering',
        fullName: 'John Doe',
        role: UserRole.Member,
        isVerified: true,
      });
    });
  });

  describe('toPaginatedUsersDto', () => {
    it('should correctly map PaginatedResult to PaginatedUsersDto', () => {
      // Arrange
      const user1 = new UserManagementUser({
        id: 'user1',
        email: 'user1@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: UserRole.Member,
      });

      const user2 = new UserManagementUser({
        id: 'user2',
        email: 'user2@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        teamName: 'Marketing',
        role: UserRole.TechLeader,
        isVerified: true,
      });

      const paginatedResult: PaginatedResult<UserManagementUser> = {
        items: [user1, user2],
        totalItems: 10,
        totalPages: 5,
        currentPage: 1,
      };

      // Act
      const paginatedDto = UserManagementMapper.toPaginatedUsersDto(paginatedResult);

      // Assert
      expect(paginatedDto).toEqual({
        users: [
          {
            id: 'user1',
            email: 'user1@example.com',
            firstName: 'John',
            lastName: 'Doe',
            teamName: '',
            fullName: 'John Doe',
            role: UserRole.Member,
            isVerified: false,
          },
          {
            id: 'user2',
            email: 'user2@example.com',
            firstName: 'Jane',
            lastName: 'Smith',
            teamName: 'Marketing',
            fullName: 'Jane Smith',
            role: UserRole.TechLeader,
            isVerified: true,
          },
        ],
        totalUsers: 10,
        totalPages: 5,
        currentPage: 1,
      });
    });
  });
});
