import { OrganizationRepository } from '../../domain/interfaces/OrganizationRepository';

export class DeleteOrganizationUseCase {
  constructor(private organizationRepository: OrganizationRepository) {}

  async execute(id: string): Promise<void> {
    // Check if organization exists
    const existingOrganization = await this.organizationRepository.findById(id);
    if (!existingOrganization) {
      throw new Error(`Organization with ID ${id} not found`);
    }

    // Delete organization
    await this.organizationRepository.delete(id);
  }
}
