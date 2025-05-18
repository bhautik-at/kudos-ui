import { Organization } from './Organization';

describe('Organization Entity', () => {
  describe('constructor', () => {
    it('should create a valid organization with all properties', () => {
      // Arrange
      const id = 'org-123';
      const name = 'Test Organization';
      const description = 'This is a test organization';
      const createdAt = new Date('2023-01-01T00:00:00.000Z');
      const updatedAt = new Date('2023-01-02T00:00:00.000Z');
      
      // Act
      const organization = new Organization({
        id,
        name,
        description,
        createdAt,
        updatedAt
      });
      
      // Assert
      expect(organization.id).toBe(id);
      expect(organization.name).toBe(name);
      expect(organization.description).toBe(description);
      expect(organization.createdAt).toEqual(createdAt);
      expect(organization.updatedAt).toEqual(updatedAt);
    });
    
    it('should set default values for optional properties', () => {
      // Arrange
      const name = 'Test Organization';
      
      // Act
      const organization = new Organization({ name });
      
      // Assert
      expect(organization.id).toBeUndefined();
      expect(organization.name).toBe(name);
      expect(organization.description).toBe('');
      expect(organization.createdAt).toBeInstanceOf(Date);
      expect(organization.updatedAt).toBeInstanceOf(Date);
    });
    
    it('should set current date for createdAt and updatedAt if not provided', () => {
      // Arrange
      const now = new Date();
      const name = 'Test Organization';
      
      // Act
      const organization = new Organization({ name });
      
      // Assert
      // Check that the dates are within a few milliseconds of each other
      const createdDiff = Math.abs(organization.createdAt.getTime() - now.getTime());
      const updatedDiff = Math.abs(organization.updatedAt.getTime() - now.getTime());
      
      expect(createdDiff).toBeLessThan(100); // Within 100ms
      expect(updatedDiff).toBeLessThan(100); // Within 100ms
    });
  });
  
  describe('validation', () => {
    it('should throw error when name is too short', () => {
      // Act & Assert
      expect(() => {
        new Organization({ name: 'A' });
      }).toThrow('Organization name must be at least 2 characters');
    });
    
    it('should throw error when name contains only whitespace', () => {
      // Act & Assert
      expect(() => {
        new Organization({ name: '  ' });
      }).toThrow('Organization name must be at least 2 characters');
    });
    
    it('should throw error when name is empty', () => {
      // Act & Assert
      expect(() => {
        new Organization({ name: '' });
      }).toThrow('Organization name must be at least 2 characters');
    });
    
    it('should accept name with exactly 2 characters', () => {
      // Act & Assert
      expect(() => {
        new Organization({ name: 'AB' });
      }).not.toThrow();
    });
    
    it('should trim whitespace when validating name length', () => {
      // Act & Assert
      expect(() => {
        new Organization({ name: ' A ' });
      }).toThrow('Organization name must be at least 2 characters');
      
      expect(() => {
        new Organization({ name: ' AB ' });
      }).not.toThrow();
    });
  });
}); 