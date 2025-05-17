import { httpService } from '@/shared/services';
import { ApiError } from '@/shared/errors/ApiError';

interface UserApiResponse {
  success: boolean;
  message?: string;
  data?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    fullName: string;
    isVerified: boolean;
    role: string;
  };
}

interface AcceptInvitationApiResponse {
  success: boolean;
  message: string;
  data: {
    organizationId: string;
  };
}

export class UserApiClient {
  /**
   * Fetches the current authenticated user profile
   * @returns API response containing user data
   * @throws ApiError if there's an error fetching the user
   */
  async getCurrentUser(): Promise<UserApiResponse['data']> {
    try {
      const response = await httpService.get<UserApiResponse>('/api/users/me');

      if (!response.data.success) {
        throw new ApiError(
          response.data.message || 'Failed to fetch user details',
          response.status
        );
      }

      return response.data.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      // Handle other errors (network, etc.)
      throw new ApiError(
        error instanceof Error ? error.message : 'Unknown error fetching user details',
        500
      );
    }
  }

  /**
   * Accepts an organization invitation for the current user
   * @param organizationId The ID of the organization the user is accepting an invitation for
   * @returns API response indicating success or failure
   * @throws ApiError if there's an error accepting the invitation
   */
  async acceptInvitation(organizationId: string): Promise<AcceptInvitationApiResponse['data']> {
    try {
      const response = await httpService.post<AcceptInvitationApiResponse>(
        '/api/users/accept-invitation',
        { organizationId }
      );

      if (!response.data.success) {
        throw new ApiError(response.data.message || 'Failed to accept invitation', response.status);
      }

      return response.data.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      // Handle other errors (network, etc.)
      throw new ApiError(
        error instanceof Error ? error.message : 'Unknown error accepting invitation',
        500
      );
    }
  }
}
