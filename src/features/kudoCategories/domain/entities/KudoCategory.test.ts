import { KudoCategory } from './KudoCategory';
import { InvalidKudoCategoryError } from '../errors/InvalidKudoCategoryError';

describe('KudoCategory Entity', () => {
  it('should create a valid kudo category', () => {
    // Arrange
    const props = {
      id: 'cat-123',
      name: 'Innovation',
      organizationId: 'org-123',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Act
    const category = new KudoCategory(props);

    // Assert
    expect(category.id).toBe(props.id);
    expect(category.name).toBe(props.name);
    expect(category.organizationId).toBe(props.organizationId);
    expect(category.createdAt).toBe(props.createdAt);
    expect(category.updatedAt).toBe(props.updatedAt);
  });

  it('should create a category with default dates when not provided', () => {
    // Arrange
    const before = new Date();
    
    // Act
    const category = new KudoCategory({
      name: 'Innovation',
      organizationId: 'org-123',
    });
    
    const after = new Date();

    // Assert
    expect(category.id).toBeUndefined();
    expect(category.name).toBe('Innovation');
    expect(category.organizationId).toBe('org-123');
    
    // Check that dates were set automatically
    expect(category.createdAt).toBeInstanceOf(Date);
    expect(category.updatedAt).toBeInstanceOf(Date);
    
    // Check that the dates are within the expected range
    expect(category.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
    expect(category.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
    expect(category.updatedAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
    expect(category.updatedAt.getTime()).toBeLessThanOrEqual(after.getTime());
  });

  it('should throw InvalidKudoCategoryError when name is empty', () => {
    // Act & Assert
    expect(() => {
      new KudoCategory({
        name: '',
        organizationId: 'org-123',
      });
    }).toThrow(InvalidKudoCategoryError);
    expect(() => {
      new KudoCategory({
        name: '   ',
        organizationId: 'org-123',
      });
    }).toThrow('Category name cannot be empty');
  });

  it('should throw InvalidKudoCategoryError when name exceeds 50 characters', () => {
    // Arrange
    const longName = 'A'.repeat(51);

    // Act & Assert
    expect(() => {
      new KudoCategory({
        name: longName,
        organizationId: 'org-123',
      });
    }).toThrow(InvalidKudoCategoryError);
    expect(() => {
      new KudoCategory({
        name: longName,
        organizationId: 'org-123',
      });
    }).toThrow('Category name cannot exceed 50 characters');
  });

  it('should throw InvalidKudoCategoryError when organizationId is missing', () => {
    // Act & Assert
    expect(() => {
      new KudoCategory({
        name: 'Innovation',
        organizationId: '',
      });
    }).toThrow(InvalidKudoCategoryError);
    expect(() => {
      new KudoCategory({
        name: 'Innovation',
        organizationId: '',
      });
    }).toThrow('Organization ID is required');
  });
}); 