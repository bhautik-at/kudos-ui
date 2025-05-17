import { KudoCategory } from '../../domain/entities/KudoCategory';
import { KudoCategoryRepository as IKudoCategoryRepository } from '../../domain/interfaces/KudoCategoryRepository';
import { KudoCategoryApiClient, KudoCategoryResponse } from '../api/KudoCategoryApiClient';

export class KudoCategoryRepository implements IKudoCategoryRepository {
  constructor(private apiClient: KudoCategoryApiClient) {}

  async create(category: KudoCategory): Promise<KudoCategory> {
    const response = await this.apiClient.createKudoCategory(category.organizationId, {
      name: category.name,
    });

    return this.mapToDomainEntity(response.category);
  }

  async findAllByOrganizationId(organizationId: string): Promise<KudoCategory[]> {
    const response = await this.apiClient.getAllKudoCategories(organizationId);

    return response.categories.map(category => this.mapToDomainEntity(category));
  }

  async findById(id: string, organizationId: string): Promise<KudoCategory | null> {
    try {
      const response = await this.apiClient.getKudoCategoryById(organizationId, id);

      return this.mapToDomainEntity(response.category);
    } catch (error: unknown) {
      // If category not found, return null instead of throwing
      if ((error as any).status === 404) {
        return null;
      }
      throw error;
    }
  }

  async update(
    id: string,
    organizationId: string,
    updatedCategory: KudoCategory
  ): Promise<KudoCategory> {
    const response = await this.apiClient.updateKudoCategory(organizationId, id, {
      name: updatedCategory.name,
    });

    return this.mapToDomainEntity(response.category);
  }

  async delete(id: string, organizationId: string): Promise<void> {
    await this.apiClient.deleteKudoCategory(organizationId, id);
  }

  private mapToDomainEntity(apiCategory: KudoCategoryResponse): KudoCategory {
    return new KudoCategory({
      id: apiCategory.id,
      name: apiCategory.name,
      organizationId: apiCategory.organizationId,
      createdAt: new Date(apiCategory.createdAt),
      updatedAt: new Date(apiCategory.updatedAt),
    });
  }
}
