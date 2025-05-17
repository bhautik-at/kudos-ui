import { httpService } from '@/shared/services/http/HttpService';

interface OrganizationApiData {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateOrganizationData {
  name: string;
  description?: string;
}

interface UpdateOrganizationData {
  name?: string;
  description?: string;
}

interface ApiResponse<T> {
  success: boolean;
  organization?: T;
  organizations?: T[];
  message?: string;
}

export class OrganizationApiClient {
  private baseUrl: string;

  constructor(baseUrl = '/api') {
    this.baseUrl = baseUrl;
  }

  async createOrganization(data: CreateOrganizationData): Promise<OrganizationApiData> {
    try {
      const response = await httpService.post<ApiResponse<OrganizationApiData>>(
        `${this.baseUrl}/organizations`,
        data
      );

      if (!response.data.success || !response.data.organization) {
        throw new Error(response.data.message || 'Failed to create organization');
      }

      return response.data.organization;
    } catch (error) {
      console.error('Error creating organization:', error);
      throw error;
    }
  }

  async getOrganizations(): Promise<OrganizationApiData[]> {
    try {
      const response = await httpService.get<ApiResponse<OrganizationApiData>>(
        `${this.baseUrl}/organizations`
      );

      if (!response.data.success || !response.data.organizations) {
        throw new Error(response.data.message || 'Failed to fetch organizations');
      }

      return response.data.organizations;
    } catch (error) {
      console.error('Error fetching organizations:', error);
      throw error;
    }
  }

  async getOrganization(id: string): Promise<OrganizationApiData> {
    try {
      const response = await httpService.get<ApiResponse<OrganizationApiData>>(
        `${this.baseUrl}/organizations/${id}`
      );

      if (!response.data.success || !response.data.organization) {
        throw new Error(response.data.message || 'Failed to fetch organization');
      }

      return response.data.organization;
    } catch (error) {
      console.error('Error fetching organization:', error);
      throw error;
    }
  }

  async updateOrganization(id: string, data: UpdateOrganizationData): Promise<OrganizationApiData> {
    try {
      const response = await httpService.put<ApiResponse<OrganizationApiData>>(
        `${this.baseUrl}/organizations/${id}`,
        data
      );

      if (!response.data.success || !response.data.organization) {
        throw new Error(response.data.message || 'Failed to update organization');
      }

      return response.data.organization;
    } catch (error) {
      console.error('Error updating organization:', error);
      throw error;
    }
  }

  async deleteOrganization(id: string): Promise<void> {
    try {
      const response = await httpService.delete<ApiResponse<null>>(
        `${this.baseUrl}/organizations/${id}`
      );

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to delete organization');
      }
    } catch (error) {
      console.error('Error deleting organization:', error);
      throw error;
    }
  }
}
