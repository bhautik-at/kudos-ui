import { Team } from '../entities/Team';

export interface TeamRepository {
  createTeam(team: Team): Promise<Team>;
  findTeamById(id: string): Promise<Team | null>;
  findTeamsByOrganizationId(organizationId: string, nameFilter?: string): Promise<Team[]>;
  updateTeam(team: Team): Promise<Team>;
  deleteTeam(id: string): Promise<void>;
}
