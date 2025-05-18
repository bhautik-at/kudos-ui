import { httpService } from '@/shared/services/http/HttpService';

interface TeamApiData {
  id: string;
  name: string;
  organizationId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateTeamData {
  name: string;
  members?: string[]; // Array of user IDs to add as team members
}

interface UpdateTeamData {
  name: string;
  members?: string[]; // Array of user IDs to add as team members
}

interface TeamMemberApiData {
  id: string;
  teamId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface TeamMemberWithUserInfoApiData extends TeamMemberApiData {
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  role: string;
}

interface AddTeamMemberData {
  memberUserId: string;
}

interface ApiResponse<T> {
  success: boolean;
  team?: T;
  teams?: T[];
  members?: TeamMemberWithUserInfoApiData[];
  teamMember?: TeamMemberApiData;
  message?: string;
}

export class TeamApiClient {
  private baseUrl: string;

  constructor(baseUrl = '/api') {
    this.baseUrl = baseUrl;
  }

  async createTeam(
    organizationId: string,
    data: CreateTeamData,
    authHeader?: string
  ): Promise<TeamApiData> {
    try {
      const response = await httpService.post<ApiResponse<TeamApiData>>(
        `${this.baseUrl}/organizations/${organizationId}/teams`,
        data,
        authHeader ? { headers: { Authorization: authHeader } } : undefined
      );

      if (!response.data.success || !response.data.team) {
        throw new Error(response.data.message || 'Failed to create team');
      }

      return response.data.team;
    } catch (error) {
      console.error('Error creating team:', error);
      throw error;
    }
  }

  async getTeams(
    organizationId: string,
    nameFilter?: string,
    authHeader?: string
  ): Promise<TeamApiData[]> {
    try {
      let url = `${this.baseUrl}/organizations/${organizationId}/teams`;
      if (nameFilter) {
        url += `?name=${encodeURIComponent(nameFilter)}`;
      }

      const response = await httpService.get<ApiResponse<TeamApiData>>(
        url,
        authHeader ? { headers: { Authorization: authHeader } } : undefined
      );

      if (!response.data.success || !response.data.teams) {
        throw new Error(response.data.message || 'Failed to fetch teams');
      }

      return response.data.teams;
    } catch (error) {
      console.error('Error fetching teams:', error);
      throw error;
    }
  }

  async getTeam(teamId: string, authHeader?: string): Promise<TeamApiData | null> {
    try {
      const response = await httpService.get<ApiResponse<TeamApiData>>(
        `${this.baseUrl}/teams/${teamId}`,
        authHeader ? { headers: { Authorization: authHeader } } : undefined
      );

      if (!response.data.success || !response.data.team) {
        return null;
      }

      return response.data.team;
    } catch (error: any) {
      console.error('Error fetching team:', error);
      if (error.response && error.response.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async updateTeam(
    teamId: string,
    data: UpdateTeamData,
    authHeader?: string
  ): Promise<TeamApiData> {
    try {
      const response = await httpService.put<ApiResponse<TeamApiData>>(
        `${this.baseUrl}/teams/${teamId}`,
        data,
        authHeader ? { headers: { Authorization: authHeader } } : undefined
      );

      if (!response.data.success || !response.data.team) {
        throw new Error(response.data.message || 'Failed to update team');
      }

      return response.data.team;
    } catch (error) {
      console.error('Error updating team:', error);
      throw error;
    }
  }

  async deleteTeam(teamId: string, authHeader?: string): Promise<void> {
    try {
      const response = await httpService.delete<ApiResponse<null>>(
        `${this.baseUrl}/teams/${teamId}`,
        authHeader ? { headers: { Authorization: authHeader } } : undefined
      );

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to delete team');
      }
    } catch (error) {
      console.error('Error deleting team:', error);
      throw error;
    }
  }

  async addTeamMember(
    teamId: string,
    data: AddTeamMemberData,
    authHeader?: string
  ): Promise<TeamMemberApiData> {
    try {
      const response = await httpService.post<ApiResponse<TeamMemberApiData>>(
        `${this.baseUrl}/teams/${teamId}/members`,
        data,
        authHeader ? { headers: { Authorization: authHeader } } : undefined
      );

      if (!response.data.success || !response.data.teamMember) {
        throw new Error(response.data.message || 'Failed to add team member');
      }

      return response.data.teamMember;
    } catch (error) {
      console.error('Error adding team member:', error);
      throw error;
    }
  }

  async getTeamMembers(
    teamId: string,
    authHeader?: string
  ): Promise<TeamMemberWithUserInfoApiData[]> {
    try {
      const response = await httpService.get<ApiResponse<TeamMemberWithUserInfoApiData>>(
        `${this.baseUrl}/teams/${teamId}/members`,
        authHeader ? { headers: { Authorization: authHeader } } : undefined
      );

      if (!response.data.success || !response.data.members) {
        throw new Error(response.data.message || 'Failed to fetch team members');
      }

      return response.data.members;
    } catch (error) {
      console.error('Error fetching team members:', error);
      throw error;
    }
  }

  async removeTeamMember(teamId: string, userId: string, authHeader?: string): Promise<void> {
    try {
      const response = await httpService.delete<ApiResponse<null>>(
        `${this.baseUrl}/teams/${teamId}/members/${userId}`,
        authHeader ? { headers: { Authorization: authHeader } } : undefined
      );

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to remove team member');
      }
    } catch (error) {
      console.error('Error removing team member:', error);
      throw error;
    }
  }

  async addTeamMembers(teamId: string, memberIds: string[], authHeader?: string): Promise<boolean> {
    try {
      const response = await httpService.post<ApiResponse<null>>(
        `${this.baseUrl}/teams/${teamId}/members/batch`,
        { memberIds },
        authHeader ? { headers: { Authorization: authHeader } } : undefined
      );

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to add team members');
      }

      return true;
    } catch (error) {
      console.error('Error adding team members:', error);
      throw error;
    }
  }
}
