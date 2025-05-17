import { OrganizationRepository } from '../../domain/interfaces/OrganizationRepository';
import { OrganizationOutputDto } from '../dtos/OrganizationOutputDto';
import { OrganizationMapper } from '../mappers/OrganizationMapper';

export class GetOrganizationsUseCase {
  constructor(private organizationRepository: OrganizationRepository) {}

  async execute(): Promise<OrganizationOutputDto[]> {
    // Get all organizations from repository
    const organizations = await this.organizationRepository.findAll();

    // Convert to DTOs and return
    return OrganizationMapper.toDtoList(organizations);
  }
}
