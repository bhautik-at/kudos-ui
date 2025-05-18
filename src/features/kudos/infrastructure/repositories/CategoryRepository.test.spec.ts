import { CategoryRepository } from './CategoryRepository';
import { CategoryApiClient } from '../api/CategoryApiClient';
import { ApiError } from '@/shared/errors/ApiError';

// Mock the CategoryApiClient
jest.mock('../api/CategoryApiClient');

describe('CategoryRepository', () => {
  let repository: CategoryRepository;
  let mockApiClient: jest.Mocked<CategoryApiClient>;
  
  beforeEach(() => {
    // Create a mock API client
    mockApiClient = new CategoryApiClient() as jest.Mocked<CategoryApiClient>;
    
    // Create the repository with the mock client
    repository = new CategoryRepository(mockApiClient);
    
    // Reset all mocks
    jest.resetAllMocks();
  });
  
  describe('findById', () => {
    const categoryId = 'cat-123';
    const organizationId = 'org-123';
    
    it('should return null when category does not exist', async () => {
      // Arrange
      mockApiClient.getCategoryById.mockResolvedValue(null);
      
      // Act
      const result = await repository.findById(categoryId, organizationId);
      
      // Assert
      expect(mockApiClient.getCategoryById).toHaveBeenCalledWith(categoryId, organizationId);
      expect(result).toBeNull();
    });
    
    it('should convert API data to domain entity', async () => {
      // Arrange
      const apiResponse = {
        id: 'cat-123',
        name: 'Innovation',
        description: 'For innovative solutions',
        organization_id: 'org-123'
      };
      
      mockApiClient.getCategoryById.mockResolvedValue(apiResponse);
      
      // Act
      const result = await repository.findById(categoryId, organizationId);
      
      // Assert
      expect(mockApiClient.getCategoryById).toHaveBeenCalledWith(categoryId, organizationId);
      expect(result).toEqual({
        id: 'cat-123',
        name: 'Innovation',
        description: 'For innovative solutions',
        organizationId: 'org-123'
      });
    });
    
    it('should propagate ApiError', async () => {
      // Arrange
      const apiError = new ApiError('Unauthorized', 401);
      mockApiClient.getCategoryById.mockRejectedValue(apiError);
      
      // Spy on console.error
      const consoleErrorSpy = jest.spyOn(console, 'error');
      
      // Act & Assert
      await expect(repository.findById(categoryId, organizationId)).rejects.toThrow(apiError);
      
      // Check that error was logged
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching category:', apiError);
      
      // Restore console.error
      consoleErrorSpy.mockRestore();
    });
    
    it('should wrap generic errors', async () => {
      // Arrange
      const networkError = new Error('Network error');
      mockApiClient.getCategoryById.mockRejectedValue(networkError);
      
      // Spy on console.error
      const consoleErrorSpy = jest.spyOn(console, 'error');
      
      // Act & Assert
      await expect(repository.findById(categoryId, organizationId)).rejects.toThrow('Failed to fetch category');
      
      // Check that error was logged
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching category:', networkError);
      
      // Restore console.error
      consoleErrorSpy.mockRestore();
    });
  });
  
  describe('findAll', () => {
    const organizationId = 'org-123';
    
    it('should convert API data to domain entities', async () => {
      // Arrange
      const apiResponse = [
        {
          id: 'cat-123',
          name: 'Innovation',
          description: 'For innovative solutions',
          organization_id: 'org-123'
        },
        {
          id: 'cat-456',
          name: 'Teamwork',
          description: 'For great collaboration',
          organization_id: 'org-123'
        }
      ];
      
      mockApiClient.getCategories.mockResolvedValue(apiResponse);
      
      // Act
      const result = await repository.findAll(organizationId);
      
      // Assert
      expect(mockApiClient.getCategories).toHaveBeenCalledWith(organizationId);
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: 'cat-123',
        name: 'Innovation',
        description: 'For innovative solutions',
        organizationId: 'org-123'
      });
      expect(result[1]).toEqual({
        id: 'cat-456',
        name: 'Teamwork',
        description: 'For great collaboration',
        organizationId: 'org-123'
      });
    });
    
    it('should handle empty list', async () => {
      // Arrange
      mockApiClient.getCategories.mockResolvedValue([]);
      
      // Act
      const result = await repository.findAll(organizationId);
      
      // Assert
      expect(mockApiClient.getCategories).toHaveBeenCalledWith(organizationId);
      expect(result).toEqual([]);
    });
    
    it('should propagate ApiError', async () => {
      // Arrange
      const apiError = new ApiError('Unauthorized', 401);
      mockApiClient.getCategories.mockRejectedValue(apiError);
      
      // Spy on console.error
      const consoleErrorSpy = jest.spyOn(console, 'error');
      
      // Act & Assert
      await expect(repository.findAll(organizationId)).rejects.toThrow(apiError);
      
      // Check that error was logged
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching categories:', apiError);
      
      // Restore console.error
      consoleErrorSpy.mockRestore();
    });
    
    it('should wrap generic errors', async () => {
      // Arrange
      const networkError = new Error('Network error');
      mockApiClient.getCategories.mockRejectedValue(networkError);
      
      // Spy on console.error
      const consoleErrorSpy = jest.spyOn(console, 'error');
      
      // Act & Assert
      await expect(repository.findAll(organizationId)).rejects.toThrow('Failed to fetch categories');
      
      // Check that error was logged
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching categories:', networkError);
      
      // Restore console.error
      consoleErrorSpy.mockRestore();
    });
  });
}); 