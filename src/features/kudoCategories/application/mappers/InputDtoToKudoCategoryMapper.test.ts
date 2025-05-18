import { InputDtoToKudoCategoryMapper } from './InputDtoToKudoCategoryMapper';
import { KudoCategory } from '../../domain/entities/KudoCategory';
import { CreateKudoCategoryInputDto } from '../dtos/CreateKudoCategoryInputDto';
import { UpdateKudoCategoryInputDto } from '../dtos/UpdateKudoCategoryInputDto';

describe('InputDtoToKudoCategoryMapper', () => {
  describe('toEntityFromCreate', () => {
    it('should correctly map CreateKudoCategoryInputDto to KudoCategory entity', () => {
      // Arrange
      const dto: CreateKudoCategoryInputDto = {
        name: 'Innovation',
        organizationId: 'org-123',
      };

      // Act
      const result = InputDtoToKudoCategoryMapper.toEntityFromCreate(dto);

      // Assert
      expect(result).toBeInstanceOf(KudoCategory);
      expect(result.name).toBe(dto.name);
      expect(result.organizationId).toBe(dto.organizationId);
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
      expect(result.id).toBeUndefined();
    });
  });

  describe('toEntityFromUpdate', () => {
    it('should correctly map UpdateKudoCategoryInputDto to KudoCategory entity preserving existing fields', () => {
      // Arrange
      const updateDto: UpdateKudoCategoryInputDto = {
        name: 'Updated Innovation',
      };

      const now = new Date();
      const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);
      
      const existingCategory = new KudoCategory({
        id: 'cat-123',
        name: 'Innovation',
        organizationId: 'org-123',
        createdAt: tenMinutesAgo,
        updatedAt: tenMinutesAgo,
      });

      // Act
      const result = InputDtoToKudoCategoryMapper.toEntityFromUpdate(updateDto, existingCategory);

      // Assert
      expect(result).toBeInstanceOf(KudoCategory);
      expect(result.id).toBe(existingCategory.id);
      expect(result.name).toBe(updateDto.name); // Updated field
      expect(result.organizationId).toBe(existingCategory.organizationId); // Preserved field
      expect(result.createdAt).toEqual(existingCategory.createdAt); // Preserved field
      expect(result.updatedAt).not.toEqual(existingCategory.updatedAt); // Updated timestamp
      expect(result.updatedAt.getTime()).toBeGreaterThan(existingCategory.updatedAt.getTime());
    });
  });
}); 