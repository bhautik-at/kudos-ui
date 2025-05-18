import { GetKudoCategoryByIdUseCase } from './GetKudoCategoryByIdUseCase';
import { KudoCategoryRepository } from '../../domain/interfaces';
import { KudoCategory } from '../../domain/entities/KudoCategory';
import { KudoCategoryNotFoundError } from '../../domain/errors';

describe('GetKudoCategoryByIdUseCase', () => {
  let getKudoCategoryByIdUseCase: GetKudoCategoryByIdUseCase;
  let mockKudoCategoryRepository: jest.Mocked<KudoCategoryRepository>;
  const categoryId = 'cat-123';
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
    getKudoCategoryByIdUseCase = new GetKudoCategoryByIdUseCase(mockKudoCategoryRepository);
  });

  it('should return a category when found by ID', async () => {
    // Arrange
    const now = new Date();
    const category = new KudoCategory({
      id: categoryId,
      name: 'Innovation',
      organizationId,
      createdAt: now,
      updatedAt: now,
    });

    mockKudoCategoryRepository.findById.mockResolvedValue(category);

    // Act
    const result = await getKudoCategoryByIdUseCase.execute(categoryId, organizationId);

    // Assert
    expect(mockKudoCategoryRepository.findById).toHaveBeenCalledWith(categoryId, organizationId);
    expect(result).toEqual({
      id: categoryId,
      name: 'Innovation',
      organizationId,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    });
  });

  it('should throw KudoCategoryNotFoundError when category not found', async () => {
    // Arrange
    mockKudoCategoryRepository.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(getKudoCategoryByIdUseCase.execute(categoryId, organizationId)).rejects.toThrow(
      KudoCategoryNotFoundError
    );
    expect(mockKudoCategoryRepository.findById).toHaveBeenCalledWith(categoryId, organizationId);
  });

  it('should propagate repository errors', async () => {
    // Arrange
    const testError = new Error('Database connection error');
    mockKudoCategoryRepository.findById.mockRejectedValue(testError);

    // Act & Assert
    await expect(getKudoCategoryByIdUseCase.execute(categoryId, organizationId)).rejects.toThrow(
      testError
    );
    expect(mockKudoCategoryRepository.findById).toHaveBeenCalledWith(categoryId, organizationId);
  });
}); 