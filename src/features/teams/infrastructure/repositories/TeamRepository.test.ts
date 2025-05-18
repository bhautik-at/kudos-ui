import { TeamRepository } from './TeamRepository';
import { TeamApiClient } from '../api/TeamApiClient';
import { Team } from '../../domain/entities/Team';

// Mock the API client
jest.mock('../api/TeamApiClient');

describe('TeamRepository', () => {
  let repository: TeamRepository;
  let mockApiClient: jest.Mocked<TeamApiClient>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockApiClient = new TeamApiClient() as jest.Mocked<TeamApiClient>;
    repository = new TeamRepository(mockApiClient);
  });

  describe('createTeam', () => {
    it('should create a team and return domain entity', async () => {
      // Arrange
      const team = new Team({
        name: 'Engineering Team',
        organizationId: 'org-123',
        createdBy: 'user-123',
        members: ['user-123', 'user-456'],
      });

      const mockApiResponse = {
        id: 'team-123',
        name: 'Engineering Team',
        organizationId: 'org-123',
        createdBy: 'user-123',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      mockApiClient.createTeam.mockResolvedValue(mockApiResponse);

      // Act
      const result = await repository.createTeam(team);

      // Assert
      expect(mockApiClient.createTeam).toHaveBeenCalledWith('org-123', {
        name: 'Engineering Team',
        members: ['user-123', 'user-456'],
      });

      expect(result).toBeInstanceOf(Team);
      expect(result.id).toBe('team-123');
      expect(result.name).toBe('Engineering Team');
      expect(result.organizationId).toBe('org-123');
      expect(result.createdBy).toBe('user-123');
      expect(result.createdAt).toEqual(new Date('2023-01-01T00:00:00Z'));
      expect(result.updatedAt).toEqual(new Date('2023-01-01T00:00:00Z'));
    });

    it('should propagate errors', async () => {
      // Arrange
      const team = new Team({
        name: 'Engineering Team',
        organizationId: 'org-123',
        createdBy: 'user-123',
      });

      const error = new Error('API error');
      mockApiClient.createTeam.mockRejectedValue(error);

      // Act & Assert
      await expect(repository.createTeam(team)).rejects.toThrow('Failed to create team');
      expect(mockApiClient.createTeam).toHaveBeenCalled();
    });
  });

  describe('findTeamById', () => {
    it('should return Team entity when API client returns team data', async () => {
      // Arrange
      const mockApiResponse = {
        id: 'team-123',
        name: 'Engineering Team',
        organizationId: 'org-123',
        createdBy: 'user-123',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      mockApiClient.getTeam.mockResolvedValue(mockApiResponse);

      // Act
      const result = await repository.findTeamById('team-123');

      // Assert
      expect(mockApiClient.getTeam).toHaveBeenCalledWith('team-123');
      expect(result).toBeInstanceOf(Team);
      expect(result?.id).toBe('team-123');
      expect(result?.name).toBe('Engineering Team');
    });

    it('should return null when API client returns null', async () => {
      // Arrange
      mockApiClient.getTeam.mockResolvedValue(null);

      // Act
      const result = await repository.findTeamById('team-123');

      // Assert
      expect(mockApiClient.getTeam).toHaveBeenCalledWith('team-123');
      expect(result).toBeNull();
    });

    it('should return null when API client throws an error', async () => {
      // Arrange
      const error = new Error('API error');
      mockApiClient.getTeam.mockRejectedValue(error);

      // Act
      const result = await repository.findTeamById('team-123');

      // Assert
      expect(mockApiClient.getTeam).toHaveBeenCalledWith('team-123');
      expect(result).toBeNull();
    });
  });

  describe('findTeamsByOrganizationId', () => {
    it('should return array of Team entities', async () => {
      // Arrange
      const mockApiResponse = [
        {
          id: 'team-1',
          name: 'Team 1',
          organizationId: 'org-123',
          createdBy: 'user-123',
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z',
        },
        {
          id: 'team-2',
          name: 'Team 2',
          organizationId: 'org-123',
          createdBy: 'user-123',
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z',
        },
      ];

      mockApiClient.getTeams.mockResolvedValue(mockApiResponse);

      // Act
      const result = await repository.findTeamsByOrganizationId('org-123', 'Team');

      // Assert
      expect(mockApiClient.getTeams).toHaveBeenCalledWith('org-123', 'Team');
      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(Team);
      expect(result[0].id).toBe('team-1');
      expect(result[0].name).toBe('Team 1');
      expect(result[1]).toBeInstanceOf(Team);
      expect(result[1].id).toBe('team-2');
      expect(result[1].name).toBe('Team 2');
    });

    it('should return empty array when API client throws an error', async () => {
      // Arrange
      const error = new Error('API error');
      mockApiClient.getTeams.mockRejectedValue(error);

      // Act
      const result = await repository.findTeamsByOrganizationId('org-123');

      // Assert
      expect(mockApiClient.getTeams).toHaveBeenCalledWith('org-123', undefined);
      expect(result).toEqual([]);
    });
  });

  describe('deleteTeam', () => {
    it('should call API client to delete team', async () => {
      // Arrange
      mockApiClient.deleteTeam.mockResolvedValue(undefined);

      // Act
      await repository.deleteTeam('team-123');

      // Assert
      expect(mockApiClient.deleteTeam).toHaveBeenCalledWith('team-123');
    });

    it('should propagate errors', async () => {
      // Arrange
      const error = new Error('API error');
      mockApiClient.deleteTeam.mockRejectedValue(error);

      // Act & Assert
      await expect(repository.deleteTeam('team-123')).rejects.toThrow('Failed to delete team');
      expect(mockApiClient.deleteTeam).toHaveBeenCalledWith('team-123');
    });
  });
});
