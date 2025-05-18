import { InvalidKudoCategoryError } from './InvalidKudoCategoryError';
import { KudoCategoryNotFoundError } from './KudoCategoryNotFoundError';
import { DuplicateKudoCategoryError } from './DuplicateKudoCategoryError';
import { UnauthorizedKudoCategoryAccessError } from './UnauthorizedKudoCategoryAccessError';

describe('Domain Errors', () => {
  describe('InvalidKudoCategoryError', () => {
    it('should create an error with the correct message and name', () => {
      // Arrange
      const errorMessage = 'Category name is too long';

      // Act
      const error = new InvalidKudoCategoryError(errorMessage);

      // Assert
      expect(error.message).toBe(errorMessage);
      expect(error.name).toBe('InvalidKudoCategoryError');
      expect(error).toBeInstanceOf(Error);
    });
  });

  describe('KudoCategoryNotFoundError', () => {
    it('should create an error with the correct message and name, including the ID', () => {
      // Arrange
      const categoryId = 'cat-123';

      // Act
      const error = new KudoCategoryNotFoundError(categoryId);

      // Assert
      expect(error.message).toBe(`Kudo category with ID ${categoryId} not found`);
      expect(error.name).toBe('KudoCategoryNotFoundError');
      expect(error).toBeInstanceOf(Error);
    });
  });

  describe('DuplicateKudoCategoryError', () => {
    it('should create an error with the correct message and name, including the name', () => {
      // Arrange
      const categoryName = 'Innovation';

      // Act
      const error = new DuplicateKudoCategoryError(categoryName);

      // Assert
      expect(error.message).toBe(`A kudo category with the name '${categoryName}' already exists in this organization`);
      expect(error.name).toBe('DuplicateKudoCategoryError');
      expect(error).toBeInstanceOf(Error);
    });

    it('should create an error with a default message when no name is provided', () => {
      // Act
      const error = new DuplicateKudoCategoryError();

      // Assert
      expect(error.message).toBe('A kudo category with this name already exists in this organization');
      expect(error.name).toBe('DuplicateKudoCategoryError');
      expect(error).toBeInstanceOf(Error);
    });
  });

  describe('UnauthorizedKudoCategoryAccessError', () => {
    it('should create an error with the correct message and name, including the organization ID', () => {
      // Arrange
      const organizationId = 'org-123';

      // Act
      const error = new UnauthorizedKudoCategoryAccessError(organizationId);

      // Assert
      expect(error.message).toBe(
        `Unauthorized access to kudo categories for organization ${organizationId}`
      );
      expect(error.name).toBe('UnauthorizedKudoCategoryAccessError');
      expect(error).toBeInstanceOf(Error);
    });

    it('should create an error with a default message when no organization ID is provided', () => {
      // Act
      const error = new UnauthorizedKudoCategoryAccessError();

      // Assert
      expect(error.message).toBe('Unauthorized access to kudo categories');
      expect(error.name).toBe('UnauthorizedKudoCategoryAccessError');
      expect(error).toBeInstanceOf(Error);
    });
  });
}); 