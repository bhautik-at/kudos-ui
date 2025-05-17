import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import { UserMapper } from '../mappers/UserMapper';
import { UserOutputDto } from '../dtos/UserOutputDto';

export class GetCurrentUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  /**
   * Executes the use case to get the current authenticated user
   * @returns A Promise resolving to the user DTO or null if not found
   * @throws Error if there's an authentication or server error
   */
  async execute(): Promise<UserOutputDto | null> {
    const user = await this.userRepository.getCurrentUser();

    if (!user) {
      return null;
    }

    return UserMapper.toDto(user);
  }
}
