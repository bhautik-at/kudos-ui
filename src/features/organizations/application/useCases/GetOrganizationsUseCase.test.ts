import { Organization } from '../../domain/entities/Organization';
import { OrganizationRepository } from '../../domain/interfaces/OrganizationRepository';
import { OrganizationMapper } from '../mappers/OrganizationMapper';
import { GetOrganizationsUseCase } from './GetOrganizationsUseCase';

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
    toDtoList: jest.fn(),
  },
}));

describe('GetOrganizationsUseCase', () => {
  let useCase: GetOrganizationsUseCase;
  const mockMapper = OrganizationMapper as jest.Mocked<typeof OrganizationMapper>;
  
  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new GetOrganizationsUseCase(mockOrganizationRepository);
  });
  
  it('should get all organizations successfully', async () => {
    // Arrange
    const organizations = [
      new Organization({
        id: 'org-123',
        name: 'Test Organization 1',
        description: 'This is test organization 1',
        createdAt: new Date('2023-01-01T00:00:00.000Z'),
        updatedAt: new Date('2023-01-01T00:00:00.000Z'),
      }),
      new Organization({
        id: 'org-456',
        name: 'Test Organization 2',
        description: 'This is test organization 2',
        createdAt: new Date('2023-01-02T00:00:00.000Z'),
        updatedAt: new Date('2023-01-02T00:00:00.000Z'),
      }),
    ];
    
    const expectedOutputDtos = [
      {
        id: 'org-123',
        name: 'Test Organization 1',
        description: 'This is test organization 1',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      },
      {
        id: 'org-456',
        name: 'Test Organization 2',
        description: 'This is test organization 2',
        createdAt: '2023-01-02T00:00:00.000Z',
        updatedAt: '2023-01-02T00:00:00.000Z',
      },
    ];
    
    mockOrganizationRepository.findAll.mockResolvedValue(organizations);
    mockMapper.toDtoList.mockReturnValue(expectedOutputDtos);
    
    // Act
    const result = await useCase.execute();
    
    // Assert
    expect(mockOrganizationRepository.findAll).toHaveBeenCalled();
    expect(mockMapper.toDtoList).toHaveBeenCalledWith(organizations);
    expect(result).toEqual(expectedOutputDtos);
  });
  
  it('should return empty list when no organizations exist', async () => {
    // Arrange
    const organizations: Organization[] = [];
    const expectedOutputDtos: any[] = [];
    
    mockOrganizationRepository.findAll.mockResolvedValue(organizations);
    mockMapper.toDtoList.mockReturnValue(expectedOutputDtos);
    
    // Act
    const result = await useCase.execute();
    
    // Assert
    expect(mockOrganizationRepository.findAll).toHaveBeenCalled();
    expect(mockMapper.toDtoList).toHaveBeenCalledWith(organizations);
    expect(result).toEqual(expectedOutputDtos);
  });
  
  it('should handle repository errors', async () => {
    // Arrange
    mockOrganizationRepository.findAll.mockRejectedValue(new Error('Database error'));
    
    // Act & Assert
    await expect(useCase.execute()).rejects.toThrow('Database error');
    expect(mockOrganizationRepository.findAll).toHaveBeenCalled();
    expect(mockMapper.toDtoList).not.toHaveBeenCalled();
  });
}); 