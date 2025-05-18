import { Organization } from '../../domain/entities/Organization';
import { OrganizationRepository } from '../../domain/interfaces/OrganizationRepository';
import { DeleteOrganizationUseCase } from './DeleteOrganizationUseCase';

// Mock the repository
const mockOrganizationRepository: jest.Mocked<OrganizationRepository> = {
  create: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('DeleteOrganizationUseCase', () => {
  let useCase: DeleteOrganizationUseCase;
  
  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new DeleteOrganizationUseCase(mockOrganizationRepository);
  });
  
  it('should delete an organization successfully', async () => {
    // Arrange
    const organizationId = 'org-123';
    
    mockOrganizationRepository.findById.mockResolvedValue(
      new Organization({
        id: organizationId,
        name: 'Test Organization',
        description: 'This is a test organization',
      })
    );
    mockOrganizationRepository.delete.mockResolvedValue();
    
    // Act
    await useCase.execute(organizationId);
    
    // Assert
    expect(mockOrganizationRepository.findById).toHaveBeenCalledWith(organizationId);
    expect(mockOrganizationRepository.delete).toHaveBeenCalledWith(organizationId);
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
    expect(mockOrganizationRepository.delete).not.toHaveBeenCalled();
  });
  
  it('should handle repository errors during findById', async () => {
    // Arrange
    const organizationId = 'org-123';
    
    mockOrganizationRepository.findById.mockRejectedValue(new Error('Database error'));
    
    // Act & Assert
    await expect(useCase.execute(organizationId)).rejects.toThrow('Database error');
    expect(mockOrganizationRepository.findById).toHaveBeenCalledWith(organizationId);
    expect(mockOrganizationRepository.delete).not.toHaveBeenCalled();
  });
  
  it('should handle repository errors during delete', async () => {
    // Arrange
    const organizationId = 'org-123';
    
    mockOrganizationRepository.findById.mockResolvedValue(
      new Organization({
        id: organizationId,
        name: 'Test Organization',
        description: 'This is a test organization',
      })
    );
    mockOrganizationRepository.delete.mockRejectedValue(new Error('Delete failed'));
    
    // Act & Assert
    await expect(useCase.execute(organizationId)).rejects.toThrow('Delete failed');
    expect(mockOrganizationRepository.findById).toHaveBeenCalledWith(organizationId);
    expect(mockOrganizationRepository.delete).toHaveBeenCalledWith(organizationId);
  });
}); 