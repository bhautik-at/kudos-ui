import { TeamMember } from '../entities/TeamMember';

export interface TeamMemberWithUserInfo {
  id?: string;
  teamId: string;
  userId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamMemberRepository {
  addTeamMember(teamMember: TeamMember): Promise<TeamMember>;
  findTeamMembers(teamId: string): Promise<TeamMemberWithUserInfo[]>;
  removeTeamMember(teamId: string, userId: string): Promise<void>;
  isUserInTeam(teamId: string, userId: string): Promise<boolean>;
}
