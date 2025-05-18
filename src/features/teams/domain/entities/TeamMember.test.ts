import { TeamMember } from './TeamMember';

describe('TeamMember Entity', () => {
  it('should create a valid team member with required properties', () => {
    // Arrange
    const teamMemberProps = {
      teamId: 'team-123',
      userId: 'user-123',
    };

    // Act
    const teamMember = new TeamMember(teamMemberProps);

    // Assert
    expect(teamMember.teamId).toBe('team-123');
    expect(teamMember.userId).toBe('user-123');
    expect(teamMember.createdAt).toBeInstanceOf(Date);
    expect(teamMember.updatedAt).toBeInstanceOf(Date);
  });

  it('should create a team member with all properties', () => {
    // Arrange
    const now = new Date();
    const teamMemberProps = {
      id: 'member-123',
      teamId: 'team-123',
      userId: 'user-123',
      createdAt: now,
      updatedAt: now,
    };

    // Act
    const teamMember = new TeamMember(teamMemberProps);

    // Assert
    expect(teamMember.id).toBe('member-123');
    expect(teamMember.teamId).toBe('team-123');
    expect(teamMember.userId).toBe('user-123');
    expect(teamMember.createdAt).toBe(now);
    expect(teamMember.updatedAt).toBe(now);
  });

  it('should throw error when teamId is missing', () => {
    // Arrange
    const teamMemberProps = {
      teamId: '',
      userId: 'user-123',
    };

    // Act & Assert
    expect(() => new TeamMember(teamMemberProps)).toThrow('Team ID is required');
  });

  it('should throw error when userId is missing', () => {
    // Arrange
    const teamMemberProps = {
      teamId: 'team-123',
      userId: '',
    };

    // Act & Assert
    expect(() => new TeamMember(teamMemberProps)).toThrow('User ID is required');
  });
});
