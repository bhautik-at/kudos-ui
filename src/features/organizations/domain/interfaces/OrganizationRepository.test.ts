import { Organization } from '../entities/Organization';
import { OrganizationRepository } from './OrganizationRepository';

// Mock implementation of the repository
class MockOrganizationRepository implements OrganizationRepository {
  private organizations: Map<string, Organization>;

  constructor() {
    this.organizations = new Map<string, Organization>();
  }

  async create(organization: Organization): Promise<Organization> {
    // For testing, generate a predictable ID if not provided
    const idToUse = organization.id || `org-${this.organizations.size + 1}`;
    
    // Create a new organization with the ID
    const newOrganization = new Organization({
      id: idToUse,
      name: organization.name,
      description: organization.description,
      createdAt: organization.createdAt,
      updatedAt: organization.updatedAt
    });
    
    // Store it in our mock database
    this.organizations.set(idToUse, newOrganization);
    
    return newOrganization;
  }

  async findAll(): Promise<Organization[]> {
    return Array.from(this.organizations.values());
  }

  async findById(id: string): Promise<Organization | null> {
    return this.organizations.get(id) || null;
  }

  async update(id: string, organization: Partial<Organization>): Promise<Organization> {
    const existingOrg = this.organizations.get(id);
    
    if (!existingOrg) {
      throw new Error(`Organization with ID ${id} not found`);
    }
    
    // Ensure we create a new Date for updatedAt to make it different
    const newUpdatedAt = new Date(Date.now() + 1000); // Add 1 second to ensure it's different
    
    // Create a new organization with updated properties
    const updatedOrg = new Organization({
      id: existingOrg.id,
      name: organization.name !== undefined ? organization.name : existingOrg.name,
      description: organization.description !== undefined ? organization.description : existingOrg.description,
      createdAt: existingOrg.createdAt,
      updatedAt: newUpdatedAt
    });
    
    // Update in our mock database
    this.organizations.set(id, updatedOrg);
    
    return updatedOrg;
  }

  async delete(id: string): Promise<void> {
    if (!this.organizations.has(id)) {
      throw new Error(`Organization with ID ${id} not found`);
    }
    
    this.organizations.delete(id);
  }
}

describe('OrganizationRepository Interface', () => {
  let repository: OrganizationRepository;
  
  beforeEach(() => {
    repository = new MockOrganizationRepository();
  });
  
  describe('create operation', () => {
    it('should create and return an organization with ID', async () => {
      // Arrange
      const organization = new Organization({
        name: 'Test Organization',
        description: 'This is a test organization'
      });
      
      // Act
      const result = await repository.create(organization);
      
      // Assert
      expect(result.id).toBeDefined();
      expect(result.name).toBe('Test Organization');
      expect(result.description).toBe('This is a test organization');
    });
  });
  
  describe('findAll operation', () => {
    it('should return empty array when no organizations exist', async () => {
      // Act
      const result = await repository.findAll();
      
      // Assert
      expect(result).toEqual([]);
    });
    
    it('should return all organizations', async () => {
      // Arrange - create two organizations
      const org1 = await repository.create(new Organization({ name: 'Organization 1' }));
      const org2 = await repository.create(new Organization({ name: 'Organization 2' }));
      
      // Act
      const result = await repository.findAll();
      
      // Assert - check that we have both organizations in the result
      expect(result.length).toBe(2);
      
      // Check that both organizations are in the result
      const resultIds = result.map(org => org.id);
      expect(resultIds).toContain(org1.id);
      expect(resultIds).toContain(org2.id);
      
      // Check organization content
      const resultOrg1 = result.find(org => org.id === org1.id);
      const resultOrg2 = result.find(org => org.id === org2.id);
      
      expect(resultOrg1?.name).toBe('Organization 1');
      expect(resultOrg2?.name).toBe('Organization 2');
    });
  });
  
  describe('findById operation', () => {
    it('should return null when organization does not exist', async () => {
      // Act
      const result = await repository.findById('non-existent-id');
      
      // Assert
      expect(result).toBeNull();
    });
    
    it('should return the organization when it exists', async () => {
      // Arrange
      const organization = await repository.create(
        new Organization({ name: 'Test Organization' })
      );
      
      // Act
      const result = await repository.findById(organization.id!);
      
      // Assert
      expect(result).not.toBeNull();
      expect(result!.id).toBe(organization.id);
      expect(result!.name).toBe('Test Organization');
    });
  });
  
  describe('update operation', () => {
    it('should throw error when organization does not exist', async () => {
      // Act & Assert
      await expect(
        repository.update('non-existent-id', { name: 'Updated Name' })
      ).rejects.toThrow('Organization with ID non-existent-id not found');
    });
    
    it('should update and return the organization', async () => {
      // Arrange
      const organization = await repository.create(
        new Organization({ 
          name: 'Original Name',
          description: 'Original Description'
        })
      );
      
      // Store the original updatedAt for comparison
      const originalUpdatedAt = organization.updatedAt;
      
      // Wait a bit to ensure time difference
      await new Promise(resolve => setTimeout(resolve, 10));
      
      // Act
      const result = await repository.update(organization.id!, {
        name: 'Updated Name'
      });
      
      // Assert
      expect(result.id).toBe(organization.id);
      expect(result.name).toBe('Updated Name');
      expect(result.description).toBe('Original Description'); // Unchanged
      expect(result.createdAt).toEqual(organization.createdAt);
      
      // Check that updatedAt has changed
      expect(result.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });
    
    it('should update only the specified properties', async () => {
      // Arrange
      const organization = await repository.create(
        new Organization({ 
          name: 'Original Name',
          description: 'Original Description'
        })
      );
      
      // Act
      const result = await repository.update(organization.id!, {
        description: 'Updated Description'
      });
      
      // Assert
      expect(result.name).toBe('Original Name'); // Unchanged
      expect(result.description).toBe('Updated Description');
    });
  });
  
  describe('delete operation', () => {
    it('should throw error when organization does not exist', async () => {
      // Act & Assert
      await expect(
        repository.delete('non-existent-id')
      ).rejects.toThrow('Organization with ID non-existent-id not found');
    });
    
    it('should delete the organization', async () => {
      // Arrange
      const organization = await repository.create(
        new Organization({ name: 'Test Organization' })
      );
      
      // Act
      await repository.delete(organization.id!);
      
      // Assert
      const result = await repository.findById(organization.id!);
      expect(result).toBeNull();
    });
  });
}); 