import { Organization } from '../../domain/entities/Organization';
import { OrganizationRepository as OrganizationRepositoryInterface } from '../../domain/interfaces/OrganizationRepository';
import { OrganizationApiClient } from '../api/OrganizationApiClient';

export class OrganizationRepository implements OrganizationRepositoryInterface {
  constructor(private apiClient: OrganizationApiClient) {}

  async create(organization: Organization): Promise<Organization> {
    const response = await this.apiClient.createOrganization({
      name: organization.name,
      description: organization.description,
    });

    return new Organization({
      id: response.id,
      name: response.name,
      description: response.description,
      createdAt: new Date(response.createdAt),
      updatedAt: new Date(response.updatedAt),
    });
  }

  async findAll(): Promise<Organization[]> {
    const organizations = await this.apiClient.getOrganizations();

    return organizations.map(
      org =>
        new Organization({
          id: org.id,
          name: org.name,
          description: org.description,
          createdAt: new Date(org.createdAt),
          updatedAt: new Date(org.updatedAt),
        })
    );
  }

  async findById(id: string): Promise<Organization | null> {
    try {
      const organization = await this.apiClient.getOrganization(id);

      return new Organization({
        id: organization.id,
        name: organization.name,
        description: organization.description,
        createdAt: new Date(organization.createdAt),
        updatedAt: new Date(organization.updatedAt),
      });
    } catch (error) {
      console.error('Error finding organization by ID:', error);
      return null;
    }
  }

  async update(id: string, organization: Partial<Organization>): Promise<Organization> {
    const response = await this.apiClient.updateOrganization(id, {
      name: organization.name,
      description: organization.description,
    });

    return new Organization({
      id: response.id,
      name: response.name,
      description: response.description,
      createdAt: new Date(response.createdAt),
      updatedAt: new Date(response.updatedAt),
    });
  }

  async delete(id: string): Promise<void> {
    await this.apiClient.deleteOrganization(id);
  }
}
