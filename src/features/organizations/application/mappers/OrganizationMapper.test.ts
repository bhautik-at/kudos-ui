import { Organization } from '../../domain/entities/Organization';
import { CreateOrganizationInputDto } from '../dtos/CreateOrganizationInputDto';
import { OrganizationMapper } from './OrganizationMapper';

describe('OrganizationMapper', () => {
  describe('toEntity', () => {
    it('should convert DTO to entity with required fields', () => {
      // Arrange
      const dto: CreateOrganizationInputDto = {
        name: 'Test Organization'
      };

      // Act
      const entity = OrganizationMapper.toEntity(dto);

      // Assert
      expect(entity).toBeInstanceOf(Organization);
      expect(entity.name).toBe('Test Organization');
      expect(entity.description).toBe(''); // Default empty string
      expect(entity.createdAt).toBeInstanceOf(Date);
      expect(entity.updatedAt).toBeInstanceOf(Date);
    });

    it('should convert DTO to entity with all fields', () => {
      // Arrange
      const dto: CreateOrganizationInputDto = {
        name: 'Test Organization',
        description: 'This is a test organization'
      };

      // Act
      const entity = OrganizationMapper.toEntity(dto);

      // Assert
      expect(entity).toBeInstanceOf(Organization);
      expect(entity.name).toBe('Test Organization');
      expect(entity.description).toBe('This is a test organization');
    });
  });

  describe('toDto', () => {
    it('should convert entity to DTO', () => {
      // Arrange
      const createdAt = new Date('2023-01-01T00:00:00.000Z');
      const updatedAt = new Date('2023-01-02T00:00:00.000Z');
      
      const entity = new Organization({
        id: 'org-123',
        name: 'Test Organization',
        description: 'This is a test organization',
        createdAt,
        updatedAt
      });

      // Act
      const dto = OrganizationMapper.toDto(entity);

      // Assert
      expect(dto.id).toBe('org-123');
      expect(dto.name).toBe('Test Organization');
      expect(dto.description).toBe('This is a test organization');
      expect(dto.createdAt).toBe('2023-01-01T00:00:00.000Z');
      expect(dto.updatedAt).toBe('2023-01-02T00:00:00.000Z');
    });
  });

  describe('toDtoList', () => {
    it('should convert entity list to DTO list', () => {
      // Arrange
      const createdAt1 = new Date('2023-01-01T00:00:00.000Z');
      const updatedAt1 = new Date('2023-01-02T00:00:00.000Z');
      const createdAt2 = new Date('2023-01-03T00:00:00.000Z');
      const updatedAt2 = new Date('2023-01-04T00:00:00.000Z');
      
      const entities = [
        new Organization({
          id: 'org-123',
          name: 'Test Organization 1',
          description: 'This is test organization 1',
          createdAt: createdAt1,
          updatedAt: updatedAt1
        }),
        new Organization({
          id: 'org-456',
          name: 'Test Organization 2',
          description: 'This is test organization 2',
          createdAt: createdAt2,
          updatedAt: updatedAt2
        })
      ];

      // Act
      const dtos = OrganizationMapper.toDtoList(entities);

      // Assert
      expect(dtos).toHaveLength(2);
      
      expect(dtos[0].id).toBe('org-123');
      expect(dtos[0].name).toBe('Test Organization 1');
      expect(dtos[0].description).toBe('This is test organization 1');
      expect(dtos[0].createdAt).toBe('2023-01-01T00:00:00.000Z');
      expect(dtos[0].updatedAt).toBe('2023-01-02T00:00:00.000Z');
      
      expect(dtos[1].id).toBe('org-456');
      expect(dtos[1].name).toBe('Test Organization 2');
      expect(dtos[1].description).toBe('This is test organization 2');
      expect(dtos[1].createdAt).toBe('2023-01-03T00:00:00.000Z');
      expect(dtos[1].updatedAt).toBe('2023-01-04T00:00:00.000Z');
    });

    it('should return empty array when given empty array', () => {
      // Act
      const dtos = OrganizationMapper.toDtoList([]);

      // Assert
      expect(dtos).toEqual([]);
    });
  });
}); 