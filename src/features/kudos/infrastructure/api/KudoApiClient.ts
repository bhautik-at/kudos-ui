import { ApiError } from '@/shared/errors/ApiError';
import { httpService } from '@/shared/services/http/HttpService';

interface KudoApiData {
  id: string;
  recipient_id: string;
  recipient_name: string;
  sender_id: string;
  sender_name: string;
  team_id: string;
  team_name: string;
  category_id: string;
  category_name: string;
  message: string;
  organization_id: string;
  created_at: string;
  updated_at?: string;
}

interface CreateKudoData {
  recipient_id: string;
  team_id: string;
  category_id: string;
  message: string;
  organization_id: string;
}

interface UpdateKudoData {
  recipient_id?: string;
  team_id?: string;
  category_id?: string;
  message?: string;
}

interface KudosListResponse {
  success: boolean;
  data: KudoApiData[];
  pagination: {
    total: number;
    pages: number;
    current_page: number;
    limit: number;
  };
}

interface KudoResponse {
  success: boolean;
  data: KudoApiData;
}

export class KudoApiClient {
  private baseUrl: string;

  constructor(baseUrl = '/api') {
    this.baseUrl = baseUrl;
  }

  async createKudo(kudoData: CreateKudoData): Promise<KudoApiData> {
    try {
      const response = await httpService.post(`${this.baseUrl}/kudos`, kudoData);
      return response.data.data || response.data;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to create kudo', 500);
    }
  }

  async updateKudo(id: string, kudoData: UpdateKudoData): Promise<KudoApiData> {
    try {
      const response = await httpService.put(`${this.baseUrl}/kudos/${id}`, kudoData);
      return response.data.data || response.data;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to update kudo', 500);
    }
  }

  async deleteKudo(id: string): Promise<boolean> {
    try {
      const response = await httpService.delete(`${this.baseUrl}/kudos/${id}`);
      return response.data.success;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to delete kudo', 500);
    }
  }

  async getKudos(params: {
    recipient_id?: string;
    team_id?: string;
    category_id?: string;
    page?: number;
    limit?: number;
    organization_id: string;
  }): Promise<KudosListResponse> {
    try {
      const response = await httpService.get(`${this.baseUrl}/kudos`, { params });
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to fetch kudos', 500);
    }
  }

  async getKudoById(id: string, organizationId: string): Promise<KudoApiData> {
    try {
      const response = await httpService.get(`${this.baseUrl}/kudos/${id}`, {
        params: { organization_id: organizationId },
      });
      return response.data.data || response.data;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to fetch kudo', 500);
    }
  }
}
