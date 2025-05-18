import { TeamApiClient } from './TeamApiClient';
import { httpService } from '@/shared/services/http/HttpService';

// Mock the httpService
jest.mock('@/shared/services/http/HttpService', () => ({
  httpService: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('TeamApiClient', () => {
  let apiClient: TeamApiClient;

  beforeEach(() => {
    jest.clearAllMocks();
    apiClient = new TeamApiClient();
  });

  describe('createTeam', () => {
    it('should create a team successfully', async () => {
      // Arrange
      const organizationId = 'org-123';
      const createTeamData = {
        name: 'Engineering Team',
        members: ['user-123', 'user-456'],
      };

      const mockTeamData = {
        id: 'team-123',
        name: 'Engineering Team',
        organizationId: 'org-123',
        createdBy: 'user-123',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      const mockResponse = {
        data: {
          success: true,
          team: mockTeamData,
        },
      };

      (httpService.post as jest.Mock).mockResolvedValue(mockResponse);

      // Act
      const result = await apiClient.createTeam(organizationId, createTeamData);

      // Assert
      expect(httpService.post).toHaveBeenCalledWith(
        '/api/organizations/org-123/teams',
        createTeamData,
        undefined
      );
      expect(result).toEqual(mockTeamData);
    });

    it('should handle API error responses', async () => {
      // Arrange
      const organizationId = 'org-123';
      const createTeamData = {
        name: 'Engineering Team',
      };

      const mockResponse = {
        data: {
          success: false,
          message: 'Invalid team data',
        },
      };

      (httpService.post as jest.Mock).mockResolvedValue(mockResponse);

      // Act & Assert
      await expect(apiClient.createTeam(organizationId, createTeamData)).rejects.toThrow(
        'Invalid team data'
      );
    });

    it('should propagate network errors', async () => {
      // Arrange
      const organizationId = 'org-123';
      const createTeamData = {
        name: 'Engineering Team',
      };

      const networkError = new Error('Network error');
      (httpService.post as jest.Mock).mockRejectedValue(networkError);

      // Act & Assert
      await expect(apiClient.createTeam(organizationId, createTeamData)).rejects.toThrow(
        networkError
      );
    });
  });

  describe('getTeam', () => {
    it('should fetch a team successfully', async () => {
      // Arrange
      const teamId = 'team-123';
      const mockTeamData = {
        id: 'team-123',
        name: 'Engineering Team',
        organizationId: 'org-123',
        createdBy: 'user-123',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      const mockResponse = {
        data: {
          success: true,
          team: mockTeamData,
        },
      };

      (httpService.get as jest.Mock).mockResolvedValue(mockResponse);

      // Act
      const result = await apiClient.getTeam(teamId);

      // Assert
      expect(httpService.get).toHaveBeenCalledWith('/api/teams/team-123', undefined);
      expect(result).toEqual(mockTeamData);
    });

    it('should return null when team is not found', async () => {
      // Arrange
      const teamId = 'team-123';
      const mockResponse = {
        data: {
          success: false,
          message: 'Team not found',
        },
      };

      (httpService.get as jest.Mock).mockResolvedValue(mockResponse);

      // Act
      const result = await apiClient.getTeam(teamId);

      // Assert
      expect(result).toBeNull();
    });

    it('should return null for 404 errors', async () => {
      // Arrange
      const teamId = 'team-123';
      const error = new Error('Not found');
      (error as any).response = { status: 404 };

      (httpService.get as jest.Mock).mockRejectedValue(error);

      // Act
      const result = await apiClient.getTeam(teamId);

      // Assert
      expect(result).toBeNull();
    });

    it('should propagate other errors', async () => {
      // Arrange
      const teamId = 'team-123';
      const error = new Error('Server error');
      (error as any).response = { status: 500 };

      (httpService.get as jest.Mock).mockRejectedValue(error);

      // Act & Assert
      await expect(apiClient.getTeam(teamId)).rejects.toThrow(error);
    });
  });

  describe('getTeamMembers', () => {
    it('should fetch team members successfully', async () => {
      // Arrange
      const teamId = 'team-123';
      const mockTeamMembers = [
        {
          id: 'member-1',
          teamId: 'team-123',
          userId: 'user-1',
          firstName: 'John',
          lastName: 'Doe',
          fullName: 'John Doe',
          email: 'john@example.com',
          role: 'Developer',
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z',
        },
        {
          id: 'member-2',
          teamId: 'team-123',
          userId: 'user-2',
          firstName: 'Jane',
          lastName: 'Smith',
          fullName: 'Jane Smith',
          email: 'jane@example.com',
          role: 'Designer',
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z',
        },
      ];

      const mockResponse = {
        data: {
          success: true,
          members: mockTeamMembers,
        },
      };

      (httpService.get as jest.Mock).mockResolvedValue(mockResponse);

      // Act
      const result = await apiClient.getTeamMembers(teamId);

      // Assert
      expect(httpService.get).toHaveBeenCalledWith('/api/teams/team-123/members', undefined);
      expect(result).toEqual(mockTeamMembers);
    });
  });
});
