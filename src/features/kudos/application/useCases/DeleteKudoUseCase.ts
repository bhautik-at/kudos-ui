import { KudoRepository } from '../../domain/interfaces/KudoRepository';
import { KudoValidationError } from '../../domain/errors/KudoValidationError';

export class DeleteKudoUseCase {
  constructor(private kudoRepository: KudoRepository) {}

  async execute(id: string, organizationId: string, userId: string): Promise<boolean> {
    try {
      // Find the kudo
      const kudo = await this.kudoRepository.findById(id, organizationId);

      if (!kudo) {
        throw new KudoValidationError('Kudo not found');
      }

      // Check if the user is the sender of the kudo
      if (kudo.senderId !== userId) {
        throw new KudoValidationError('You are not authorized to delete this kudo');
      }

      // Delete the kudo
      return await this.kudoRepository.delete(id, organizationId);
    } catch (error) {
      if (error instanceof KudoValidationError) {
        throw error;
      }

      throw new Error(
        `Failed to delete kudo: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}
