import { UserRole } from '../../domain/entities/UserRole';

// Input DTOs
export interface GetUsersInputDto {
  page: number;
  pageSize: number;
  organizationId: string;
  sortDirection?: 'asc' | 'desc';
}

export interface UpdateUserRoleInputDto {
  userId: string;
  role: UserRole;
}

export interface InviteUsersInputDto {
  emails: string[];
  organizationId?: string;
}

export interface DeleteUserInputDto {
  userId: string;
}

// Output DTOs
export interface UserManagementUserDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  teamName?: string;
  fullName: string;
  role: UserRole;
  isVerified: boolean;
}

export interface PaginatedUsersDto {
  users: UserManagementUserDto[];
  totalUsers: number;
  totalPages: number;
  currentPage: number;
}

export interface InviteUsersResultDto {
  invitedCount: number;
}

export interface DeleteUserResultDto {
  success: boolean;
}
