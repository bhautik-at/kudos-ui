import { Team } from './Team';

describe('Team Entity', () => {
  it('should create a valid team with required properties', () => {
    // Arrange
    const teamProps = {
      name: 'Engineering Team',
      organizationId: 'org-123',
      createdBy: 'user-123',
    };

    // Act
    const team = new Team(teamProps);

    // Assert
    expect(team.name).toBe('Engineering Team');
    expect(team.organizationId).toBe('org-123');
    expect(team.createdBy).toBe('user-123');
    expect(team.members).toEqual([]);
    expect(team.createdAt).toBeInstanceOf(Date);
    expect(team.updatedAt).toBeInstanceOf(Date);
  });

  it('should create a team with all properties', () => {
    // Arrange
    const now = new Date();
    const teamProps = {
      id: 'team-123',
      name: 'Engineering Team',
      organizationId: 'org-123',
      createdBy: 'user-123',
      createdAt: now,
      updatedAt: now,
      members: ['user-123', 'user-456'],
    };

    // Act
    const team = new Team(teamProps);

    // Assert
    expect(team.id).toBe('team-123');
    expect(team.name).toBe('Engineering Team');
    expect(team.organizationId).toBe('org-123');
    expect(team.createdBy).toBe('user-123');
    expect(team.members).toEqual(['user-123', 'user-456']);
    expect(team.createdAt).toBe(now);
    expect(team.updatedAt).toBe(now);
  });

  it('should throw error when team name is empty', () => {
    // Arrange
    const teamProps = {
      name: '',
      organizationId: 'org-123',
      createdBy: 'user-123',
    };

    // Act & Assert
    expect(() => new Team(teamProps)).toThrow('Team name is required');
  });

  it('should throw error when team name is too short', () => {
    // Arrange
    const teamProps = {
      name: 'A',
      organizationId: 'org-123',
      createdBy: 'user-123',
    };

    // Act & Assert
    expect(() => new Team(teamProps)).toThrow('Team name must be at least 2 characters long');
  });

  it('should throw error when organizationId is missing', () => {
    // Arrange
    const teamProps = {
      name: 'Engineering Team',
      organizationId: '',
      createdBy: 'user-123',
    };

    // Act & Assert
    expect(() => new Team(teamProps)).toThrow('Organization ID is required');
  });

  it('should throw error when createdBy is missing', () => {
    // Arrange
    const teamProps = {
      name: 'Engineering Team',
      organizationId: 'org-123',
      createdBy: '',
    };

    // Act & Assert
    expect(() => new Team(teamProps)).toThrow('Creator ID is required');
  });
});
