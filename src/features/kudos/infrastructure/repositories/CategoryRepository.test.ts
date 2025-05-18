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
    it('should successfully find a category by id', async () => {
      // Arrange
      const categoryId = 'cat-123';
      const organizationId = 'org-123';
      
      const apiResponse = {
        id: 'cat-123',
        name: 'Teamwork',
        description: 'Recognizing great collaboration',
        organization_id: 'org-123',
      };
      
      mockApiClient.getCategoryById.mockResolvedValue(apiResponse);
      
      // Act
      const result = await repository.findById(categoryId, organizationId);
      
      // Assert
      expect(mockApiClient.getCategoryById).toHaveBeenCalledWith(categoryId, organizationId);
      expect(result).toEqual({
        id: 'cat-123',
        name: 'Teamwork',
        description: 'Recognizing great collaboration',
        organizationId: 'org-123',
      });
    });
    
    it('should return null when category is not found', async () => {
      // Arrange
      const categoryId = 'non-existent-category';
      const organizationId = 'org-123';
      
      mockApiClient.getCategoryById.mockResolvedValue(null);
      
      // Act
      const result = await repository.findById(categoryId, organizationId);
      
      // Assert
      expect(result).toBeNull();
    });
    
    it('should propagate ApiError', async () => {
      // Arrange
      const categoryId = 'cat-123';
      const organizationId = 'org-123';
      
      const apiError = new ApiError('Unauthorized', 401);
      mockApiClient.getCategoryById.mockRejectedValue(apiError);
      
      // Act & Assert
      await expect(repository.findById(categoryId, organizationId)).rejects.toThrow(apiError);
    });
    
    it('should wrap generic errors', async () => {
      // Arrange
      const categoryId = 'cat-123';
      const organizationId = 'org-123';
      
      mockApiClient.getCategoryById.mockRejectedValue(new Error('Network error'));
      
      // Act & Assert
      await expect(repository.findById(categoryId, organizationId)).rejects.toThrow('Failed to fetch category');
    });
  });
  
  describe('findAll', () => {
    it('should successfully find all categories for an organization', async () => {
      // Arrange
      const organizationId = 'org-123';
      
      const apiResponse = [
        {
          id: 'cat-123',
          name: 'Teamwork',
          description: 'Recognizing great collaboration',
          organization_id: 'org-123',
        },
        {
          id: 'cat-456',
          name: 'Innovation',
          description: 'New ideas and approaches',
          organization_id: 'org-123',
        },
      ];
      
      mockApiClient.getCategories.mockResolvedValue(apiResponse);
      
      // Act
      const result = await repository.findAll(organizationId);
      
      // Assert
      expect(mockApiClient.getCategories).toHaveBeenCalledWith(organizationId);
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: 'cat-123',
        name: 'Teamwork',
        description: 'Recognizing great collaboration',
        organizationId: 'org-123',
      });
      expect(result[1]).toEqual({
        id: 'cat-456',
        name: 'Innovation',
        description: 'New ideas and approaches',
        organizationId: 'org-123',
      });
    });
    
    it('should return empty array when no categories exist', async () => {
      // Arrange
      const organizationId = 'org-123';
      
      mockApiClient.getCategories.mockResolvedValue([]);
      
      // Act
      const result = await repository.findAll(organizationId);
      
      // Assert
      expect(result).toEqual([]);
    });
    
    it('should propagate ApiError', async () => {
      // Arrange
      const organizationId = 'org-123';
      
      const apiError = new ApiError('Unauthorized', 401);
      mockApiClient.getCategories.mockRejectedValue(apiError);
      
      // Act & Assert
      await expect(repository.findAll(organizationId)).rejects.toThrow(apiError);
    });
    
    it('should wrap generic errors', async () => {
      // Arrange
      const organizationId = 'org-123';
      
      mockApiClient.getCategories.mockRejectedValue(new Error('Network error'));
      
      // Act & Assert
      await expect(repository.findAll(organizationId)).rejects.toThrow('Failed to fetch categories');
    });
  });
}); 