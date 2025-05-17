import { User } from '../entities/User';

export interface IUserRepository {
  /**
   * Fetches the current authenticated user
   * @returns A Promise resolving to a User or null if not found
   * @throws Error if there's an authentication or server error
   */
  getCurrentUser(): Promise<User | null>;
}
