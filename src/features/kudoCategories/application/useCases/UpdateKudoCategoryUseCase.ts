import { KudoCategoryRepository, KudoCategoryValidator } from '../../domain/interfaces';
import { KudoCategoryNotFoundError, DuplicateKudoCategoryError } from '../../domain/errors';
import { UpdateKudoCategoryInputDto } from '../dtos/UpdateKudoCategoryInputDto';
import { KudoCategoryOutputDto } from '../dtos/KudoCategoryOutputDto';
import { InputDtoToKudoCategoryMapper } from '../mappers/InputDtoToKudoCategoryMapper';
import { KudoCategoryToOutputDtoMapper } from '../mappers/KudoCategoryToOutputDtoMapper';

export class UpdateKudoCategoryUseCase {
  constructor(
    private kudoCategoryRepository: KudoCategoryRepository,
    private kudoCategoryValidator: KudoCategoryValidator
  ) {}

  async execute(
    id: string,
    organizationId: string,
    dto: UpdateKudoCategoryInputDto
  ): Promise<KudoCategoryOutputDto> {
    // Get existing category
    const existingCategory = await this.kudoCategoryRepository.findById(id, organizationId);

    // Check if category exists
    if (!existingCategory) {
      throw new KudoCategoryNotFoundError(id);
    }

    // Check if new name is unique (excluding current category)
    const isUnique = await this.kudoCategoryValidator.isCategoryNameUnique(
      dto.name,
      organizationId,
      id
    );

    if (!isUnique) {
      throw new DuplicateKudoCategoryError(dto.name);
    }

    // Convert input DTO to domain entity
    const updatedCategory = InputDtoToKudoCategoryMapper.toEntityFromUpdate(dto, existingCategory);

    // Update entity
    const savedCategory = await this.kudoCategoryRepository.update(
      id,
      organizationId,
      updatedCategory
    );

    // Convert domain entity to output DTO
    return KudoCategoryToOutputDtoMapper.toDto(savedCategory);
  }
}
