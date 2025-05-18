import { Team } from '../../domain/entities/Team';
import { TeamRepository as TeamRepositoryInterface } from '../../domain/interfaces/TeamRepository';
import { TeamApiClient } from '../api/TeamApiClient';

export class TeamRepository implements TeamRepositoryInterface {
  constructor(private apiClient: TeamApiClient) {}

  async createTeam(team: Team): Promise<Team> {
    try {
      const teamData = await this.apiClient.createTeam(team.organizationId, {
        name: team.name,
        members: team.members,
      });

      return new Team({
        id: teamData.id,
        name: teamData.name,
        organizationId: teamData.organizationId,
        createdBy: teamData.createdBy,
        createdAt: new Date(teamData.createdAt),
        updatedAt: new Date(teamData.updatedAt),
      });
    } catch (error) {
      console.error('Error creating team:', error);
      throw new Error('Failed to create team');
    }
  }

  async findTeamById(id: string): Promise<Team | null> {
    try {
      const teamData = await this.apiClient.getTeam(id);
      if (!teamData) return null;

      return new Team({
        id: teamData.id,
        name: teamData.name,
        organizationId: teamData.organizationId,
        createdBy: teamData.createdBy,
        createdAt: new Date(teamData.createdAt),
        updatedAt: new Date(teamData.updatedAt),
      });
    } catch (error) {
      console.error('Error fetching team:', error);
      return null;
    }
  }

  async findTeamsByOrganizationId(organizationId: string, nameFilter?: string): Promise<Team[]> {
    try {
      const teamsData = await this.apiClient.getTeams(organizationId, nameFilter);

      return teamsData.map(
        teamData =>
          new Team({
            id: teamData.id,
            name: teamData.name,
            organizationId: teamData.organizationId,
            createdBy: teamData.createdBy,
            createdAt: new Date(teamData.createdAt),
            updatedAt: new Date(teamData.updatedAt),
          })
      );
    } catch (error) {
      console.error('Error fetching teams:', error);
      return [];
    }
  }

  async updateTeam(team: Team): Promise<Team> {
    try {
      const teamData = await this.apiClient.updateTeam(team.id!, {
        name: team.name,
        members: team.members,
      });

      return new Team({
        id: teamData.id,
        name: teamData.name,
        organizationId: teamData.organizationId,
        createdBy: teamData.createdBy,
        createdAt: new Date(teamData.createdAt),
        updatedAt: new Date(teamData.updatedAt),
      });
    } catch (error) {
      console.error('Error updating team:', error);
      throw new Error('Failed to update team');
    }
  }

  async deleteTeam(id: string): Promise<void> {
    try {
      await this.apiClient.deleteTeam(id);
    } catch (error) {
      console.error('Error deleting team:', error);
      throw new Error('Failed to delete team');
    }
  }
}
