import { Organization } from '../../domain/entities/Organization';
import { OrganizationRepository } from '../../domain/interfaces/OrganizationRepository';
import { CreateOrganizationInputDto } from '../dtos/CreateOrganizationInputDto';
import { OrganizationMapper } from '../mappers/OrganizationMapper';
import { CreateOrganizationUseCase } from './CreateOrganizationUseCase';

// Mock the repository
const mockOrganizationRepository: jest.Mocked<OrganizationRepository> = {
  create: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

// Mock the mapper
jest.mock('../mappers/OrganizationMapper', () => ({
  OrganizationMapper: {
    toEntity: jest.fn(),
    toDto: jest.fn(),
  },
}));

describe('CreateOrganizationUseCase', () => {
  let useCase: CreateOrganizationUseCase;
  const mockMapper = OrganizationMapper as jest.Mocked<typeof OrganizationMapper>;
  
  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new CreateOrganizationUseCase(mockOrganizationRepository);
  });
  
  it('should create an organization successfully', async () => {
    // Arrange
    const inputDto: CreateOrganizationInputDto = {
      name: 'Test Organization',
      description: 'This is a test organization',
    };
    
    const mockEntity = new Organization({
      name: 'Test Organization',
      description: 'This is a test organization',
    });
    
    const savedEntity = new Organization({
      id: 'org-123',
      name: 'Test Organization',
      description: 'This is a test organization',
      createdAt: new Date('2023-01-01T00:00:00.000Z'),
      updatedAt: new Date('2023-01-01T00:00:00.000Z'),
    });
    
    const expectedOutputDto = {
      id: 'org-123',
      name: 'Test Organization',
      description: 'This is a test organization',
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
    };
    
    mockMapper.toEntity.mockReturnValue(mockEntity);
    mockOrganizationRepository.create.mockResolvedValue(savedEntity);
    mockMapper.toDto.mockReturnValue(expectedOutputDto);
    
    // Act
    const result = await useCase.execute(inputDto);
    
    // Assert
    expect(mockMapper.toEntity).toHaveBeenCalledWith(inputDto);
    expect(mockOrganizationRepository.create).toHaveBeenCalledWith(mockEntity);
    expect(mockMapper.toDto).toHaveBeenCalledWith(savedEntity);
    expect(result).toEqual(expectedOutputDto);
  });
  
  it('should handle repository errors', async () => {
    // Arrange
    const inputDto: CreateOrganizationInputDto = {
      name: 'Test Organization',
    };
    
    const mockEntity = new Organization({
      name: 'Test Organization',
    });
    
    mockMapper.toEntity.mockReturnValue(mockEntity);
    mockOrganizationRepository.create.mockRejectedValue(new Error('Database error'));
    
    // Act & Assert
    await expect(useCase.execute(inputDto)).rejects.toThrow('Database error');
    expect(mockMapper.toEntity).toHaveBeenCalledWith(inputDto);
    expect(mockOrganizationRepository.create).toHaveBeenCalledWith(mockEntity);
  });
}); 