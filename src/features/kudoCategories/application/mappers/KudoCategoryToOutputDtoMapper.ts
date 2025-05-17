import { KudoCategory } from '../../domain/entities/KudoCategory';
import { KudoCategoryOutputDto } from '../dtos/KudoCategoryOutputDto';

export class KudoCategoryToOutputDtoMapper {
  static toDto(category: KudoCategory): KudoCategoryOutputDto {
    return {
      id: category.id || '',
      name: category.name,
      organizationId: category.organizationId,
      createdAt: category.createdAt.toISOString(),
      updatedAt: category.updatedAt.toISOString(),
    };
  }

  static toDtoList(categories: KudoCategory[]): KudoCategoryOutputDto[] {
    return categories.map(category => this.toDto(category));
  }
}
