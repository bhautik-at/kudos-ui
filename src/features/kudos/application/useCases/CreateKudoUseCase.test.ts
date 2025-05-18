import { CreateKudoUseCase } from './CreateKudoUseCase';
import { KudoRepository } from '../../domain/interfaces/KudoRepository';
import { CategoryRepository } from '../../domain/interfaces/CategoryRepository';
import { CreateKudoInputDto } from '../dtos/CreateKudoInputDto';
import { Kudo } from '../../domain/entities/Kudo';
import { KudoValidationError } from '../../domain/errors/KudoValidationError';

// Mock interfaces
interface UserRepository {
  findById(id: string, organizationId: string): Promise<{ id: string; fullName: string } | null>;
}

interface TeamRepository {
  findById(id: string, organizationId: string): Promise<{ id: string; name: string } | null>;
}

describe('CreateKudoUseCase', () => {
  let createKudoUseCase: CreateKudoUseCase;
  let mockKudoRepository: jest.Mocked<KudoRepository>;
  let mockUserRepository: jest.Mocked<UserRepository>;
  let mockTeamRepository: jest.Mocked<TeamRepository>;
  let mockCategoryRepository: jest.Mocked<CategoryRepository>;

  const mockDate = new Date('2023-01-01T00:00:00.000Z');
  const mockOrganizationId = 'org-123';
  const mockSenderId = 'user-456';

  beforeAll(() => {
    // Mock the Date constructor
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    // Create mock repositories
    mockKudoRepository = {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
    };

    mockUserRepository = {
      findById: jest.fn(),
    };

    mockTeamRepository = {
      findById: jest.fn(),
    };

    mockCategoryRepository = {
      findById: jest.fn(),
      findAll: jest.fn(),
    };

    // Create the use case with mocked dependencies
    createKudoUseCase = new CreateKudoUseCase(
      mockKudoRepository,
      mockUserRepository,
      mockTeamRepository,
      mockCategoryRepository
    );
  });

  it('should successfully create a kudo and return KudoOutputDto', async () => {
    // Arrange
    const inputDto: CreateKudoInputDto = {
      recipientId: 'user-123',
      teamId: 'team-789',
      categoryId: 'cat-101',
      message: 'Great job on the project!',
      organizationId: mockOrganizationId,
    };

    const savedKudo = new Kudo({
      id: 'kudo-999',
      recipientId: inputDto.recipientId,
      senderId: mockSenderId,
      teamId: inputDto.teamId,
      categoryId: inputDto.categoryId,
      message: inputDto.message,
      organizationId: inputDto.organizationId,
      createdAt: mockDate,
    });

    mockKudoRepository.create.mockResolvedValue(savedKudo);

    mockUserRepository.findById.mockImplementation(async (id) => {
      if (id === 'user-123') {
        return { id: 'user-123', fullName: 'John Doe' };
      }
      if (id === 'user-456') {
        return { id: 'user-456', fullName: 'Jane Smith' };
      }
      return null;
    });

    mockTeamRepository.findById.mockResolvedValue({
      id: 'team-789',
      name: 'Engineering',
    });

    mockCategoryRepository.findById.mockResolvedValue({
      id: 'cat-101',
      name: 'Teamwork',
      organizationId: mockOrganizationId,
    });

    // Act
    const result = await createKudoUseCase.execute(inputDto, mockSenderId);

    // Assert
    expect(mockKudoRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        recipientId: inputDto.recipientId,
        senderId: mockSenderId,
        teamId: inputDto.teamId,
        categoryId: inputDto.categoryId,
        message: inputDto.message,
        organizationId: inputDto.organizationId,
      })
    );

    expect(result).toEqual({
      id: 'kudo-999',
      recipientId: 'user-123',
      recipientName: 'John Doe',
      senderId: 'user-456',
      senderName: 'Jane Smith',
      teamId: 'team-789',
      teamName: 'Engineering',
      categoryId: 'cat-101',
      categoryName: 'Teamwork',
      message: 'Great job on the project!',
      organizationId: mockOrganizationId,
      createdAt: mockDate.toISOString(),
      updatedAt: undefined,
    });
  });

  it('should throw KudoValidationError when recipient is not found', async () => {
    // Arrange
    const inputDto: CreateKudoInputDto = {
      recipientId: 'user-999', // Non-existent user
      teamId: 'team-789',
      categoryId: 'cat-101',
      message: 'Great job on the project!',
      organizationId: mockOrganizationId,
    };

    const savedKudo = new Kudo({
      id: 'kudo-999',
      recipientId: inputDto.recipientId,
      senderId: mockSenderId,
      teamId: inputDto.teamId,
      categoryId: inputDto.categoryId,
      message: inputDto.message,
      organizationId: inputDto.organizationId,
    });

    mockKudoRepository.create.mockResolvedValue(savedKudo);
    mockUserRepository.findById.mockImplementation(async (id) => {
      if (id === 'user-456') { // Only the sender exists
        return { id: 'user-456', fullName: 'Jane Smith' };
      }
      return null;
    });
    mockTeamRepository.findById.mockResolvedValue({ id: 'team-789', name: 'Engineering' });
    mockCategoryRepository.findById.mockResolvedValue({
      id: 'cat-101',
      name: 'Teamwork',
      organizationId: mockOrganizationId,
    });

    // Act & Assert
    await expect(createKudoUseCase.execute(inputDto, mockSenderId)).rejects.toThrow(
      new KudoValidationError('Recipient not found')
    );
  });

  it('should throw KudoValidationError when sender is not found', async () => {
    // Arrange
    const inputDto: CreateKudoInputDto = {
      recipientId: 'user-123',
      teamId: 'team-789',
      categoryId: 'cat-101',
      message: 'Great job on the project!',
      organizationId: mockOrganizationId,
    };

    const savedKudo = new Kudo({
      id: 'kudo-999',
      recipientId: inputDto.recipientId,
      senderId: mockSenderId,
      teamId: inputDto.teamId,
      categoryId: inputDto.categoryId,
      message: inputDto.message,
      organizationId: inputDto.organizationId,
    });

    mockKudoRepository.create.mockResolvedValue(savedKudo);
    mockUserRepository.findById.mockImplementation(async (id) => {
      if (id === 'user-123') { // Only the recipient exists
        return { id: 'user-123', fullName: 'John Doe' };
      }
      return null;
    });
    mockTeamRepository.findById.mockResolvedValue({ id: 'team-789', name: 'Engineering' });
    mockCategoryRepository.findById.mockResolvedValue({
      id: 'cat-101',
      name: 'Teamwork',
      organizationId: mockOrganizationId,
    });

    // Act & Assert
    await expect(createKudoUseCase.execute(inputDto, mockSenderId)).rejects.toThrow(
      new KudoValidationError('Sender not found')
    );
  });

  it('should throw KudoValidationError when team is not found', async () => {
    // Arrange
    const inputDto: CreateKudoInputDto = {
      recipientId: 'user-123',
      teamId: 'team-999', // Non-existent team
      categoryId: 'cat-101',
      message: 'Great job on the project!',
      organizationId: mockOrganizationId,
    };

    const savedKudo = new Kudo({
      id: 'kudo-999',
      recipientId: inputDto.recipientId,
      senderId: mockSenderId,
      teamId: inputDto.teamId,
      categoryId: inputDto.categoryId,
      message: inputDto.message,
      organizationId: inputDto.organizationId,
    });

    mockKudoRepository.create.mockResolvedValue(savedKudo);
    mockUserRepository.findById.mockImplementation(async (id) => {
      if (id === 'user-123') {
        return { id: 'user-123', fullName: 'John Doe' };
      }
      if (id === 'user-456') {
        return { id: 'user-456', fullName: 'Jane Smith' };
      }
      return null;
    });
    mockTeamRepository.findById.mockResolvedValue(null); // Team not found
    mockCategoryRepository.findById.mockResolvedValue({
      id: 'cat-101',
      name: 'Teamwork',
      organizationId: mockOrganizationId,
    });

    // Act & Assert
    await expect(createKudoUseCase.execute(inputDto, mockSenderId)).rejects.toThrow(
      new KudoValidationError('Team not found')
    );
  });

  it('should throw KudoValidationError when category is not found', async () => {
    // Arrange
    const inputDto: CreateKudoInputDto = {
      recipientId: 'user-123',
      teamId: 'team-789',
      categoryId: 'cat-999', // Non-existent category
      message: 'Great job on the project!',
      organizationId: mockOrganizationId,
    };

    const savedKudo = new Kudo({
      id: 'kudo-999',
      recipientId: inputDto.recipientId,
      senderId: mockSenderId,
      teamId: inputDto.teamId,
      categoryId: inputDto.categoryId,
      message: inputDto.message,
      organizationId: inputDto.organizationId,
    });

    mockKudoRepository.create.mockResolvedValue(savedKudo);
    mockUserRepository.findById.mockImplementation(async (id) => {
      if (id === 'user-123') {
        return { id: 'user-123', fullName: 'John Doe' };
      }
      if (id === 'user-456') {
        return { id: 'user-456', fullName: 'Jane Smith' };
      }
      return null;
    });
    mockTeamRepository.findById.mockResolvedValue({ id: 'team-789', name: 'Engineering' });
    mockCategoryRepository.findById.mockResolvedValue(null); // Category not found

    // Act & Assert
    await expect(createKudoUseCase.execute(inputDto, mockSenderId)).rejects.toThrow(
      new KudoValidationError('Category not found')
    );
  });

  it('should wrap and rethrow generic errors', async () => {
    // Arrange
    const inputDto: CreateKudoInputDto = {
      recipientId: 'user-123',
      teamId: 'team-789',
      categoryId: 'cat-101',
      message: 'Great job on the project!',
      organizationId: mockOrganizationId,
    };

    // Simulate a database error
    mockKudoRepository.create.mockRejectedValue(new Error('Database connection error'));

    // Act & Assert
    await expect(createKudoUseCase.execute(inputDto, mockSenderId)).rejects.toThrow(
      'Failed to create kudo: Database connection error'
    );
  });
}); 