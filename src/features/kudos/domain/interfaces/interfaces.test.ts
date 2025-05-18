import { KudoRepository } from './KudoRepository';
import { Category, CategoryRepository } from './CategoryRepository';

describe('Domain Interfaces', () => {
  describe('KudoRepository Interface', () => {
    it('should have all required methods', () => {
      // This is a type check test, not a runtime test
      // We're checking that the interface has the expected structure
      
      // Create a mock implementation to verify the interface shape
      const mockRepo: KudoRepository = {
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        findById: jest.fn(),
        findAll: jest.fn(),
      };
      
      // Verify that all expected methods exist
      expect(typeof mockRepo.create).toBe('function');
      expect(typeof mockRepo.update).toBe('function');
      expect(typeof mockRepo.delete).toBe('function');
      expect(typeof mockRepo.findById).toBe('function');
      expect(typeof mockRepo.findAll).toBe('function');
    });
  });
  
  describe('CategoryRepository Interface', () => {
    it('should have all required methods', () => {
      // Create a mock implementation to verify the interface shape
      const mockRepo: CategoryRepository = {
        findById: jest.fn(),
        findAll: jest.fn(),
      };
      
      // Verify that all expected methods exist
      expect(typeof mockRepo.findById).toBe('function');
      expect(typeof mockRepo.findAll).toBe('function');
    });
  });
  
  describe('Category Interface', () => {
    it('should have all required properties', () => {
      // Create a mock object that satisfies the Category interface
      const mockCategory: Category = {
        id: 'cat-123',
        name: 'Teamwork',
        description: 'Recognizing great teamwork',
        organizationId: 'org-123',
      };
      
      // Verify that all expected properties exist
      expect(mockCategory).toHaveProperty('id');
      expect(mockCategory).toHaveProperty('name');
      expect(mockCategory).toHaveProperty('description');
      expect(mockCategory).toHaveProperty('organizationId');
    });
    
    it('should allow optional description property', () => {
      // Create a mock object without the optional description
      const mockCategory: Category = {
        id: 'cat-123',
        name: 'Innovation',
        organizationId: 'org-123',
      };
      
      // Verify that all required properties exist
      expect(mockCategory).toHaveProperty('id');
      expect(mockCategory).toHaveProperty('name');
      expect(mockCategory).toHaveProperty('organizationId');
      
      // Description is optional, so it's valid for it to be undefined
      expect(mockCategory.description).toBeUndefined();
    });
  });
}); 