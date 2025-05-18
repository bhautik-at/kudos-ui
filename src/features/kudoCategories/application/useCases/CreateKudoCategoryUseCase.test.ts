import { CreateKudoCategoryUseCase } from './CreateKudoCategoryUseCase';
import { KudoCategoryRepository, KudoCategoryValidator } from '../../domain/interfaces';
import { KudoCategory } from '../../domain/entities/KudoCategory';
import { CreateKudoCategoryInputDto } from '../dtos/CreateKudoCategoryInputDto';
import { DuplicateKudoCategoryError } from '../../domain/errors';

describe('CreateKudoCategoryUseCase', () => {
  let createKudoCategoryUseCase: CreateKudoCategoryUseCase;
  let mockKudoCategoryRepository: jest.Mocked<KudoCategoryRepository>;
  let mockKudoCategoryValidator: jest.Mocked<KudoCategoryValidator>;
  let testDto: CreateKudoCategoryInputDto;
  let testCategory: KudoCategory;

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
    createKudoCategoryUseCase = new CreateKudoCategoryUseCase(
      mockKudoCategoryRepository,
      mockKudoCategoryValidator
    );

    // Set up test data
    testDto = {
      name: 'Innovation',
      organizationId: 'org-123',
    };

    testCategory = new KudoCategory({
      id: 'cat-123',
      name: testDto.name,
      organizationId: testDto.organizationId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });

  it('should successfully create a kudo category when name is unique', async () => {
    // Arrange
    mockKudoCategoryValidator.isCategoryNameUnique.mockResolvedValue(true);
    mockKudoCategoryRepository.create.mockResolvedValue(testCategory);

    // Act
    const result = await createKudoCategoryUseCase.execute(testDto);

    // Assert
    expect(mockKudoCategoryValidator.isCategoryNameUnique).toHaveBeenCalledWith(
      testDto.name,
      testDto.organizationId
    );
    expect(mockKudoCategoryRepository.create).toHaveBeenCalled();
    expect(result).toEqual({
      id: testCategory.id,
      name: testCategory.name,
      organizationId: testCategory.organizationId,
      createdAt: testCategory.createdAt.toISOString(),
      updatedAt: testCategory.updatedAt.toISOString(),
    });
  });

  it('should throw DuplicateKudoCategoryError when category name is not unique', async () => {
    // Arrange
    mockKudoCategoryValidator.isCategoryNameUnique.mockResolvedValue(false);

    // Act & Assert
    await expect(createKudoCategoryUseCase.execute(testDto)).rejects.toThrow(
      DuplicateKudoCategoryError
    );
    expect(mockKudoCategoryValidator.isCategoryNameUnique).toHaveBeenCalledWith(
      testDto.name,
      testDto.organizationId
    );
    expect(mockKudoCategoryRepository.create).not.toHaveBeenCalled();
  });

  it('should propagate repository errors', async () => {
    // Arrange
    const testError = new Error('Database connection error');
    mockKudoCategoryValidator.isCategoryNameUnique.mockResolvedValue(true);
    mockKudoCategoryRepository.create.mockRejectedValue(testError);

    // Act & Assert
    await expect(createKudoCategoryUseCase.execute(testDto)).rejects.toThrow(testError);
    expect(mockKudoCategoryValidator.isCategoryNameUnique).toHaveBeenCalled();
    expect(mockKudoCategoryRepository.create).toHaveBeenCalled();
  });
}); 