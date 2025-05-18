import { TeamMemberAlreadyExistsError } from '../../domain/errors/TeamMemberAlreadyExistsError';
import { TeamNotFoundError } from '../../domain/errors/TeamNotFoundError';
import { TeamMemberRepository } from '../../domain/interfaces/TeamMemberRepository';
import { TeamRepository } from '../../domain/interfaces/TeamRepository';
import { TeamMemberInputDto } from '../dtos/TeamMemberInputDto';
import { TeamMemberOutputDto } from '../dtos/TeamMemberOutputDto';
import { TeamMemberMapper } from '../mappers/TeamMemberMapper';

export class AddTeamMemberUseCase {
  constructor(
    private teamRepository: TeamRepository,
    private teamMemberRepository: TeamMemberRepository
  ) {}

  async execute(dto: TeamMemberInputDto): Promise<TeamMemberOutputDto> {
    // Check if team exists
    const team = await this.teamRepository.findTeamById(dto.teamId);
    if (!team) {
      throw new TeamNotFoundError(dto.teamId);
    }

    // Check if user is already a member
    const isAlreadyMember = await this.teamMemberRepository.isUserInTeam(
      dto.teamId,
      dto.memberUserId
    );

    if (isAlreadyMember) {
      throw new TeamMemberAlreadyExistsError(dto.memberUserId, dto.teamId);
    }

    // Create team member entity
    const teamMember = TeamMemberMapper.toEntity(dto);

    // Save entity
    const savedMember = await this.teamMemberRepository.addTeamMember(teamMember);

    // Convert to output DTO
    return TeamMemberMapper.toDto(savedMember);
  }
}
