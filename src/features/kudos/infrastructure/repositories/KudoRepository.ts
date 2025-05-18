import { Kudo } from '../../domain/entities/Kudo';
import { KudoRepository as KudoRepositoryInterface } from '../../domain/interfaces/KudoRepository';
import { KudoApiClient } from '../api/KudoApiClient';
import { ApiError } from '@/shared/errors/ApiError';

export class KudoRepository implements KudoRepositoryInterface {
  constructor(private apiClient: KudoApiClient) {}

  async create(kudo: Kudo): Promise<Kudo> {
    try {
      const kudoData = await this.apiClient.createKudo({
        recipient_id: kudo.recipientId,
        team_id: kudo.teamId,
        category_id: kudo.categoryId,
        message: kudo.message,
        organization_id: kudo.organizationId,
      });

      return new Kudo({
        id: kudoData.id,
        recipientId: kudoData.recipient_id,
        senderId: kudoData.sender_id,
        teamId: kudoData.team_id,
        categoryId: kudoData.category_id,
        message: kudoData.message,
        organizationId: kudoData.organization_id,
        createdAt: new Date(kudoData.created_at),
      });
    } catch (error) {
      console.error('Error creating kudo:', error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to create kudo');
    }
  }

  async update(kudo: Kudo): Promise<Kudo> {
    try {
      if (!kudo.id) {
        throw new Error('Kudo ID is required for update');
      }

      const kudoData = await this.apiClient.updateKudo(kudo.id, {
        recipient_id: kudo.recipientId,
        team_id: kudo.teamId,
        category_id: kudo.categoryId,
        message: kudo.message,
      });

      return new Kudo({
        id: kudoData.id,
        recipientId: kudoData.recipient_id,
        senderId: kudoData.sender_id,
        teamId: kudoData.team_id,
        categoryId: kudoData.category_id,
        message: kudoData.message,
        organizationId: kudoData.organization_id,
        createdAt: new Date(kudoData.created_at),
      });
    } catch (error) {
      console.error('Error updating kudo:', error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to update kudo');
    }
  }

  async delete(id: string, organizationId: string): Promise<boolean> {
    try {
      return await this.apiClient.deleteKudo(id);
    } catch (error) {
      console.error('Error deleting kudo:', error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to delete kudo');
    }
  }

  async findById(id: string, organizationId: string): Promise<Kudo | null> {
    try {
      const kudoData = await this.apiClient.getKudoById(id, organizationId);

      return new Kudo({
        id: kudoData.id,
        recipientId: kudoData.recipient_id,
        senderId: kudoData.sender_id,
        teamId: kudoData.team_id,
        categoryId: kudoData.category_id,
        message: kudoData.message,
        organizationId: kudoData.organization_id,
        createdAt: new Date(kudoData.created_at),
      });
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        return null;
      }
      console.error('Error fetching kudo:', error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to fetch kudo');
    }
  }

  async findAll(params: {
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
  }> {
    try {
      const apiParams = {
        recipient_id: params.recipientId,
        sender_id: params.senderId,
        team_id: params.teamId,
        category_id: params.categoryId,
        organization_id: params.organizationId,
        page: params.page,
        limit: params.limit,
      };

      const response = await this.apiClient.getKudos(apiParams);

      const kudos = response.data.map(
        kudoData =>
          new Kudo({
            id: kudoData.id,
            recipientId: kudoData.recipient_id,
            senderId: kudoData.sender_id,
            teamId: kudoData.team_id,
            categoryId: kudoData.category_id,
            message: kudoData.message,
            organizationId: kudoData.organization_id,
            createdAt: new Date(kudoData.created_at),
          })
      );

      return {
        kudos,
        total: response.pagination.total,
        pages: response.pagination.pages,
        currentPage: response.pagination.current_page,
        limit: response.pagination.limit,
      };
    } catch (error) {
      console.error('Error fetching kudos:', error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Failed to fetch kudos');
    }
  }
}
