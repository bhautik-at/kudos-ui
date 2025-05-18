import { Kudo } from '../../domain/entities/Kudo';
import { CreateKudoInputDto } from '../dtos/CreateKudoInputDto';
import { UpdateKudoInputDto } from '../dtos/UpdateKudoInputDto';

export class InputDtoToKudoMapper {
  static toEntity(dto: CreateKudoInputDto, senderId: string): Kudo {
    return new Kudo({
      recipientId: dto.recipientId,
      senderId,
      teamId: dto.teamId,
      categoryId: dto.categoryId,
      message: dto.message,
      organizationId: dto.organizationId,
    });
  }

  static toEntityForUpdate(dto: UpdateKudoInputDto, existingKudo: Kudo): Kudo {
    return new Kudo({
      id: existingKudo.id,
      recipientId: dto.recipientId || existingKudo.recipientId,
      senderId: existingKudo.senderId,
      teamId: dto.teamId || existingKudo.teamId,
      categoryId: dto.categoryId || existingKudo.categoryId,
      message: dto.message || existingKudo.message,
      organizationId: existingKudo.organizationId,
      createdAt: existingKudo.createdAt,
    });
  }
}
