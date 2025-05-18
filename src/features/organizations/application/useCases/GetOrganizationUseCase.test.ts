import { Organization } from '../../domain/entities/Organization';
import { OrganizationRepository } from '../../domain/interfaces/OrganizationRepository';
import { OrganizationMapper } from '../mappers/OrganizationMapper';
import { GetOrganizationUseCase } from './GetOrganizationUseCase';

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
    toDto: jest.fn(),
  },
}));

describe('GetOrganizationUseCase', () => {
  let useCase: GetOrganizationUseCase;
  const mockMapper = OrganizationMapper as jest.Mocked<typeof OrganizationMapper>;
  
  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new GetOrganizationUseCase(mockOrganizationRepository);
  });
  
  it('should get an organization by ID successfully', async () => {
    // Arrange
    const organizationId = 'org-123';
    
    const foundEntity = new Organization({
      id: organizationId,
      name: 'Test Organization',
      description: 'This is a test organization',
      createdAt: new Date('2023-01-01T00:00:00.000Z'),
      updatedAt: new Date('2023-01-01T00:00:00.000Z'),
    });
    
    const expectedOutputDto = {
      id: organizationId,
      name: 'Test Organization',
      description: 'This is a test organization',
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
    };
    
    mockOrganizationRepository.findById.mockResolvedValue(foundEntity);
    mockMapper.toDto.mockReturnValue(expectedOutputDto);
    
    // Act
    const result = await useCase.execute(organizationId);
    
    // Assert
    expect(mockOrganizationRepository.findById).toHaveBeenCalledWith(organizationId);
    expect(mockMapper.toDto).toHaveBeenCalledWith(foundEntity);
    expect(result).toEqual(expectedOutputDto);
  });
  
  it('should throw error when organization is not found', async () => {
    // Arrange
    const organizationId = 'non-existent-id';
    mockOrganizationRepository.findById.mockResolvedValue(null);
    
    // Act & Assert
    await expect(useCase.execute(organizationId)).rejects.toThrow(
      `Organization with ID ${organizationId} not found`
    );
    expect(mockOrganizationRepository.findById).toHaveBeenCalledWith(organizationId);
    expect(mockMapper.toDto).not.toHaveBeenCalled();
  });
  
  it('should handle repository errors', async () => {
    // Arrange
    const organizationId = 'org-123';
    mockOrganizationRepository.findById.mockRejectedValue(new Error('Database error'));
    
    // Act & Assert
    await expect(useCase.execute(organizationId)).rejects.toThrow('Database error');
    expect(mockOrganizationRepository.findById).toHaveBeenCalledWith(organizationId);
    expect(mockMapper.toDto).not.toHaveBeenCalled();
  });
}); 