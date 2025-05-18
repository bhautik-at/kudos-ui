import { DeleteKudoCategoryUseCase } from './DeleteKudoCategoryUseCase';
import { KudoCategoryRepository } from '../../domain/interfaces';
import { KudoCategory } from '../../domain/entities/KudoCategory';
import { KudoCategoryNotFoundError } from '../../domain/errors';

describe('DeleteKudoCategoryUseCase', () => {
  let deleteKudoCategoryUseCase: DeleteKudoCategoryUseCase;
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
    deleteKudoCategoryUseCase = new DeleteKudoCategoryUseCase(mockKudoCategoryRepository);
  });

  it('should successfully delete a category when it exists', async () => {
    // Arrange
    const existingCategory = new KudoCategory({
      id: categoryId,
      name: 'Innovation',
      organizationId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    mockKudoCategoryRepository.findById.mockResolvedValue(existingCategory);
    mockKudoCategoryRepository.delete.mockResolvedValue();

    // Act
    await deleteKudoCategoryUseCase.execute(categoryId, organizationId);

    // Assert
    expect(mockKudoCategoryRepository.findById).toHaveBeenCalledWith(categoryId, organizationId);
    expect(mockKudoCategoryRepository.delete).toHaveBeenCalledWith(categoryId, organizationId);
  });

  it('should throw KudoCategoryNotFoundError when category does not exist', async () => {
    // Arrange
    mockKudoCategoryRepository.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(deleteKudoCategoryUseCase.execute(categoryId, organizationId)).rejects.toThrow(
      KudoCategoryNotFoundError
    );
    expect(mockKudoCategoryRepository.findById).toHaveBeenCalledWith(categoryId, organizationId);
    expect(mockKudoCategoryRepository.delete).not.toHaveBeenCalled();
  });

  it('should propagate repository errors from findById', async () => {
    // Arrange
    const testError = new Error('Database connection error');
    mockKudoCategoryRepository.findById.mockRejectedValue(testError);

    // Act & Assert
    await expect(deleteKudoCategoryUseCase.execute(categoryId, organizationId)).rejects.toThrow(
      testError
    );
    expect(mockKudoCategoryRepository.findById).toHaveBeenCalledWith(categoryId, organizationId);
    expect(mockKudoCategoryRepository.delete).not.toHaveBeenCalled();
  });

  it('should propagate repository errors from delete', async () => {
    // Arrange
    const testError = new Error('Database connection error');
    const existingCategory = new KudoCategory({
      id: categoryId,
      name: 'Innovation',
      organizationId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    mockKudoCategoryRepository.findById.mockResolvedValue(existingCategory);
    mockKudoCategoryRepository.delete.mockRejectedValue(testError);

    // Act & Assert
    await expect(deleteKudoCategoryUseCase.execute(categoryId, organizationId)).rejects.toThrow(
      testError
    );
    expect(mockKudoCategoryRepository.findById).toHaveBeenCalledWith(categoryId, organizationId);
    expect(mockKudoCategoryRepository.delete).toHaveBeenCalledWith(categoryId, organizationId);
  });
}); 