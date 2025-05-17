import { TeamRepository } from '../../domain/interfaces/TeamRepository';
import { CreateTeamInputDto } from '../dtos/CreateTeamInputDto';
import { TeamOutputDto } from '../dtos/TeamOutputDto';
import { TeamMapper } from '../mappers/TeamMapper';

export class CreateTeamUseCase {
  constructor(private teamRepository: TeamRepository) {}

  async execute(dto: CreateTeamInputDto): Promise<TeamOutputDto> {
    // Convert input DTO to domain entity
    const team = TeamMapper.toEntity(dto);

    // Save entity
    const savedTeam = await this.teamRepository.createTeam(team);

    // Convert domain entity to output DTO
    return TeamMapper.toDto(savedTeam);
  }
}
