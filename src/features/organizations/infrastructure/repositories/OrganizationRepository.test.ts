import { OrganizationRepository } from './OrganizationRepository';
import { OrganizationApiClient } from '../api/OrganizationApiClient';
import { Organization } from '../../domain/entities/Organization';

// Mock the API client
jest.mock('../api/OrganizationApiClient');

describe('OrganizationRepository', () => {
  let repository: OrganizationRepository;
  let mockApiClient: jest.Mocked<OrganizationApiClient>;
  
  const mockDate = new Date('2023-01-01T00:00:00.000Z');
  
  beforeEach(() => {
    // Create a mock API client
    mockApiClient = new OrganizationApiClient() as jest.Mocked<OrganizationApiClient>;
    
    // Create the repository with the mock client
    repository = new OrganizationRepository(mockApiClient);
    
    // Reset all mocks
    jest.resetAllMocks();
  });
  
  describe('create', () => {
    it('should successfully create an organization', async () => {
      // Arrange
      const organizationToCreate = new Organization({
        name: 'Test Organization',
        description: 'This is a test organization',
      });
      
      const apiResponse = {
        id: 'org-123',
        name: 'Test Organization',
        description: 'This is a test organization',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      };
      
      mockApiClient.createOrganization.mockResolvedValue(apiResponse);
      
      // Act
      const result = await repository.create(organizationToCreate);
      
      // Assert
      expect(mockApiClient.createOrganization).toHaveBeenCalledWith({
        name: 'Test Organization',
        description: 'This is a test organization',
      });
      
      expect(result).toBeInstanceOf(Organization);
      expect(result.id).toBe('org-123');
      expect(result.name).toBe('Test Organization');
      expect(result.description).toBe('This is a test organization');
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
      expect(result.createdAt.toISOString()).toBe('2023-01-01T00:00:00.000Z');
    });
    
    it('should propagate API client errors', async () => {
      // Arrange
      const organizationToCreate = new Organization({
        name: 'Test Organization',
      });
      
      const error = new Error('API Client Error');
      mockApiClient.createOrganization.mockRejectedValue(error);
      
      // Act & Assert
      await expect(repository.create(organizationToCreate)).rejects.toThrow(error);
    });
  });
  
  describe('findAll', () => {
    it('should return all organizations', async () => {
      // Arrange
      const apiResponse = [
        {
          id: 'org-123',
          name: 'Organization 1',
          description: 'Description 1',
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z',
        },
        {
          id: 'org-456',
          name: 'Organization 2',
          description: 'Description 2',
          createdAt: '2023-01-02T00:00:00.000Z',
          updatedAt: '2023-01-02T00:00:00.000Z',
        },
      ];
      
      mockApiClient.getOrganizations.mockResolvedValue(apiResponse);
      
      // Act
      const result = await repository.findAll();
      
      // Assert
      expect(mockApiClient.getOrganizations).toHaveBeenCalled();
      expect(result).toHaveLength(2);
      
      // Check that we have Organization instances
      expect(result[0]).toBeInstanceOf(Organization);
      expect(result[1]).toBeInstanceOf(Organization);
      
      // Check data mapping is correct
      expect(result[0].id).toBe('org-123');
      expect(result[0].name).toBe('Organization 1');
      expect(result[0].createdAt.toISOString()).toBe('2023-01-01T00:00:00.000Z');
      
      expect(result[1].id).toBe('org-456');
      expect(result[1].name).toBe('Organization 2');
      expect(result[1].createdAt.toISOString()).toBe('2023-01-02T00:00:00.000Z');
    });
    
    it('should return empty array when no organizations exist', async () => {
      // Arrange
      mockApiClient.getOrganizations.mockResolvedValue([]);
      
      // Act
      const result = await repository.findAll();
      
      // Assert
      expect(result).toEqual([]);
    });
    
    it('should propagate API client errors', async () => {
      // Arrange
      const error = new Error('API Client Error');
      mockApiClient.getOrganizations.mockRejectedValue(error);
      
      // Act & Assert
      await expect(repository.findAll()).rejects.toThrow(error);
    });
  });
  
  describe('findById', () => {
    const orgId = 'org-123';
    
    it('should find an organization by ID', async () => {
      // Arrange
      const apiResponse = {
        id: 'org-123',
        name: 'Test Organization',
        description: 'This is a test organization',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      };
      
      mockApiClient.getOrganization.mockResolvedValue(apiResponse);
      
      // Act
      const result = await repository.findById(orgId);
      
      // Assert
      expect(mockApiClient.getOrganization).toHaveBeenCalledWith(orgId);
      expect(result).toBeInstanceOf(Organization);
      expect(result?.id).toBe('org-123');
      expect(result?.name).toBe('Test Organization');
      expect(result?.description).toBe('This is a test organization');
      expect(result?.createdAt.toISOString()).toBe('2023-01-01T00:00:00.000Z');
    });
    
    it('should return null when organization is not found', async () => {
      // Arrange
      mockApiClient.getOrganization.mockRejectedValue(new Error('Not found'));
      
      // Act
      const result = await repository.findById(orgId);
      
      // Assert
      expect(result).toBeNull();
    });
  });
  
  describe('update', () => {
    const orgId = 'org-123';
    
    it('should update an organization successfully', async () => {
      // Arrange
      const updateData = {
        name: 'Updated Organization',
        description: 'Updated description',
      };
      
      const apiResponse = {
        id: 'org-123',
        name: 'Updated Organization',
        description: 'Updated description',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-02T00:00:00.000Z',
      };
      
      mockApiClient.updateOrganization.mockResolvedValue(apiResponse);
      
      // Act
      const result = await repository.update(orgId, updateData);
      
      // Assert
      expect(mockApiClient.updateOrganization).toHaveBeenCalledWith(orgId, updateData);
      expect(result).toBeInstanceOf(Organization);
      expect(result.id).toBe('org-123');
      expect(result.name).toBe('Updated Organization');
      expect(result.description).toBe('Updated description');
      expect(result.createdAt.toISOString()).toBe('2023-01-01T00:00:00.000Z');
      expect(result.updatedAt.toISOString()).toBe('2023-01-02T00:00:00.000Z');
    });
    
    it('should propagate API client errors', async () => {
      // Arrange
      const updateData = {
        name: 'Updated Organization',
      };
      
      const error = new Error('API Client Error');
      mockApiClient.updateOrganization.mockRejectedValue(error);
      
      // Act & Assert
      await expect(repository.update(orgId, updateData)).rejects.toThrow(error);
    });
  });
  
  describe('delete', () => {
    const orgId = 'org-123';
    
    it('should delete an organization successfully', async () => {
      // Arrange
      mockApiClient.deleteOrganization.mockResolvedValue();
      
      // Act
      await repository.delete(orgId);
      
      // Assert
      expect(mockApiClient.deleteOrganization).toHaveBeenCalledWith(orgId);
    });
    
    it('should propagate API client errors', async () => {
      // Arrange
      const error = new Error('API Client Error');
      mockApiClient.deleteOrganization.mockRejectedValue(error);
      
      // Act & Assert
      await expect(repository.delete(orgId)).rejects.toThrow(error);
    });
  });
}); 