import { KudoCategory } from '../../domain/entities/KudoCategory';
import { CreateKudoCategoryInputDto } from '../dtos/CreateKudoCategoryInputDto';
import { UpdateKudoCategoryInputDto } from '../dtos/UpdateKudoCategoryInputDto';

export class InputDtoToKudoCategoryMapper {
  static toEntityFromCreate(dto: CreateKudoCategoryInputDto): KudoCategory {
    return new KudoCategory({
      name: dto.name,
      organizationId: dto.organizationId,
    });
  }

  static toEntityFromUpdate(dto: UpdateKudoCategoryInputDto, existing: KudoCategory): KudoCategory {
    return new KudoCategory({
      id: existing.id,
      name: dto.name,
      organizationId: existing.organizationId,
      createdAt: existing.createdAt,
      updatedAt: new Date(),
    });
  }
}
