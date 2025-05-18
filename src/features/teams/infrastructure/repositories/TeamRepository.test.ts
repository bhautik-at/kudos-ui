import { Team } from '../../domain/entities/Team';
import { TeamApiClient } from '../api/TeamApiClient';
import { TeamRepository } from './TeamRepository';

// Mock the API client
jest.mock('../api/TeamApiClient');

describe('TeamRepository', () => {
  let teamRepository: TeamRepository;
  let mockTeamApiClient: jest.Mocked<TeamApiClient>;

  beforeEach(() => {
    // Create the mock api client
    mockTeamApiClient = new TeamApiClient() as jest.Mocked<TeamApiClient>;
    
    // Create repository with mock client
    teamRepository = new TeamRepository(mockTeamApiClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createTeam', () => {
    it('should create a team and return a domain entity', async () => {
      // Arrange
      const teamToCreate = new Team({
        name: 'Engineering Team',
        organizationId: 'org-123',
        createdBy: 'user-123',
        members: ['user-123', 'user-456']
      });

      const mockApiResponse = {
        id: 'team-123',
        name: 'Engineering Team',
        organizationId: 'org-123',
        createdBy: 'user-123',
        createdAt: '2023-05-20T12:00:00.000Z',
        updatedAt: '2023-05-20T12:00:00.000Z'
      };

      mockTeamApiClient.createTeam.mockResolvedValue(mockApiResponse);

      // Act
      const result = await teamRepository.createTeam(teamToCreate);

      // Assert
      expect(mockTeamApiClient.createTeam).toHaveBeenCalledWith(
        'org-123',
        {
          name: 'Engineering Team',
          members: ['user-123', 'user-456']
        }
      );

      expect(result).toBeInstanceOf(Team);
      expect(result.id).toBe('team-123');
      expect(result.name).toBe('Engineering Team');
      expect(result.organizationId).toBe('org-123');
      expect(result.createdBy).toBe('user-123');
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
    });

    it('should throw an error when API client fails', async () => {
      // Arrange
      const teamToCreate = new Team({
        name: 'Engineering Team',
        organizationId: 'org-123',
        createdBy: 'user-123'
      });

      mockTeamApiClient.createTeam.mockRejectedValue(new Error('API error'));

      // Act & Assert
      await expect(teamRepository.createTeam(teamToCreate)).rejects.toThrow('Failed to create team');
      expect(mockTeamApiClient.createTeam).toHaveBeenCalled();
    });
  });

  describe('findTeamById', () => {
    it('should return a domain entity when team exists', async () => {
      // Arrange
      const mockApiResponse = {
        id: 'team-123',
        name: 'Engineering Team',
        organizationId: 'org-123',
        createdBy: 'user-123',
        createdAt: '2023-05-20T12:00:00.000Z',
        updatedAt: '2023-05-20T12:00:00.000Z'
      };

      mockTeamApiClient.getTeam.mockResolvedValue(mockApiResponse);

      // Act
      const result = await teamRepository.findTeamById('team-123');

      // Assert
      expect(mockTeamApiClient.getTeam).toHaveBeenCalledWith('team-123');
      expect(result).toBeInstanceOf(Team);
      expect(result?.id).toBe('team-123');
      expect(result?.name).toBe('Engineering Team');
    });

    it('should return null when team does not exist', async () => {
      // Arrange
      mockTeamApiClient.getTeam.mockResolvedValue(null);

      // Act
      const result = await teamRepository.findTeamById('non-existent-id');

      // Assert
      expect(mockTeamApiClient.getTeam).toHaveBeenCalledWith('non-existent-id');
      expect(result).toBeNull();
    });

    it('should return null when API client throws an error', async () => {
      // Arrange
      mockTeamApiClient.getTeam.mockRejectedValue(new Error('API error'));

      // Act
      const result = await teamRepository.findTeamById('team-123');

      // Assert
      expect(mockTeamApiClient.getTeam).toHaveBeenCalledWith('team-123');
      expect(result).toBeNull();
    });
  });

  describe('findTeamsByOrganizationId', () => {
    it('should return array of domain entities', async () => {
      // Arrange
      const mockApiResponse = [
        {
          id: 'team-123',
          name: 'Engineering Team',
          organizationId: 'org-123',
          createdBy: 'user-123',
          createdAt: '2023-05-20T12:00:00.000Z',
          updatedAt: '2023-05-20T12:00:00.000Z'
        },
        {
          id: 'team-456',
          name: 'Marketing Team',
          organizationId: 'org-123',
          createdBy: 'user-123',
          createdAt: '2023-05-21T12:00:00.000Z',
          updatedAt: '2023-05-21T12:00:00.000Z'
        }
      ];

      mockTeamApiClient.getTeams.mockResolvedValue(mockApiResponse);

      // Act
      const result = await teamRepository.findTeamsByOrganizationId('org-123');

      // Assert
      expect(mockTeamApiClient.getTeams).toHaveBeenCalledWith('org-123', undefined);
      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(Team);
      expect(result[0].id).toBe('team-123');
      expect(result[0].name).toBe('Engineering Team');
      expect(result[1]).toBeInstanceOf(Team);
      expect(result[1].id).toBe('team-456');
      expect(result[1].name).toBe('Marketing Team');
    });

    it('should return empty array when API client throws an error', async () => {
      // Arrange
      mockTeamApiClient.getTeams.mockRejectedValue(new Error('API error'));

      // Act
      const result = await teamRepository.findTeamsByOrganizationId('org-123');

      // Assert
      expect(mockTeamApiClient.getTeams).toHaveBeenCalledWith('org-123', undefined);
      expect(result).toEqual([]);
    });

    it('should pass name filter to API client', async () => {
      // Arrange
      mockTeamApiClient.getTeams.mockResolvedValue([]);

      // Act
      await teamRepository.findTeamsByOrganizationId('org-123', 'Engineering');

      // Assert
      expect(mockTeamApiClient.getTeams).toHaveBeenCalledWith('org-123', 'Engineering');
    });
  });

  describe('updateTeam', () => {
    it('should update team and return updated domain entity', async () => {
      // Arrange
      const teamToUpdate = new Team({
        id: 'team-123',
        name: 'Updated Team Name',
        organizationId: 'org-123',
        createdBy: 'user-123',
        members: ['user-123', 'user-789']
      });

      const mockApiResponse = {
        id: 'team-123',
        name: 'Updated Team Name',
        organizationId: 'org-123',
        createdBy: 'user-123',
        createdAt: '2023-05-20T12:00:00.000Z',
        updatedAt: '2023-05-22T12:00:00.000Z'
      };

      mockTeamApiClient.updateTeam.mockResolvedValue(mockApiResponse);

      // Act
      const result = await teamRepository.updateTeam(teamToUpdate);

      // Assert
      expect(mockTeamApiClient.updateTeam).toHaveBeenCalledWith(
        'team-123',
        {
          name: 'Updated Team Name',
          members: ['user-123', 'user-789']
        }
      );

      expect(result).toBeInstanceOf(Team);
      expect(result.id).toBe('team-123');
      expect(result.name).toBe('Updated Team Name');
    });

    it('should throw an error when API client fails', async () => {
      // Arrange
      const teamToUpdate = new Team({
        id: 'team-123',
        name: 'Updated Team Name',
        organizationId: 'org-123',
        createdBy: 'user-123'
      });

      mockTeamApiClient.updateTeam.mockRejectedValue(new Error('API error'));

      // Act & Assert
      await expect(teamRepository.updateTeam(teamToUpdate)).rejects.toThrow('Failed to update team');
      expect(mockTeamApiClient.updateTeam).toHaveBeenCalled();
    });
  });

  describe('deleteTeam', () => {
    it('should call API client to delete team', async () => {
      // Arrange
      mockTeamApiClient.deleteTeam.mockResolvedValue();

      // Act
      await teamRepository.deleteTeam('team-123');

      // Assert
      expect(mockTeamApiClient.deleteTeam).toHaveBeenCalledWith('team-123');
    });

    it('should throw an error when API client fails', async () => {
      // Arrange
      mockTeamApiClient.deleteTeam.mockRejectedValue(new Error('API error'));

      // Act & Assert
      await expect(teamRepository.deleteTeam('team-123')).rejects.toThrow('Failed to delete team');
      expect(mockTeamApiClient.deleteTeam).toHaveBeenCalledWith('team-123');
    });
  });
}); 