import { KudoCategoryRepository } from '../../domain/interfaces';
import { KudoCategoryNotFoundError } from '../../domain/errors';
import { KudoCategoryOutputDto } from '../dtos/KudoCategoryOutputDto';
import { KudoCategoryToOutputDtoMapper } from '../mappers/KudoCategoryToOutputDtoMapper';

export class GetKudoCategoryByIdUseCase {
  constructor(private kudoCategoryRepository: KudoCategoryRepository) {}

  async execute(id: string, organizationId: string): Promise<KudoCategoryOutputDto> {
    // Get category by ID
    const category = await this.kudoCategoryRepository.findById(id, organizationId);

    // Check if category exists
    if (!category) {
      throw new KudoCategoryNotFoundError(id);
    }

    // Convert domain entity to output DTO
    return KudoCategoryToOutputDtoMapper.toDto(category);
  }
}
