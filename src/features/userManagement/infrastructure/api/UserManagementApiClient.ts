import { httpService } from '@/shared/services/http/HttpService';
import { ApiError } from '@/shared/errors/ApiError';
import { UserRole } from '../../domain/entities/UserRole';

interface UserApiResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  teamName?: string;
  role: UserRole;
  isVerified: boolean;
}

interface PaginatedApiResponse<T> {
  items: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export class UserManagementApiClient {
  /**
   * Get paginated list of users
   */
  async getUsers(
    page: number,
    pageSize: number,
    sortField: string,
    organizationId: string,
    sortDirection?: 'asc' | 'desc'
  ): Promise<PaginatedApiResponse<UserApiResponse>> {
    if (!organizationId) {
      throw new ApiError('Organization ID is required', 400);
    }

    try {
      // Build query params
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('pageSize', pageSize.toString());
      params.append('organizationId', organizationId);

      if (sortField) {
        params.append('sortField', sortField);
      }

      if (sortDirection) {
        params.append('sortDirection', sortDirection);
      }

      const response = await httpService.get<ApiResponse<PaginatedApiResponse<UserApiResponse>>>(
        `/api/users?${params.toString()}`
      );

      if (!response.data.success || !response.data.data) {
        throw new ApiError(response.data.message || 'Failed to fetch users', response.status);
      }

      return response.data.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      throw new ApiError(
        error instanceof Error ? error.message : 'Unknown error fetching users',
        500
      );
    }
  }

  /**
   * Update a user's role
   */
  async updateUserRole(userId: string, role: UserRole): Promise<UserApiResponse> {
    try {
      const response = await httpService.put<ApiResponse<UserApiResponse>>(
        `/api/users/${userId}/role`,
        { role }
      );

      if (!response.data.success || !response.data.data) {
        throw new ApiError(response.data.message || 'Failed to update user role', response.status);
      }

      return response.data.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      throw new ApiError(
        error instanceof Error ? error.message : 'Unknown error updating user role',
        500
      );
    }
  }

  /**
   * Invite multiple users with emails and organization ID
   */
  async inviteUsers(emails: string[], organizationId?: string): Promise<{ invitedCount: number }> {
    try {
      const payload: { emails: string[]; organizationId?: string } = { emails };

      if (organizationId) {
        payload.organizationId = organizationId;
      }

      const response = await httpService.post<ApiResponse<{ invitedCount: number }>>(
        '/api/users/invite',
        payload
      );

      if (!response.data.success || !response.data.data) {
        throw new ApiError(response.data.message || 'Failed to invite users', response.status);
      }

      return response.data.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      throw new ApiError(
        error instanceof Error ? error.message : 'Unknown error inviting users',
        500
      );
    }
  }

  /**
   * Delete a user
   */
  async deleteUser(userId: string): Promise<boolean> {
    try {
      const response = await httpService.delete<ApiResponse<{ success: boolean }>>(
        `/api/users/${userId}`
      );

      if (!response.data.success) {
        throw new ApiError(response.data.message || 'Failed to delete user', response.status);
      }

      return true;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      throw new ApiError(
        error instanceof Error ? error.message : 'Unknown error deleting user',
        500
      );
    }
  }
}
