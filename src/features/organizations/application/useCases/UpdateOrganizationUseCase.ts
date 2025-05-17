import { Organization } from '../../domain/entities/Organization';
import { OrganizationRepository } from '../../domain/interfaces/OrganizationRepository';
import { OrganizationOutputDto } from '../dtos/OrganizationOutputDto';
import { OrganizationMapper } from '../mappers/OrganizationMapper';

export interface UpdateOrganizationInputDto {
  id: string;
  name?: string;
  description?: string;
}

export class UpdateOrganizationUseCase {
  constructor(private organizationRepository: OrganizationRepository) {}

  async execute(input: UpdateOrganizationInputDto): Promise<OrganizationOutputDto> {
    // Validate input
    if (!input.id) {
      throw new Error('Organization ID is required');
    }

    // Check if organization exists
    const existingOrganization = await this.organizationRepository.findById(input.id);
    if (!existingOrganization) {
      throw new Error(`Organization with ID ${input.id} not found`);
    }

    // Update organization
    const updatedOrganization = await this.organizationRepository.update(input.id, {
      name: input.name,
      description: input.description,
    });

    // Convert to DTO and return
    return OrganizationMapper.toDto(updatedOrganization);
  }
}
