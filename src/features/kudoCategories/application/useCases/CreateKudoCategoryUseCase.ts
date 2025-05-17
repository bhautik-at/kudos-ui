import { KudoCategoryRepository, KudoCategoryValidator } from '../../domain/interfaces';
import { DuplicateKudoCategoryError } from '../../domain/errors';
import { CreateKudoCategoryInputDto } from '../dtos/CreateKudoCategoryInputDto';
import { KudoCategoryOutputDto } from '../dtos/KudoCategoryOutputDto';
import { InputDtoToKudoCategoryMapper } from '../mappers/InputDtoToKudoCategoryMapper';
import { KudoCategoryToOutputDtoMapper } from '../mappers/KudoCategoryToOutputDtoMapper';

export class CreateKudoCategoryUseCase {
  constructor(
    private kudoCategoryRepository: KudoCategoryRepository,
    private kudoCategoryValidator: KudoCategoryValidator
  ) {}

  async execute(dto: CreateKudoCategoryInputDto): Promise<KudoCategoryOutputDto> {
    // Check if category name is unique
    const isUnique = await this.kudoCategoryValidator.isCategoryNameUnique(
      dto.name,
      dto.organizationId
    );

    if (!isUnique) {
      throw new DuplicateKudoCategoryError(dto.name);
    }

    // Convert input DTO to domain entity
    const category = InputDtoToKudoCategoryMapper.toEntityFromCreate(dto);

    // Save entity
    const savedCategory = await this.kudoCategoryRepository.create(category);

    // Convert domain entity to output DTO
    return KudoCategoryToOutputDtoMapper.toDto(savedCategory);
  }
}
