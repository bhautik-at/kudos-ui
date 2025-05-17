import { TeamNotFoundError } from '../../domain/errors/TeamNotFoundError';
import { TeamRepository } from '../../domain/interfaces/TeamRepository';
import { TeamOutputDto } from '../dtos/TeamOutputDto';
import { UpdateTeamInputDto } from '../dtos/UpdateTeamInputDto';
import { TeamMapper } from '../mappers/TeamMapper';

export class UpdateTeamUseCase {
  constructor(private teamRepository: TeamRepository) {}

  async execute(dto: UpdateTeamInputDto): Promise<TeamOutputDto> {
    // Check if team exists
    const existingTeam = await this.teamRepository.findTeamById(dto.id);

    if (!existingTeam) {
      throw new TeamNotFoundError(dto.id);
    }

    // Create updated team entity
    const updatedTeam = TeamMapper.toEntityFromUpdate(dto, existingTeam);

    // Save updated entity
    const savedTeam = await this.teamRepository.updateTeam(updatedTeam);

    // Convert to output DTO
    return TeamMapper.toDto(savedTeam);
  }
}
