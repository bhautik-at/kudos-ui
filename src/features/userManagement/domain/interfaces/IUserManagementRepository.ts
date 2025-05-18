import { UserManagementUser } from '../entities/UserManagementUser';
import { UserRole } from '../entities/UserRole';

export interface PaginationParams {
  page: number;
  pageSize: number;
  organizationId: string;
  sortDirection?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  items: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

export interface IUserManagementRepository {
  /**
   * Get paginated list of users
   */
  getUsers(params: PaginationParams): Promise<PaginatedResult<UserManagementUser>>;

  /**
   * Update a user's role
   */
  updateUserRole(userId: string, role: UserRole): Promise<UserManagementUser>;

  /**
   * Invite multiple users to the team with default role (Team Member)
   */
  inviteUsers(emails: string[], organizationId?: string): Promise<number>;

  /**
   * Delete a user
   */
  deleteUser(userId: string): Promise<boolean>;
}
