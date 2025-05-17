import { TeamRepository } from '../../domain/interfaces/TeamRepository';
import { TeamOutputDto } from '../dtos/TeamOutputDto';
import { TeamMapper } from '../mappers/TeamMapper';

export class ListTeamsByOrganizationUseCase {
  constructor(private teamRepository: TeamRepository) {}

  async execute(organizationId: string, nameFilter?: string): Promise<TeamOutputDto[]> {
    const teams = await this.teamRepository.findTeamsByOrganizationId(organizationId, nameFilter);
    return TeamMapper.toDtoList(teams);
  }
}
