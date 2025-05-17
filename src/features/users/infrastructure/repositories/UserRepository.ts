import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import { User } from '../../domain/entities/User';
import { UserApiClient } from '../api/UserApiClient';
import { UserMapper } from '../../application/mappers/UserMapper';
import { ApiError } from '@/shared/errors/ApiError';

export class UserRepository implements IUserRepository {
  private apiClient: UserApiClient;

  constructor(apiClient?: UserApiClient) {
    this.apiClient = apiClient || new UserApiClient();
  }

  /**
   * Fetches the current authenticated user
   * @returns A Promise resolving to a User or null if not found
   * @throws ApiError if there's an authentication or server error
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const userData = await this.apiClient.getCurrentUser();

      if (!userData) {
        return null;
      }

      return UserMapper.fromApiResponse(userData);
    } catch (error) {
      if (error instanceof ApiError) {
        // For 401 errors, return null to indicate not authenticated
        if (error.status === 401) {
          return null;
        }

        throw error;
      }

      // Rethrow any other errors
      throw error;
    }
  }

  /**
   * Accepts an organization invitation for the current user
   * @param organizationId The ID of the organization to accept invitation for
   * @returns A Promise resolving to the organization ID on success
   * @throws ApiError if there's an error accepting the invitation
   */
  async acceptInvitation(organizationId: string): Promise<string> {
    try {
      const result = await this.apiClient.acceptInvitation(organizationId);
      return result.organizationId;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      // Rethrow any other errors
      throw error;
    }
  }
}
