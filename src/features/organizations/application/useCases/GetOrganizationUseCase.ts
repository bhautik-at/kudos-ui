import { OrganizationRepository } from '../../domain/interfaces/OrganizationRepository';
import { OrganizationOutputDto } from '../dtos/OrganizationOutputDto';
import { OrganizationMapper } from '../mappers/OrganizationMapper';

export class GetOrganizationUseCase {
  constructor(private organizationRepository: OrganizationRepository) {}

  async execute(id: string): Promise<OrganizationOutputDto> {
    // Get organization by ID
    const organization = await this.organizationRepository.findById(id);

    if (!organization) {
      throw new Error(`Organization with ID ${id} not found`);
    }

    // Convert to DTO and return
    return OrganizationMapper.toDto(organization);
  }
}
