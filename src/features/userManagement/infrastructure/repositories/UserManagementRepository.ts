import {
  IUserManagementRepository,
  PaginationParams,
  PaginatedResult,
} from '../../domain/interfaces/IUserManagementRepository';
import { UserManagementUser } from '../../domain/entities/UserManagementUser';
import { UserRole } from '../../domain/entities/UserRole';
import { UserManagementApiClient } from '../api/UserManagementApiClient';

export class UserManagementRepository implements IUserManagementRepository {
  private apiClient: UserManagementApiClient;

  constructor(apiClient?: UserManagementApiClient) {
    this.apiClient = apiClient || new UserManagementApiClient();
  }

  async getUsers(params: PaginationParams): Promise<PaginatedResult<UserManagementUser>> {
    const result = await this.apiClient.getUsers(
      params.page,
      params.pageSize,
      'firstName', // Always sort by firstName
      params.organizationId,
      params.sortDirection
    );

    // Map API response to domain entities
    const users = result.items.map(
      item =>
        new UserManagementUser({
          id: item.id,
          email: item.email,
          firstName: item.firstName,
          lastName: item.lastName,
          teamName: item.teamName,
          role: item.role,
          isVerified: item.isVerified,
        })
    );

    return {
      items: users,
      totalItems: result.totalItems,
      totalPages: result.totalPages,
      currentPage: result.currentPage,
    };
  }

  async updateUserRole(userId: string, role: UserRole): Promise<UserManagementUser> {
    const updatedUser = await this.apiClient.updateUserRole(userId, role);

    return new UserManagementUser({
      id: updatedUser.id,
      email: updatedUser.email,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      teamName: updatedUser.teamName,
      role: updatedUser.role,
      isVerified: updatedUser.isVerified,
    });
  }

  async inviteUsers(emails: string[], organizationId?: string): Promise<number> {
    const result = await this.apiClient.inviteUsers(emails, organizationId);
    return result.invitedCount;
  }

  async deleteUser(userId: string): Promise<boolean> {
    return await this.apiClient.deleteUser(userId);
  }
}
