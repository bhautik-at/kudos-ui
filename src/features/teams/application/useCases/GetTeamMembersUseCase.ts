import { TeamNotFoundError } from '../../domain/errors/TeamNotFoundError';
import { TeamMemberRepository } from '../../domain/interfaces/TeamMemberRepository';
import { TeamRepository } from '../../domain/interfaces/TeamRepository';
import { TeamMemberWithUserInfoOutputDto } from '../dtos/TeamMemberOutputDto';
import { TeamMemberMapper } from '../mappers/TeamMemberMapper';

export class GetTeamMembersUseCase {
  constructor(
    private teamRepository: TeamRepository,
    private teamMemberRepository: TeamMemberRepository
  ) {}

  async execute(teamId: string): Promise<TeamMemberWithUserInfoOutputDto[]> {
    // Check if team exists
    const team = await this.teamRepository.findTeamById(teamId);
    if (!team) {
      throw new TeamNotFoundError(teamId);
    }

    // Get team members with user info
    const members = await this.teamMemberRepository.findTeamMembers(teamId);

    // Convert to output DTOs
    return TeamMemberMapper.toDetailedDtoList(members);
  }
}
