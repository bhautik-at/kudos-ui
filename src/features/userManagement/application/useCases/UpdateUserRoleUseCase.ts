import { IUserManagementRepository } from '../../domain/interfaces/IUserManagementRepository';
import { UpdateUserRoleInputDto } from '../dtos/UserManagementDtos';
import { UserManagementMapper } from '../mappers/UserManagementMapper';
import { UserManagementUserDto } from '../dtos/UserManagementDtos';
import { UserRoleUpdateError } from '../../domain/errors/UserManagementError';

export class UpdateUserRoleUseCase {
  constructor(private userManagementRepository: IUserManagementRepository) {}

  async execute(inputDto: UpdateUserRoleInputDto): Promise<UserManagementUserDto> {
    try {
      const updatedUser = await this.userManagementRepository.updateUserRole(
        inputDto.userId,
        inputDto.role
      );

      return UserManagementMapper.toUserDto(updatedUser);
    } catch (error) {
      throw new UserRoleUpdateError(
        error instanceof Error ? error.message : 'Failed to update user role'
      );
    }
  }
}
