import { IUserManagementRepository } from '../../domain/interfaces/IUserManagementRepository';
import { DeleteUserInputDto, DeleteUserResultDto } from '../dtos/UserManagementDtos';

export class DeleteUserUseCase {
  constructor(private userManagementRepository: IUserManagementRepository) {}

  /**
   * Delete a user by ID
   * @param input The user ID to delete
   */
  async execute(input: DeleteUserInputDto): Promise<DeleteUserResultDto> {
    try {
      const result = await this.userManagementRepository.deleteUser(input.userId);
      return { success: result };
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
}
