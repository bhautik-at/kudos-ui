export class TeamNotFoundError extends Error {
  constructor(teamId?: string) {
    super(teamId ? `Team with ID ${teamId} not found` : 'Team not found');
    this.name = 'TeamNotFoundError';
  }
}
