import { KudoCategoryRepository } from '../../domain/interfaces';
import { KudoCategoryOutputDto } from '../dtos/KudoCategoryOutputDto';
import { KudoCategoryToOutputDtoMapper } from '../mappers/KudoCategoryToOutputDtoMapper';

export class GetAllKudoCategoriesUseCase {
  constructor(private kudoCategoryRepository: KudoCategoryRepository) {}

  async execute(organizationId: string): Promise<KudoCategoryOutputDto[]> {
    // Get all categories for the organization
    const categories = await this.kudoCategoryRepository.findAllByOrganizationId(organizationId);

    // Convert domain entities to output DTOs
    return KudoCategoryToOutputDtoMapper.toDtoList(categories);
  }
}
