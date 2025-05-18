import { KudoRepository } from './KudoRepository';
import { KudoApiClient } from '../api/KudoApiClient';
import { Kudo } from '../../domain/entities/Kudo';
import { ApiError } from '@/shared/errors/ApiError';

// Mock the KudoApiClient
jest.mock('../api/KudoApiClient');

describe('KudoRepository', () => {
  let repository: KudoRepository;
  let mockApiClient: jest.Mocked<KudoApiClient>;
  
  const mockDate = new Date('2023-01-01T00:00:00.000Z');
  
  beforeEach(() => {
    // Create a mock API client
    mockApiClient = new KudoApiClient() as jest.Mocked<KudoApiClient>;
    
    // Create the repository with the mock client
    repository = new KudoRepository(mockApiClient);
    
    // Reset all mocks
    jest.resetAllMocks();
  });
  
  describe('create', () => {
    it('should successfully create a kudo', async () => {
      // Arrange
      const kudoToCreate = new Kudo({
        recipientId: 'user-123',
        senderId: 'user-456',
        teamId: 'team-789',
        categoryId: 'cat-101',
        message: 'Great job!',
        organizationId: 'org-123',
        createdAt: mockDate,
      });
      
      const apiResponse = {
        id: 'kudo-123',
        recipient_id: 'user-123',
        recipient_name: 'John Doe',
        sender_id: 'user-456',
        sender_name: 'Jane Smith',
        team_id: 'team-789',
        team_name: 'Engineering',
        category_id: 'cat-101',
        category_name: 'Teamwork',
        message: 'Great job!',
        organization_id: 'org-123',
        created_at: '2023-01-01T00:00:00.000Z',
      };
      
      mockApiClient.createKudo.mockResolvedValue(apiResponse);
      
      // Act
      const result = await repository.create(kudoToCreate);
      
      // Assert
      expect(mockApiClient.createKudo).toHaveBeenCalledWith({
        recipient_id: 'user-123',
        team_id: 'team-789',
        category_id: 'cat-101',
        message: 'Great job!',
        organization_id: 'org-123',
      });
      
      expect(result).toBeInstanceOf(Kudo);
      expect(result.id).toBe('kudo-123');
      expect(result.recipientId).toBe('user-123');
      expect(result.senderId).toBe('user-456');
      expect(result.teamId).toBe('team-789');
      expect(result.categoryId).toBe('cat-101');
      expect(result.message).toBe('Great job!');
      expect(result.organizationId).toBe('org-123');
      expect(result.createdAt).toEqual(new Date(apiResponse.created_at));
    });
    
    it('should propagate ApiError', async () => {
      // Arrange
      const kudoToCreate = new Kudo({
        recipientId: 'user-123',
        senderId: 'user-456',
        teamId: 'team-789',
        categoryId: 'cat-101',
        message: 'Great job!',
        organizationId: 'org-123',
      });
      
      const apiError = new ApiError('Validation failed', 400);
      mockApiClient.createKudo.mockRejectedValue(apiError);
      
      // Act & Assert
      await expect(repository.create(kudoToCreate)).rejects.toThrow(apiError);
    });
    
    it('should wrap generic errors', async () => {
      // Arrange
      const kudoToCreate = new Kudo({
        recipientId: 'user-123',
        senderId: 'user-456',
        teamId: 'team-789',
        categoryId: 'cat-101',
        message: 'Great job!',
        organizationId: 'org-123',
      });
      
      mockApiClient.createKudo.mockRejectedValue(new Error('Network error'));
      
      // Act & Assert
      await expect(repository.create(kudoToCreate)).rejects.toThrow('Failed to create kudo');
    });
  });
  
  describe('update', () => {
    it('should successfully update a kudo', async () => {
      // Arrange
      const kudoToUpdate = new Kudo({
        id: 'kudo-123',
        recipientId: 'user-123',
        senderId: 'user-456',
        teamId: 'team-789',
        categoryId: 'cat-101',
        message: 'Updated message',
        organizationId: 'org-123',
        createdAt: mockDate,
      });
      
      const apiResponse = {
        id: 'kudo-123',
        recipient_id: 'user-123',
        recipient_name: 'John Doe',
        sender_id: 'user-456',
        sender_name: 'Jane Smith',
        team_id: 'team-789',
        team_name: 'Engineering',
        category_id: 'cat-101',
        category_name: 'Teamwork',
        message: 'Updated message',
        organization_id: 'org-123',
        created_at: '2023-01-01T00:00:00.000Z',
        updated_at: '2023-01-02T00:00:00.000Z',
      };
      
      mockApiClient.updateKudo.mockResolvedValue(apiResponse);
      
      // Act
      const result = await repository.update(kudoToUpdate);
      
      // Assert
      expect(mockApiClient.updateKudo).toHaveBeenCalledWith('kudo-123', {
        recipient_id: 'user-123',
        team_id: 'team-789',
        category_id: 'cat-101',
        message: 'Updated message',
      });
      
      expect(result).toBeInstanceOf(Kudo);
      expect(result.id).toBe('kudo-123');
      expect(result.message).toBe('Updated message');
      expect(result.createdAt).toEqual(new Date(apiResponse.created_at));
    });
    
    it('should throw error if kudo has no id', async () => {
      // Arrange
      const kudoWithoutId = new Kudo({
        recipientId: 'user-123',
        senderId: 'user-456',
        teamId: 'team-789',
        categoryId: 'cat-101',
        message: 'Message',
        organizationId: 'org-123',
      });
      
      // Spy on console.error
      const consoleErrorSpy = jest.spyOn(console, 'error');
      
      // Act & Assert
      await expect(repository.update(kudoWithoutId)).rejects.toThrow();
      
      // Check that the API client was not called
      expect(mockApiClient.updateKudo).not.toHaveBeenCalled();
      
      // Check that the correct error message was logged
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error updating kudo:',
        expect.objectContaining({
          message: 'Kudo ID is required for update'
        })
      );
      
      // Restore console.error
      consoleErrorSpy.mockRestore();
    });
  });
  
  describe('delete', () => {
    it('should successfully delete a kudo', async () => {
      // Arrange
      const kudoId = 'kudo-123';
      const organizationId = 'org-123';
      
      mockApiClient.deleteKudo.mockResolvedValue(true);
      
      // Act
      const result = await repository.delete(kudoId, organizationId);
      
      // Assert
      expect(mockApiClient.deleteKudo).toHaveBeenCalledWith(kudoId);
      expect(result).toBe(true);
    });
    
    it('should propagate ApiError', async () => {
      // Arrange
      const kudoId = 'kudo-123';
      const organizationId = 'org-123';
      
      const apiError = new ApiError('Unauthorized', 401);
      mockApiClient.deleteKudo.mockRejectedValue(apiError);
      
      // Act & Assert
      await expect(repository.delete(kudoId, organizationId)).rejects.toThrow(apiError);
      expect(mockApiClient.deleteKudo).toHaveBeenCalledWith(kudoId);
    });
    
    it('should wrap generic errors', async () => {
      // Arrange
      const kudoId = 'kudo-123';
      const organizationId = 'org-123';
      
      const networkError = new Error('Network error');
      mockApiClient.deleteKudo.mockRejectedValue(networkError);
      
      // Spy on console.error
      const consoleErrorSpy = jest.spyOn(console, 'error');
      
      // Act & Assert
      await expect(repository.delete(kudoId, organizationId)).rejects.toThrow('Failed to delete kudo');
      expect(mockApiClient.deleteKudo).toHaveBeenCalledWith(kudoId);
      
      // Check that the error was logged
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error deleting kudo:', networkError);
      
      // Restore console.error
      consoleErrorSpy.mockRestore();
    });
  });
  
  describe('findById', () => {
    it('should successfully find a kudo by id', async () => {
      // Arrange
      const kudoId = 'kudo-123';
      const organizationId = 'org-123';
      
      const apiResponse = {
        id: 'kudo-123',
        recipient_id: 'user-123',
        recipient_name: 'John Doe',
        sender_id: 'user-456',
        sender_name: 'Jane Smith',
        team_id: 'team-789',
        team_name: 'Engineering',
        category_id: 'cat-101',
        category_name: 'Teamwork',
        message: 'Great job!',
        organization_id: 'org-123',
        created_at: '2023-01-01T00:00:00.000Z',
      };
      
      mockApiClient.getKudoById.mockResolvedValue(apiResponse);
      
      // Act
      const result = await repository.findById(kudoId, organizationId);
      
      // Assert
      expect(mockApiClient.getKudoById).toHaveBeenCalledWith(kudoId, organizationId);
      expect(result).toBeInstanceOf(Kudo);
      expect(result?.id).toBe('kudo-123');
      expect(result?.recipientId).toBe('user-123');
      expect(result?.senderId).toBe('user-456');
    });
    
    it('should return null when API throws 404', async () => {
      // Arrange
      const kudoId = 'non-existent-kudo';
      const organizationId = 'org-123';
      
      mockApiClient.getKudoById.mockRejectedValue(new ApiError('Kudo not found', 404));
      
      // Act
      const result = await repository.findById(kudoId, organizationId);
      
      // Assert
      expect(result).toBeNull();
    });
    
    it('should propagate other API errors', async () => {
      // Arrange
      const kudoId = 'kudo-123';
      const organizationId = 'org-123';
      
      const apiError = new ApiError('Unauthorized', 401);
      mockApiClient.getKudoById.mockRejectedValue(apiError);
      
      // Act & Assert
      await expect(repository.findById(kudoId, organizationId)).rejects.toThrow(apiError);
    });
    
    it('should wrap non-ApiError errors', async () => {
      // Arrange
      const kudoId = 'kudo-123';
      const organizationId = 'org-123';
      
      const networkError = new Error('Network error');
      mockApiClient.getKudoById.mockRejectedValue(networkError);
      
      // Act & Assert
      await expect(repository.findById(kudoId, organizationId)).rejects.toThrow('Failed to fetch kudo');
      
      // Verify console.error was called
      const consoleErrorSpy = jest.spyOn(console, 'error');
      await expect(repository.findById(kudoId, organizationId)).rejects.toThrow();
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching kudo:', networkError);
      consoleErrorSpy.mockRestore();
    });
  });
  
  describe('findAll', () => {
    it('should successfully find all kudos with params', async () => {
      // Arrange
      const params = {
        recipientId: 'user-123',
        organizationId: 'org-123',
        page: 1,
        limit: 10,
      };
      
      const apiResponse = {
        success: true,
        data: [
          {
            id: 'kudo-123',
            recipient_id: 'user-123',
            recipient_name: 'John Doe',
            sender_id: 'user-456',
            sender_name: 'Jane Smith',
            team_id: 'team-789',
            team_name: 'Engineering',
            category_id: 'cat-101',
            category_name: 'Teamwork',
            message: 'Great job!',
            organization_id: 'org-123',
            created_at: '2023-01-01T00:00:00.000Z',
          },
          {
            id: 'kudo-456',
            recipient_id: 'user-123',
            recipient_name: 'John Doe',
            sender_id: 'user-789',
            sender_name: 'Bob Johnson',
            team_id: 'team-456',
            team_name: 'Product',
            category_id: 'cat-202',
            category_name: 'Innovation',
            message: 'Amazing work!',
            organization_id: 'org-123',
            created_at: '2023-01-02T00:00:00.000Z',
          }
        ],
        pagination: {
          total: 2,
          pages: 1,
          current_page: 1,
          limit: 10,
        }
      };
      
      mockApiClient.getKudos.mockResolvedValue(apiResponse);
      
      // Act
      const result = await repository.findAll(params);
      
      // Assert
      expect(mockApiClient.getKudos).toHaveBeenCalledWith({
        recipient_id: 'user-123',
        organization_id: 'org-123',
        page: 1,
        limit: 10,
      });
      
      expect(result.kudos).toHaveLength(2);
      expect(result.kudos[0]).toBeInstanceOf(Kudo);
      expect(result.kudos[0].id).toBe('kudo-123');
      expect(result.kudos[1].id).toBe('kudo-456');
      expect(result.total).toBe(2);
      expect(result.pages).toBe(1);
      expect(result.currentPage).toBe(1);
      expect(result.limit).toBe(10);
    });
    
    it('should propagate API errors', async () => {
      // Arrange
      const params = {
        organizationId: 'org-123',
      };
      
      const apiError = new ApiError('Unauthorized', 401);
      mockApiClient.getKudos.mockRejectedValue(apiError);
      
      // Act & Assert
      await expect(repository.findAll(params)).rejects.toThrow(apiError);
    });
    
    it('should wrap generic errors', async () => {
      // Arrange
      const params = {
        organizationId: 'org-123',
      };
      
      mockApiClient.getKudos.mockRejectedValue(new Error('Network error'));
      
      // Act & Assert
      await expect(repository.findAll(params)).rejects.toThrow('Failed to fetch kudos');
    });
  });
}); 