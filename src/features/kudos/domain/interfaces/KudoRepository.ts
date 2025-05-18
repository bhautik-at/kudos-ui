import { Kudo } from '../entities/Kudo';

export interface KudoRepository {
  create(kudo: Kudo): Promise<Kudo>;
  update(kudo: Kudo): Promise<Kudo>;
  delete(id: string, organizationId: string): Promise<boolean>;
  findById(id: string, organizationId: string): Promise<Kudo | null>;
  findAll(params: {
    recipientId?: string;
    senderId?: string;
    teamId?: string;
    categoryId?: string;
    organizationId: string;
    page?: number;
    limit?: number;
  }): Promise<{
    kudos: Kudo[];
    total: number;
    pages: number;
    currentPage: number;
    limit: number;
  }>;
}
