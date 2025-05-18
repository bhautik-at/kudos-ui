import { TeamMapper } from './TeamMapper';
import { Team } from '../../domain/entities/Team';
import { CreateTeamInputDto } from '../dtos/CreateTeamInputDto';
import { UpdateTeamInputDto } from '../dtos/UpdateTeamInputDto';

describe('TeamMapper', () => {
  describe('toEntity', () => {
    it('should map CreateTeamInputDto to Team entity', () => {
      // Arrange
      const createTeamDto: CreateTeamInputDto = {
        name: 'Engineering Team',
        organizationId: 'org-123',
        createdBy: 'user-123',
        members: ['user-123', 'user-456'],
      };

      // Act
      const team = TeamMapper.toEntity(createTeamDto);

      // Assert
      expect(team).toBeInstanceOf(Team);
      expect(team.name).toBe('Engineering Team');
      expect(team.organizationId).toBe('org-123');
      expect(team.createdBy).toBe('user-123');
      expect(team.members).toEqual(['user-123', 'user-456']);
      expect(team.createdAt).toBeInstanceOf(Date);
      expect(team.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('toEntityFromUpdate', () => {
    it('should map UpdateTeamInputDto to Team entity while preserving existing properties', () => {
      // Arrange
      const updateTeamDto: UpdateTeamInputDto = {
        id: 'team-123',
        name: 'Updated Team Name',
      };

      const createdAt = new Date('2023-01-01');
      const existingTeam = new Team({
        id: 'team-123',
        name: 'Original Team Name',
        organizationId: 'org-123',
        createdBy: 'user-123',
        createdAt: createdAt,
        updatedAt: createdAt,
        members: ['user-123', 'user-456'],
      });

      // Act
      const updatedTeam = TeamMapper.toEntityFromUpdate(updateTeamDto, existingTeam);

      // Assert
      expect(updatedTeam).toBeInstanceOf(Team);
      expect(updatedTeam.id).toBe('team-123');
      expect(updatedTeam.name).toBe('Updated Team Name');
      expect(updatedTeam.organizationId).toBe('org-123');
      expect(updatedTeam.createdBy).toBe('user-123');
      expect(updatedTeam.createdAt).toEqual(existingTeam.createdAt);
      // Instead of comparing dates directly, check that the updated date is newer
      expect(updatedTeam.updatedAt.getTime()).toBeGreaterThan(existingTeam.updatedAt.getTime());
      expect(updatedTeam.members).toEqual(['user-123', 'user-456']);
    });
  });

  describe('toDto', () => {
    it('should map Team entity to TeamOutputDto', () => {
      // Arrange
      const now = new Date();
      const team = new Team({
        id: 'team-123',
        name: 'Engineering Team',
        organizationId: 'org-123',
        createdBy: 'user-123',
        createdAt: now,
        updatedAt: now,
        members: ['user-123', 'user-456'],
      });

      // Act
      const dto = TeamMapper.toDto(team);

      // Assert
      expect(dto.id).toBe('team-123');
      expect(dto.name).toBe('Engineering Team');
      expect(dto.organizationId).toBe('org-123');
      expect(dto.createdBy).toBe('user-123');
      expect(dto.createdAt).toBe(now.toISOString());
      expect(dto.updatedAt).toBe(now.toISOString());
      expect(dto.members).toEqual(['user-123', 'user-456']);
    });
  });

  describe('toDtoList', () => {
    it('should map array of Team entities to array of TeamOutputDto', () => {
      // Arrange
      const now = new Date();
      const teams = [
        new Team({
          id: 'team-1',
          name: 'Team 1',
          organizationId: 'org-123',
          createdBy: 'user-123',
          createdAt: now,
          updatedAt: now,
        }),
        new Team({
          id: 'team-2',
          name: 'Team 2',
          organizationId: 'org-123',
          createdBy: 'user-123',
          createdAt: now,
          updatedAt: now,
        }),
      ];

      // Act
      const dtos = TeamMapper.toDtoList(teams);

      // Assert
      expect(dtos).toHaveLength(2);
      expect(dtos[0].id).toBe('team-1');
      expect(dtos[0].name).toBe('Team 1');
      expect(dtos[1].id).toBe('team-2');
      expect(dtos[1].name).toBe('Team 2');
    });
  });
});
