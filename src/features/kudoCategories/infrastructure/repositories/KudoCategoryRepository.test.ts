import { KudoCategoryRepository } from './KudoCategoryRepository';
import { KudoCategoryApiClient } from '../api/KudoCategoryApiClient';
import { KudoCategory } from '../../domain/entities/KudoCategory';

// Mock the API client
jest.mock('../api/KudoCategoryApiClient');

describe('KudoCategoryRepository', () => {
  let repository: KudoCategoryRepository;
  let mockApiClient: jest.Mocked<KudoCategoryApiClient>;
  const organizationId = 'org-123';
  const categoryId = 'cat-456';

  beforeEach(() => {
    mockApiClient = new KudoCategoryApiClient(null!) as jest.Mocked<KudoCategoryApiClient>;
    repository = new KudoCategoryRepository(mockApiClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a kudo category and return a domain entity', async () => {
      // Arrange
      const createdAt = new Date('2023-01-01T00:00:00.000Z');
      const updatedAt = new Date('2023-01-01T00:00:00.000Z');
      
      const category = new KudoCategory({
        name: 'Test Category',
        organizationId,
        createdAt,
        updatedAt,
      });

      mockApiClient.createKudoCategory.mockResolvedValue({
        success: true,
        category: {
          id: categoryId,
          name: 'Test Category',
          organizationId,
          createdAt: createdAt.toISOString(),
          updatedAt: updatedAt.toISOString(),
        },
      });

      // Act
      const result = await repository.create(category);

      // Assert
      expect(result).toBeInstanceOf(KudoCategory);
      expect(result.id).toBe(categoryId);
      expect(result.name).toBe('Test Category');
      expect(result.organizationId).toBe(organizationId);
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
      expect(mockApiClient.createKudoCategory).toHaveBeenCalledWith(organizationId, {
        name: 'Test Category',
      });
    });
  });

  describe('findAllByOrganizationId', () => {
    it('should return an array of domain entities', async () => {
      // Arrange
      mockApiClient.getAllKudoCategories.mockResolvedValue({
        success: true,
        categories: [
          {
            id: 'cat-1',
            name: 'Category 1',
            organizationId,
            createdAt: '2023-01-01T00:00:00.000Z',
            updatedAt: '2023-01-01T00:00:00.000Z',
          },
          {
            id: 'cat-2',
            name: 'Category 2',
            organizationId,
            createdAt: '2023-01-02T00:00:00.000Z',
            updatedAt: '2023-01-02T00:00:00.000Z',
          },
        ],
      });

      // Act
      const result = await repository.findAllByOrganizationId(organizationId);

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(KudoCategory);
      expect(result[0].id).toBe('cat-1');
      expect(result[0].name).toBe('Category 1');
      expect(result[1]).toBeInstanceOf(KudoCategory);
      expect(result[1].id).toBe('cat-2');
      expect(result[1].name).toBe('Category 2');
      expect(mockApiClient.getAllKudoCategories).toHaveBeenCalledWith(organizationId);
    });

    it('should return an empty array when no categories exist', async () => {
      // Arrange
      mockApiClient.getAllKudoCategories.mockResolvedValue({
        success: true,
        categories: [],
      });

      // Act
      const result = await repository.findAllByOrganizationId(organizationId);

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('findById', () => {
    it('should return a domain entity when category exists', async () => {
      // Arrange
      mockApiClient.getKudoCategoryById.mockResolvedValue({
        success: true,
        category: {
          id: categoryId,
          name: 'Test Category',
          organizationId,
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z',
        },
      });

      // Act
      const result = await repository.findById(categoryId, organizationId);

      // Assert
      expect(result).toBeInstanceOf(KudoCategory);
      expect(result?.id).toBe(categoryId);
      expect(result?.name).toBe('Test Category');
      expect(result?.organizationId).toBe(organizationId);
      expect(mockApiClient.getKudoCategoryById).toHaveBeenCalledWith(organizationId, categoryId);
    });

    it('should return null when category does not exist', async () => {
      // Arrange
      const error = new Error('Not found');
      (error as any).status = 404;
      mockApiClient.getKudoCategoryById.mockRejectedValue(error);

      // Act
      const result = await repository.findById('non-existent-id', organizationId);

      // Assert
      expect(result).toBeNull();
    });

    it('should propagate errors other than 404', async () => {
      // Arrange
      const error = new Error('Server error');
      (error as any).status = 500;
      mockApiClient.getKudoCategoryById.mockRejectedValue(error);

      // Act & Assert
      await expect(repository.findById(categoryId, organizationId)).rejects.toThrow(error);
    });
  });

  describe('update', () => {
    it('should update a kudo category and return the updated domain entity', async () => {
      // Arrange
      const updatedCategory = new KudoCategory({
        id: categoryId,
        name: 'Updated Category',
        organizationId,
      });

      mockApiClient.updateKudoCategory.mockResolvedValue({
        success: true,
        category: {
          id: categoryId,
          name: 'Updated Category',
          organizationId,
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-02T00:00:00.000Z',
        },
      });

      // Act
      const result = await repository.update(categoryId, organizationId, updatedCategory);

      // Assert
      expect(result).toBeInstanceOf(KudoCategory);
      expect(result.id).toBe(categoryId);
      expect(result.name).toBe('Updated Category');
      expect(mockApiClient.updateKudoCategory).toHaveBeenCalledWith(organizationId, categoryId, {
        name: 'Updated Category',
      });
    });
  });

  describe('delete', () => {
    it('should delete a kudo category', async () => {
      // Arrange
      mockApiClient.deleteKudoCategory.mockResolvedValue({
        success: true,
        message: 'Category deleted successfully',
      });

      // Act
      await repository.delete(categoryId, organizationId);

      // Assert
      expect(mockApiClient.deleteKudoCategory).toHaveBeenCalledWith(organizationId, categoryId);
    });

    it('should propagate errors from the API client', async () => {
      // Arrange
      const error = new Error('Failed to delete');
      mockApiClient.deleteKudoCategory.mockRejectedValue(error);

      // Act & Assert
      await expect(repository.delete(categoryId, organizationId)).rejects.toThrow(error);
    });
  });
}); 