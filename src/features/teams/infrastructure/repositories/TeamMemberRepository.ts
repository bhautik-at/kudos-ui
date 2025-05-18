import { TeamMember } from '../../domain/entities/TeamMember';
import {
  TeamMemberRepository as TeamMemberRepositoryInterface,
  TeamMemberWithUserInfo,
} from '../../domain/interfaces/TeamMemberRepository';
import { TeamApiClient } from '../api/TeamApiClient';

export class TeamMemberRepository implements TeamMemberRepositoryInterface {
  constructor(private apiClient: TeamApiClient) {}

  async addTeamMember(teamMember: TeamMember): Promise<TeamMember> {
    try {
      const memberData = await this.apiClient.addTeamMember(teamMember.teamId, {
        memberUserId: teamMember.userId,
      });

      return new TeamMember({
        id: memberData.id,
        teamId: memberData.teamId,
        userId: memberData.userId,
        createdAt: new Date(memberData.createdAt),
        updatedAt: new Date(memberData.updatedAt),
      });
    } catch (error) {
      console.error('Error adding team member:', error);
      throw new Error('Failed to add team member');
    }
  }

  async findTeamMembers(teamId: string): Promise<TeamMemberWithUserInfo[]> {
    try {
      const membersData = await this.apiClient.getTeamMembers(teamId);

      return membersData.map(memberData => {
        const baseMember = new TeamMember({
          id: memberData.id,
          teamId: memberData.teamId,
          userId: memberData.userId,
          createdAt: new Date(memberData.createdAt),
          updatedAt: new Date(memberData.updatedAt),
        });

        // Create an extended object with user info
        return {
          ...baseMember,
          firstName: memberData.firstName,
          lastName: memberData.lastName,
          fullName: memberData.fullName,
          email: memberData.email,
          role: memberData.role,
        };
      });
    } catch (error) {
      console.error('Error fetching team members:', error);
      return [];
    }
  }

  async removeTeamMember(teamId: string, userId: string): Promise<void> {
    try {
      await this.apiClient.removeTeamMember(teamId, userId);
    } catch (error) {
      console.error('Error removing team member:', error);
      throw new Error('Failed to remove team member');
    }
  }

  async isUserInTeam(teamId: string, userId: string): Promise<boolean> {
    try {
      const members = await this.findTeamMembers(teamId);
      return members.some(member => member.userId === userId);
    } catch (error) {
      console.error('Error checking team membership:', error);
      return false;
    }
  }
}
