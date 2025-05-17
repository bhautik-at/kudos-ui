import { KudoCategoryRepository } from '../../domain/interfaces';
import { KudoCategoryNotFoundError } from '../../domain/errors';

export class DeleteKudoCategoryUseCase {
  constructor(private kudoCategoryRepository: KudoCategoryRepository) {}

  async execute(id: string, organizationId: string): Promise<void> {
    // Check if category exists
    const existingCategory = await this.kudoCategoryRepository.findById(id, organizationId);

    if (!existingCategory) {
      throw new KudoCategoryNotFoundError(id);
    }

    // Delete the category
    await this.kudoCategoryRepository.delete(id, organizationId);
  }
}
