import { KudoCategoryValidator } from './KudoCategoryValidator';
import { KudoCategoryApiClient } from '../api/KudoCategoryApiClient';

// Mock the API client
jest.mock('../api/KudoCategoryApiClient');

describe('KudoCategoryValidator', () => {
  let validator: KudoCategoryValidator;
  let mockApiClient: jest.Mocked<KudoCategoryApiClient>;
  const organizationId = 'org-123';

  beforeEach(() => {
    mockApiClient = new KudoCategoryApiClient(null!) as jest.Mocked<KudoCategoryApiClient>;
    validator = new KudoCategoryValidator(mockApiClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('isCategoryNameUnique', () => {
    it('should return true when no category with the same name exists', async () => {
      // Arrange
      const categoryName = 'Unique Category';
      
      mockApiClient.getAllKudoCategories.mockResolvedValue({
        success: true,
        categories: [
          {
            id: 'cat-1',
            name: 'Different Category 1',
            organizationId,
            createdAt: '2023-01-01T00:00:00.000Z',
            updatedAt: '2023-01-01T00:00:00.000Z',
          },
          {
            id: 'cat-2',
            name: 'Different Category 2',
            organizationId,
            createdAt: '2023-01-01T00:00:00.000Z',
            updatedAt: '2023-01-01T00:00:00.000Z',
          },
        ],
      });

      // Act
      const isUnique = await validator.isCategoryNameUnique(categoryName, organizationId);

      // Assert
      expect(isUnique).toBe(true);
      expect(mockApiClient.getAllKudoCategories).toHaveBeenCalledWith(organizationId);
    });

    it('should return false when a category with the same name exists', async () => {
      // Arrange
      const categoryName = 'Innovation';
      
      mockApiClient.getAllKudoCategories.mockResolvedValue({
        success: true,
        categories: [
          {
            id: 'cat-1',
            name: 'Different Category',
            organizationId,
            createdAt: '2023-01-01T00:00:00.000Z',
            updatedAt: '2023-01-01T00:00:00.000Z',
          },
          {
            id: 'cat-2',
            name: 'Innovation', // Same name as we're checking
            organizationId,
            createdAt: '2023-01-01T00:00:00.000Z',
            updatedAt: '2023-01-01T00:00:00.000Z',
          },
        ],
      });

      // Act
      const isUnique = await validator.isCategoryNameUnique(categoryName, organizationId);

      // Assert
      expect(isUnique).toBe(false);
    });

    it('should check case-insensitively', async () => {
      // Arrange
      const categoryName = 'innovation'; // lowercase
      
      mockApiClient.getAllKudoCategories.mockResolvedValue({
        success: true,
        categories: [
          {
            id: 'cat-1',
            name: 'Innovation', // Uppercase
            organizationId,
            createdAt: '2023-01-01T00:00:00.000Z',
            updatedAt: '2023-01-01T00:00:00.000Z',
          },
        ],
      });

      // Act
      const isUnique = await validator.isCategoryNameUnique(categoryName, organizationId);

      // Assert
      expect(isUnique).toBe(false);
    });

    it('should exclude the specified category ID when checking for uniqueness', async () => {
      // Arrange
      const categoryName = 'Innovation';
      const excludeCategoryId = 'cat-2'; // ID of the category being updated
      
      mockApiClient.getAllKudoCategories.mockResolvedValue({
        success: true,
        categories: [
          {
            id: 'cat-1',
            name: 'Different Category',
            organizationId,
            createdAt: '2023-01-01T00:00:00.000Z',
            updatedAt: '2023-01-01T00:00:00.000Z',
          },
          {
            id: 'cat-2',
            name: 'Innovation', // Same name, but has the ID we're excluding
            organizationId,
            createdAt: '2023-01-01T00:00:00.000Z',
            updatedAt: '2023-01-01T00:00:00.000Z',
          },
        ],
      });

      // Act
      const isUnique = await validator.isCategoryNameUnique(categoryName, organizationId, excludeCategoryId);

      // Assert
      expect(isUnique).toBe(true);
    });

    it('should return false when API call fails', async () => {
      // Arrange
      const categoryName = 'Innovation';
      
      mockApiClient.getAllKudoCategories.mockRejectedValue(new Error('API error'));

      // Act
      const isUnique = await validator.isCategoryNameUnique(categoryName, organizationId);

      // Assert
      expect(isUnique).toBe(false);
    });
  });
}); 