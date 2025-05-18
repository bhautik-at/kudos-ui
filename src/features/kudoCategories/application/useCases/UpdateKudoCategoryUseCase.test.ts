import { UpdateKudoCategoryUseCase } from './UpdateKudoCategoryUseCase';
import { KudoCategoryRepository, KudoCategoryValidator } from '../../domain/interfaces';
import { KudoCategory } from '../../domain/entities/KudoCategory';
import { UpdateKudoCategoryInputDto } from '../dtos/UpdateKudoCategoryInputDto';
import { DuplicateKudoCategoryError, KudoCategoryNotFoundError } from '../../domain/errors';

describe('UpdateKudoCategoryUseCase', () => {
  let updateKudoCategoryUseCase: UpdateKudoCategoryUseCase;
  let mockKudoCategoryRepository: jest.Mocked<KudoCategoryRepository>;
  let mockKudoCategoryValidator: jest.Mocked<KudoCategoryValidator>;
  const categoryId = 'cat-123';
  const organizationId = 'org-123';
  let testDto: UpdateKudoCategoryInputDto;
  let existingCategory: KudoCategory;
  let updatedCategory: KudoCategory;

  beforeEach(() => {
    // Create mock implementations
    mockKudoCategoryRepository = {
      create: jest.fn(),
      findAllByOrganizationId: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    mockKudoCategoryValidator = {
      isCategoryNameUnique: jest.fn(),
    };

    // Create the use case with mocked dependencies
    updateKudoCategoryUseCase = new UpdateKudoCategoryUseCase(
      mockKudoCategoryRepository,
      mockKudoCategoryValidator
    );

    // Set up test data
    testDto = {
      name: 'Updated Innovation',
    };

    const now = new Date();
    const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);

    existingCategory = new KudoCategory({
      id: categoryId,
      name: 'Innovation',
      organizationId,
      createdAt: tenMinutesAgo,
      updatedAt: tenMinutesAgo,
    });

    updatedCategory = new KudoCategory({
      id: categoryId,
      name: testDto.name,
      organizationId,
      createdAt: tenMinutesAgo,
      updatedAt: now,
    });
  });

  it('should successfully update a kudo category when it exists and name is unique', async () => {
    // Arrange
    mockKudoCategoryRepository.findById.mockResolvedValue(existingCategory);
    mockKudoCategoryValidator.isCategoryNameUnique.mockResolvedValue(true);
    mockKudoCategoryRepository.update.mockResolvedValue(updatedCategory);

    // Act
    const result = await updateKudoCategoryUseCase.execute(categoryId, organizationId, testDto);

    // Assert
    expect(mockKudoCategoryRepository.findById).toHaveBeenCalledWith(categoryId, organizationId);
    expect(mockKudoCategoryValidator.isCategoryNameUnique).toHaveBeenCalledWith(
      testDto.name,
      organizationId,
      categoryId
    );
    expect(mockKudoCategoryRepository.update).toHaveBeenCalledWith(
      categoryId,
      organizationId,
      expect.any(KudoCategory)
    );
    expect(result).toEqual({
      id: updatedCategory.id,
      name: updatedCategory.name,
      organizationId: updatedCategory.organizationId,
      createdAt: updatedCategory.createdAt.toISOString(),
      updatedAt: updatedCategory.updatedAt.toISOString(),
    });
  });

  it('should throw KudoCategoryNotFoundError when category does not exist', async () => {
    // Arrange
    mockKudoCategoryRepository.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(
      updateKudoCategoryUseCase.execute(categoryId, organizationId, testDto)
    ).rejects.toThrow(KudoCategoryNotFoundError);
    expect(mockKudoCategoryRepository.findById).toHaveBeenCalledWith(categoryId, organizationId);
    expect(mockKudoCategoryValidator.isCategoryNameUnique).not.toHaveBeenCalled();
    expect(mockKudoCategoryRepository.update).not.toHaveBeenCalled();
  });

  it('should throw DuplicateKudoCategoryError when category name is not unique', async () => {
    // Arrange
    mockKudoCategoryRepository.findById.mockResolvedValue(existingCategory);
    mockKudoCategoryValidator.isCategoryNameUnique.mockResolvedValue(false);

    // Act & Assert
    await expect(
      updateKudoCategoryUseCase.execute(categoryId, organizationId, testDto)
    ).rejects.toThrow(DuplicateKudoCategoryError);
    expect(mockKudoCategoryRepository.findById).toHaveBeenCalledWith(categoryId, organizationId);
    expect(mockKudoCategoryValidator.isCategoryNameUnique).toHaveBeenCalledWith(
      testDto.name,
      organizationId,
      categoryId
    );
    expect(mockKudoCategoryRepository.update).not.toHaveBeenCalled();
  });

  it('should propagate repository errors from findById', async () => {
    // Arrange
    const testError = new Error('Database connection error');
    mockKudoCategoryRepository.findById.mockRejectedValue(testError);

    // Act & Assert
    await expect(
      updateKudoCategoryUseCase.execute(categoryId, organizationId, testDto)
    ).rejects.toThrow(testError);
    expect(mockKudoCategoryRepository.findById).toHaveBeenCalledWith(categoryId, organizationId);
  });

  it('should propagate repository errors from update', async () => {
    // Arrange
    const testError = new Error('Database connection error');
    mockKudoCategoryRepository.findById.mockResolvedValue(existingCategory);
    mockKudoCategoryValidator.isCategoryNameUnique.mockResolvedValue(true);
    mockKudoCategoryRepository.update.mockRejectedValue(testError);

    // Act & Assert
    await expect(
      updateKudoCategoryUseCase.execute(categoryId, organizationId, testDto)
    ).rejects.toThrow(testError);
    expect(mockKudoCategoryRepository.findById).toHaveBeenCalledWith(categoryId, organizationId);
    expect(mockKudoCategoryValidator.isCategoryNameUnique).toHaveBeenCalled();
    expect(mockKudoCategoryRepository.update).toHaveBeenCalled();
  });
}); 