import { OrganizationRepository } from '../../domain/interfaces/OrganizationRepository';
import { CreateOrganizationInputDto } from '../dtos/CreateOrganizationInputDto';
import { OrganizationOutputDto } from '../dtos/OrganizationOutputDto';
import { OrganizationMapper } from '../mappers/OrganizationMapper';

export class CreateOrganizationUseCase {
  constructor(private organizationRepository: OrganizationRepository) {}

  async execute(input: CreateOrganizationInputDto): Promise<OrganizationOutputDto> {
    // Convert DTO to entity
    const organization = OrganizationMapper.toEntity(input);

    // Save organization
    const savedOrganization = await this.organizationRepository.create(organization);

    // Return DTO
    return OrganizationMapper.toDto(savedOrganization);
  }
}
