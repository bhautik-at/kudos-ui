import { Kudo } from '../../domain/entities/Kudo';
import { KudoOutputDto } from '../dtos/KudoOutputDto';

export class KudoToOutputDtoMapper {
  static toDto(
    kudo: Kudo,
    recipientName: string,
    senderName: string,
    teamName: string,
    categoryName: string,
    updatedAt?: Date
  ): KudoOutputDto {
    return {
      id: kudo.id || '',
      recipientId: kudo.recipientId,
      recipientName,
      senderId: kudo.senderId,
      senderName,
      teamId: kudo.teamId,
      teamName,
      categoryId: kudo.categoryId,
      categoryName,
      message: kudo.message,
      organizationId: kudo.organizationId,
      createdAt: kudo.createdAt.toISOString(),
      updatedAt: updatedAt ? updatedAt.toISOString() : undefined,
    };
  }

  static toDtoList(
    kudos: Kudo[],
    recipientNames: Record<string, string>,
    senderNames: Record<string, string>,
    teamNames: Record<string, string>,
    categoryNames: Record<string, string>
  ): KudoOutputDto[] {
    return kudos.map(kudo =>
      this.toDto(
        kudo,
        recipientNames[kudo.recipientId] || 'Unknown',
        senderNames[kudo.senderId] || 'Unknown',
        teamNames[kudo.teamId] || 'Unknown',
        categoryNames[kudo.categoryId] || 'Unknown'
      )
    );
  }
}
