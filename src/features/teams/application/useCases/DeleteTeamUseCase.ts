import { TeamNotFoundError } from '../../domain/errors/TeamNotFoundError';
import { TeamRepository } from '../../domain/interfaces/TeamRepository';

export class DeleteTeamUseCase {
  constructor(private teamRepository: TeamRepository) {}

  async execute(teamId: string): Promise<void> {
    // Check if team exists
    const existingTeam = await this.teamRepository.findTeamById(teamId);

    if (!existingTeam) {
      throw new TeamNotFoundError(teamId);
    }

    // Delete team
    await this.teamRepository.deleteTeam(teamId);
  }
}
