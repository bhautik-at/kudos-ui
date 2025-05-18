import { User } from '../entities/User';

export interface IUserRepository {
  /**
   * Fetches the current authenticated user
   * @returns A Promise resolving to a User or null if not found
   * @throws Error if there's an authentication or server error
   */
  getCurrentUser(): Promise<User | null>;

  /**
   * Accepts an organization invitation for the current user
   * @param organizationId The ID of the organization to accept invitation for
   * @returns A Promise resolving to the organization ID on success
   * @throws Error if there's an error accepting the invitation
   */
  acceptInvitation(organizationId: string): Promise<string>;
}
