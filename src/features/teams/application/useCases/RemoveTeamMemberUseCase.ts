import { TeamNotFoundError } from '../../domain/errors/TeamNotFoundError';
import { TeamMemberRepository } from '../../domain/interfaces/TeamMemberRepository';
import { TeamRepository } from '../../domain/interfaces/TeamRepository';

export class RemoveTeamMemberUseCase {
  constructor(
    private teamRepository: TeamRepository,
    private teamMemberRepository: TeamMemberRepository
  ) {}

  async execute(teamId: string, userId: string): Promise<void> {
    // Check if team exists
    const team = await this.teamRepository.findTeamById(teamId);
    if (!team) {
      throw new TeamNotFoundError(teamId);
    }

    // Check if user is a member
    const isMember = await this.teamMemberRepository.isUserInTeam(teamId, userId);
    if (!isMember) {
      throw new Error(`User ${userId} is not a member of team ${teamId}`);
    }

    // Remove team member
    await this.teamMemberRepository.removeTeamMember(teamId, userId);
  }
}
