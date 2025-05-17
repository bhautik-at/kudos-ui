import { Organization } from '../entities/Organization';

export interface OrganizationRepository {
  create(organization: Organization): Promise<Organization>;
  findAll(): Promise<Organization[]>;
  findById(id: string): Promise<Organization | null>;
  update(id: string, organization: Partial<Organization>): Promise<Organization>;
  delete(id: string): Promise<void>;
}
