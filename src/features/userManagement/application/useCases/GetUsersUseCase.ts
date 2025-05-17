import { IUserManagementRepository } from '../../domain/interfaces/IUserManagementRepository';
import { GetUsersInputDto } from '../dtos/UserManagementDtos';
import { UserManagementMapper } from '../mappers/UserManagementMapper';
import { PaginatedUsersDto } from '../dtos/UserManagementDtos';

export class GetUsersUseCase {
  constructor(private userManagementRepository: IUserManagementRepository) {}

  async execute(inputDto: GetUsersInputDto): Promise<PaginatedUsersDto> {
    const paginatedUsers = await this.userManagementRepository.getUsers({
      page: inputDto.page,
      pageSize: inputDto.pageSize,
      organizationId: inputDto.organizationId,
      sortDirection: inputDto.sortDirection,
    });

    return UserManagementMapper.toPaginatedUsersDto(paginatedUsers);
  }
}
