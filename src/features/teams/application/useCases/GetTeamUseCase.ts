import { TeamNotFoundError } from '../../domain/errors/TeamNotFoundError';
import { TeamRepository } from '../../domain/interfaces/TeamRepository';
import { TeamOutputDto } from '../dtos/TeamOutputDto';
import { TeamMapper } from '../mappers/TeamMapper';

export class GetTeamUseCase {
  constructor(private teamRepository: TeamRepository) {}

  async execute(teamId: string): Promise<TeamOutputDto> {
    const team = await this.teamRepository.findTeamById(teamId);

    if (!team) {
      throw new TeamNotFoundError(teamId);
    }

    return TeamMapper.toDto(team);
  }
}
