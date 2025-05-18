import { GetAllKudoCategoriesUseCase } from './GetAllKudoCategoriesUseCase';
import { KudoCategoryRepository } from '../../domain/interfaces';
import { KudoCategory } from '../../domain/entities/KudoCategory';

describe('GetAllKudoCategoriesUseCase', () => {
  let getAllKudoCategoriesUseCase: GetAllKudoCategoriesUseCase;
  let mockKudoCategoryRepository: jest.Mocked<KudoCategoryRepository>;
  const organizationId = 'org-123';

  beforeEach(() => {
    // Create mock implementations
    mockKudoCategoryRepository = {
      create: jest.fn(),
      findAllByOrganizationId: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    // Create the use case with mocked dependencies
    getAllKudoCategoriesUseCase = new GetAllKudoCategoriesUseCase(mockKudoCategoryRepository);
  });

  it('should return all categories for an organization', async () => {
    // Arrange
    const now = new Date();
    const categories = [
      new KudoCategory({
        id: 'cat-1',
        name: 'Innovation',
        organizationId,
        createdAt: now,
        updatedAt: now,
      }),
      new KudoCategory({
        id: 'cat-2',
        name: 'Teamwork',
        organizationId,
        createdAt: now,
        updatedAt: now,
      }),
    ];

    mockKudoCategoryRepository.findAllByOrganizationId.mockResolvedValue(categories);

    // Act
    const result = await getAllKudoCategoriesUseCase.execute(organizationId);

    // Assert
    expect(mockKudoCategoryRepository.findAllByOrganizationId).toHaveBeenCalledWith(organizationId);
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('cat-1');
    expect(result[0].name).toBe('Innovation');
    expect(result[0].organizationId).toBe(organizationId);
    expect(result[0].createdAt).toBe(now.toISOString());
    expect(result[0].updatedAt).toBe(now.toISOString());
    expect(result[1].id).toBe('cat-2');
    expect(result[1].name).toBe('Teamwork');
  });

  it('should return an empty array when no categories found', async () => {
    // Arrange
    mockKudoCategoryRepository.findAllByOrganizationId.mockResolvedValue([]);

    // Act
    const result = await getAllKudoCategoriesUseCase.execute(organizationId);

    // Assert
    expect(mockKudoCategoryRepository.findAllByOrganizationId).toHaveBeenCalledWith(organizationId);
    expect(result).toEqual([]);
  });

  it('should propagate repository errors', async () => {
    // Arrange
    const testError = new Error('Database connection error');
    mockKudoCategoryRepository.findAllByOrganizationId.mockRejectedValue(testError);

    // Act & Assert
    await expect(getAllKudoCategoriesUseCase.execute(organizationId)).rejects.toThrow(testError);
    expect(mockKudoCategoryRepository.findAllByOrganizationId).toHaveBeenCalledWith(organizationId);
  });
}); 