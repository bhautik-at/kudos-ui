export class TeamMemberAlreadyExistsError extends Error {
  constructor(userId?: string, teamId?: string) {
    super(
      userId && teamId
        ? `User ${userId} is already a member of team ${teamId}`
        : 'User is already a member of this team'
    );
    this.name = 'TeamMemberAlreadyExistsError';
  }
}
