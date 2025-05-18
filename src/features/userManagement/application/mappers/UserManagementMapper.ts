import { UserManagementUser } from '../../domain/entities/UserManagementUser';
import { UserManagementUserDto, PaginatedUsersDto } from '../dtos/UserManagementDtos';
import { PaginatedResult } from '../../domain/interfaces/IUserManagementRepository';

export class UserManagementMapper {
  static toUserDto(user: UserManagementUser): UserManagementUserDto {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      teamName: user.teamName,
      fullName: user.fullName,
      role: user.role,
      isVerified: user.isVerified,
    };
  }

  static toPaginatedUsersDto(
    paginatedResult: PaginatedResult<UserManagementUser>
  ): PaginatedUsersDto {
    return {
      users: paginatedResult.items.map(user => this.toUserDto(user)),
      totalUsers: paginatedResult.totalItems,
      totalPages: paginatedResult.totalPages,
      currentPage: paginatedResult.currentPage,
    };
  }
}
