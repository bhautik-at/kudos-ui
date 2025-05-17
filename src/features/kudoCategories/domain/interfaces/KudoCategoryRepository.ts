import { KudoCategory } from '../entities/KudoCategory';

export interface KudoCategoryRepository {
  create(category: KudoCategory): Promise<KudoCategory>;
  findAllByOrganizationId(organizationId: string): Promise<KudoCategory[]>;
  findById(id: string, organizationId: string): Promise<KudoCategory | null>;
  update(id: string, organizationId: string, updatedCategory: KudoCategory): Promise<KudoCategory>;
  delete(id: string, organizationId: string): Promise<void>;
}
