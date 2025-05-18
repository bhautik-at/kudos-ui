import { Team } from '../../domain/entities/Team';
import { CreateTeamInputDto } from '../dtos/CreateTeamInputDto';
import { UpdateTeamInputDto } from '../dtos/UpdateTeamInputDto';
import { TeamMapper } from './TeamMapper';

describe('TeamMapper', () => {
  describe('toEntity', () => {
    it('should convert DTO to entity with required fields', () => {
      // Arrange
      const dto: CreateTeamInputDto = {
        name: 'Test Team',
        organizationId: 'org-123',
        createdBy: 'user-123',
      };

      // Act
      const entity = TeamMapper.toEntity(dto);

      // Assert
      expect(entity).toBeInstanceOf(Team);
      expect(entity.name).toBe('Test Team');
      expect(entity.organizationId).toBe('org-123');
      expect(entity.createdBy).toBe('user-123');
      expect(entity.members).toEqual([]);
      expect(entity.createdAt).toBeInstanceOf(Date);
      expect(entity.updatedAt).toBeInstanceOf(Date);
    });

    it('should convert DTO to entity with all fields including members', () => {
      // Arrange
      const dto: CreateTeamInputDto = {
        name: 'Test Team',
        organizationId: 'org-123',
        createdBy: 'user-123',
        members: ['user-123', 'user-456'],
      };

      // Act
      const entity = TeamMapper.toEntity(dto);

      // Assert
      expect(entity).toBeInstanceOf(Team);
      expect(entity.name).toBe('Test Team');
      expect(entity.organizationId).toBe('org-123');
      expect(entity.createdBy).toBe('user-123');
      expect(entity.members).toEqual(['user-123', 'user-456']);
    });
  });

  describe('toEntityFromUpdate', () => {
    it('should convert update DTO to entity preserving existing fields', () => {
      // Arrange
      const existingTeam = new Team({
        id: 'team-123',
        name: 'Old Team Name',
        organizationId: 'org-123',
        createdBy: 'user-123',
        createdAt: new Date('2023-01-01T00:00:00.000Z'),
        updatedAt: new Date('2023-01-01T00:00:00.000Z'),
        members: ['user-123', 'user-456'],
      });

      const updateDto: UpdateTeamInputDto = {
        id: 'team-123',
        name: 'New Team Name',
      };

      // Act
      const entity = TeamMapper.toEntityFromUpdate(updateDto, existingTeam);

      // Assert
      expect(entity).toBeInstanceOf(Team);
      expect(entity.id).toBe('team-123');
      expect(entity.name).toBe('New Team Name');
      expect(entity.organizationId).toBe('org-123');
      expect(entity.createdBy).toBe('user-123');
      expect(entity.createdAt).toEqual(existingTeam.createdAt);
      expect(entity.updatedAt).not.toEqual(existingTeam.updatedAt); // Should be updated
      expect(entity.members).toEqual(['user-123', 'user-456']);
    });
  });

  describe('toDto', () => {
    it('should convert entity to DTO', () => {
      // Arrange
      const createdAt = new Date('2023-01-01T00:00:00.000Z');
      const updatedAt = new Date('2023-01-02T00:00:00.000Z');
      
      const entity = new Team({
        id: 'team-123',
        name: 'Test Team',
        organizationId: 'org-123',
        createdBy: 'user-123',
        createdAt,
        updatedAt,
        members: ['user-123', 'user-456'],
      });

      // Act
      const dto = TeamMapper.toDto(entity);

      // Assert
      expect(dto.id).toBe('team-123');
      expect(dto.name).toBe('Test Team');
      expect(dto.organizationId).toBe('org-123');
      expect(dto.createdBy).toBe('user-123');
      expect(dto.createdAt).toBe('2023-01-01T00:00:00.000Z');
      expect(dto.updatedAt).toBe('2023-01-02T00:00:00.000Z');
      expect(dto.members).toEqual(['user-123', 'user-456']);
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
        new Team({
          id: 'team-123',
          name: 'Test Team 1',
          organizationId: 'org-123',
          createdBy: 'user-123',
          createdAt: createdAt1,
          updatedAt: updatedAt1,
          members: ['user-123', 'user-456'],
        }),
        new Team({
          id: 'team-456',
          name: 'Test Team 2',
          organizationId: 'org-123',
          createdBy: 'user-123',
          createdAt: createdAt2,
          updatedAt: updatedAt2,
          members: ['user-789'],
        })
      ];

      // Act
      const dtos = TeamMapper.toDtoList(entities);

      // Assert
      expect(dtos).toHaveLength(2);
      
      expect(dtos[0].id).toBe('team-123');
      expect(dtos[0].name).toBe('Test Team 1');
      expect(dtos[0].createdAt).toBe('2023-01-01T00:00:00.000Z');
      expect(dtos[0].updatedAt).toBe('2023-01-02T00:00:00.000Z');
      expect(dtos[0].members).toEqual(['user-123', 'user-456']);
      
      expect(dtos[1].id).toBe('team-456');
      expect(dtos[1].name).toBe('Test Team 2');
      expect(dtos[1].createdAt).toBe('2023-01-03T00:00:00.000Z');
      expect(dtos[1].updatedAt).toBe('2023-01-04T00:00:00.000Z');
      expect(dtos[1].members).toEqual(['user-789']);
    });

    it('should return empty array when given empty array', () => {
      // Act
      const dtos = TeamMapper.toDtoList([]);

      // Assert
      expect(dtos).toEqual([]);
    });
  });
}); 