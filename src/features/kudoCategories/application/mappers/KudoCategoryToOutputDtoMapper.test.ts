import { KudoCategoryToOutputDtoMapper } from './KudoCategoryToOutputDtoMapper';
import { KudoCategory } from '../../domain/entities/KudoCategory';

describe('KudoCategoryToOutputDtoMapper', () => {
  describe('toDto', () => {
    it('should correctly map KudoCategory entity to KudoCategoryOutputDto', () => {
      // Arrange
      const now = new Date();
      const category = new KudoCategory({
        id: 'cat-123',
        name: 'Innovation',
        organizationId: 'org-123',
        createdAt: now,
        updatedAt: now,
      });

      // Act
      const result = KudoCategoryToOutputDtoMapper.toDto(category);

      // Assert
      expect(result).toEqual({
        id: 'cat-123',
        name: 'Innovation',
        organizationId: 'org-123',
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      });
    });

    it('should handle undefined id by providing an empty string', () => {
      // Arrange
      const now = new Date();
      const category = new KudoCategory({
        name: 'Innovation',
        organizationId: 'org-123',
        createdAt: now,
        updatedAt: now,
      });

      // Act
      const result = KudoCategoryToOutputDtoMapper.toDto(category);

      // Assert
      expect(result).toEqual({
        id: '',
        name: 'Innovation',
        organizationId: 'org-123',
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      });
    });
  });

  describe('toDtoList', () => {
    it('should correctly map an array of KudoCategory entities to KudoCategoryOutputDto array', () => {
      // Arrange
      const now = new Date();
      const categories = [
        new KudoCategory({
          id: 'cat-1',
          name: 'Innovation',
          organizationId: 'org-123',
          createdAt: now,
          updatedAt: now,
        }),
        new KudoCategory({
          id: 'cat-2',
          name: 'Teamwork',
          organizationId: 'org-123',
          createdAt: now,
          updatedAt: now,
        }),
      ];

      // Act
      const result = KudoCategoryToOutputDtoMapper.toDtoList(categories);

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: 'cat-1',
        name: 'Innovation',
        organizationId: 'org-123',
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      });
      expect(result[1]).toEqual({
        id: 'cat-2',
        name: 'Teamwork',
        organizationId: 'org-123',
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      });
    });

    it('should return an empty array when given an empty array', () => {
      // Arrange
      const categories: KudoCategory[] = [];

      // Act
      const result = KudoCategoryToOutputDtoMapper.toDtoList(categories);

      // Assert
      expect(result).toEqual([]);
    });
  });
}); 