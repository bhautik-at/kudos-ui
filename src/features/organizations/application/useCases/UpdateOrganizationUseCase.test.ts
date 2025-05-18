import { Organization } from '../../domain/entities/Organization';
import { OrganizationRepository } from '../../domain/interfaces/OrganizationRepository';
import { OrganizationMapper } from '../mappers/OrganizationMapper';
import { UpdateOrganizationInputDto, UpdateOrganizationUseCase } from './UpdateOrganizationUseCase';

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

describe('UpdateOrganizationUseCase', () => {
  let useCase: UpdateOrganizationUseCase;
  const mockMapper = OrganizationMapper as jest.Mocked<typeof OrganizationMapper>;
  
  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new UpdateOrganizationUseCase(mockOrganizationRepository);
  });
  
  it('should update an organization successfully', async () => {
    // Arrange
    const organizationId = 'org-123';
    const updateData: UpdateOrganizationInputDto = {
      id: organizationId,
      name: 'Updated Organization',
      description: 'This is an updated organization description',
    };
    
    const updatedEntity = new Organization({
      id: organizationId,
      name: 'Updated Organization',
      description: 'This is an updated organization description',
      createdAt: new Date('2023-01-01T00:00:00.000Z'),
      updatedAt: new Date('2023-01-02T00:00:00.000Z'),
    });
    
    const expectedOutputDto = {
      id: organizationId,
      name: 'Updated Organization',
      description: 'This is an updated organization description',
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-02T00:00:00.000Z',
    };
    
    mockOrganizationRepository.findById.mockResolvedValue(
      new Organization({
        id: organizationId,
        name: 'Original Organization',
        description: 'This is the original description',
        createdAt: new Date('2023-01-01T00:00:00.000Z'),
        updatedAt: new Date('2023-01-01T00:00:00.000Z'),
      })
    );
    mockOrganizationRepository.update.mockResolvedValue(updatedEntity);
    mockMapper.toDto.mockReturnValue(expectedOutputDto);
    
    // Act
    const result = await useCase.execute(updateData);
    
    // Assert
    expect(mockOrganizationRepository.findById).toHaveBeenCalledWith(organizationId);
    expect(mockOrganizationRepository.update).toHaveBeenCalledWith(organizationId, {
      name: updateData.name,
      description: updateData.description,
    });
    expect(mockMapper.toDto).toHaveBeenCalledWith(updatedEntity);
    expect(result).toEqual(expectedOutputDto);
  });
  
  it('should throw error when organization is not found', async () => {
    // Arrange
    const organizationId = 'non-existent-id';
    const updateData: UpdateOrganizationInputDto = { 
      id: organizationId,
      name: 'Updated Organization' 
    };
    
    mockOrganizationRepository.findById.mockResolvedValue(null);
    
    // Act & Assert
    await expect(useCase.execute(updateData)).rejects.toThrow(
      `Organization with ID ${organizationId} not found`
    );
    expect(mockOrganizationRepository.findById).toHaveBeenCalledWith(organizationId);
    expect(mockOrganizationRepository.update).not.toHaveBeenCalled();
    expect(mockMapper.toDto).not.toHaveBeenCalled();
  });
  
  it('should handle repository errors during findById', async () => {
    // Arrange
    const organizationId = 'org-123';
    const updateData: UpdateOrganizationInputDto = { 
      id: organizationId,
      name: 'Updated Organization' 
    };
    
    mockOrganizationRepository.findById.mockRejectedValue(new Error('Database error'));
    
    // Act & Assert
    await expect(useCase.execute(updateData)).rejects.toThrow('Database error');
    expect(mockOrganizationRepository.findById).toHaveBeenCalledWith(organizationId);
    expect(mockOrganizationRepository.update).not.toHaveBeenCalled();
    expect(mockMapper.toDto).not.toHaveBeenCalled();
  });
  
  it('should handle repository errors during update', async () => {
    // Arrange
    const organizationId = 'org-123';
    const updateData: UpdateOrganizationInputDto = { 
      id: organizationId,
      name: 'Updated Organization' 
    };
    
    mockOrganizationRepository.findById.mockResolvedValue(
      new Organization({
        id: organizationId,
        name: 'Original Organization',
        description: 'Original description',
      })
    );
    mockOrganizationRepository.update.mockRejectedValue(new Error('Update failed'));
    
    // Act & Assert
    await expect(useCase.execute(updateData)).rejects.toThrow('Update failed');
    expect(mockOrganizationRepository.findById).toHaveBeenCalledWith(organizationId);
    expect(mockOrganizationRepository.update).toHaveBeenCalledWith(organizationId, {
      name: updateData.name,
      description: updateData.description,
    });
    expect(mockMapper.toDto).not.toHaveBeenCalled();
  });
  
  it('should throw error when organization ID is missing', async () => {
    // Arrange
    const updateData = { 
      name: 'Updated Organization' 
    } as UpdateOrganizationInputDto;
    
    // Act & Assert
    await expect(useCase.execute(updateData)).rejects.toThrow('Organization ID is required');
    expect(mockOrganizationRepository.findById).not.toHaveBeenCalled();
    expect(mockOrganizationRepository.update).not.toHaveBeenCalled();
    expect(mockMapper.toDto).not.toHaveBeenCalled();
  });
}); 