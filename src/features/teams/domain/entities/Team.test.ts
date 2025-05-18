import { Team } from './Team';

describe('Team Entity', () => {
  const validTeamProps = {
    name: 'Frontend Team',
    organizationId: 'org-123',
    createdBy: 'user-123',
  };

  it('should create a valid team', () => {
    // Arrange
    const props = { ...validTeamProps };
    
    // Act
    const team = new Team(props);
    
    // Assert
    expect(team.name).toBe(props.name);
    expect(team.organizationId).toBe(props.organizationId);
    expect(team.createdBy).toBe(props.createdBy);
    expect(team.members).toEqual([]);
    expect(team.createdAt).toBeInstanceOf(Date);
    expect(team.updatedAt).toBeInstanceOf(Date);
  });

  it('should create a team with members', () => {
    // Arrange
    const props = { 
      ...validTeamProps,
      members: ['user-123', 'user-456', 'user-789']
    };
    
    // Act
    const team = new Team(props);
    
    // Assert
    expect(team.members).toEqual(['user-123', 'user-456', 'user-789']);
  });

  it('should create a team with custom created and updated dates', () => {
    // Arrange
    const createdAt = new Date('2023-01-01');
    const updatedAt = new Date('2023-01-02');
    const props = { 
      ...validTeamProps,
      createdAt,
      updatedAt
    };
    
    // Act
    const team = new Team(props);
    
    // Assert
    expect(team.createdAt).toBe(createdAt);
    expect(team.updatedAt).toBe(updatedAt);
  });

  it('should throw error when team name is empty', () => {
    // Arrange & Act & Assert
    expect(() => new Team({ 
      ...validTeamProps, 
      name: '' 
    })).toThrow('Team name is required');

    expect(() => new Team({ 
      ...validTeamProps, 
      name: '   ' 
    })).toThrow('Team name is required');
  });

  it('should throw error when team name is too short', () => {
    // Arrange & Act & Assert
    expect(() => new Team({ 
      ...validTeamProps, 
      name: 'A'
    })).toThrow('Team name must be at least 2 characters long');
  });

  it('should throw error when organization ID is missing', () => {
    // Arrange & Act & Assert
    expect(() => new Team({ 
      ...validTeamProps, 
      organizationId: ''
    })).toThrow('Organization ID is required');
  });

  it('should throw error when creator ID is missing', () => {
    // Arrange & Act & Assert
    expect(() => new Team({ 
      ...validTeamProps, 
      createdBy: ''
    })).toThrow('Creator ID is required');
  });

  it('should accept a team with an ID', () => {
    // Arrange
    const props = { 
      ...validTeamProps,
      id: 'team-123'
    };
    
    // Act
    const team = new Team(props);
    
    // Assert
    expect(team.id).toBe('team-123');
  });
}); 