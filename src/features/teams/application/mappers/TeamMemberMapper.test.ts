import { TeamMemberMapper } from './TeamMemberMapper';
import { TeamMember } from '../../domain/entities/TeamMember';
import { TeamMemberInputDto } from '../dtos/TeamMemberInputDto';
import { TeamMemberWithUserInfo } from '../../domain/interfaces/TeamMemberRepository';

describe('TeamMemberMapper', () => {
  describe('toEntity', () => {
    it('should map TeamMemberInputDto to TeamMember entity', () => {
      // Arrange
      const teamMemberDto: TeamMemberInputDto = {
        teamId: 'team-123',
        memberUserId: 'user-123',
      };

      // Act
      const teamMember = TeamMemberMapper.toEntity(teamMemberDto);

      // Assert
      expect(teamMember).toBeInstanceOf(TeamMember);
      expect(teamMember.teamId).toBe('team-123');
      expect(teamMember.userId).toBe('user-123');
      expect(teamMember.createdAt).toBeInstanceOf(Date);
      expect(teamMember.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('toDto', () => {
    it('should map TeamMember entity to TeamMemberOutputDto', () => {
      // Arrange
      const now = new Date();
      const teamMember = new TeamMember({
        id: 'member-123',
        teamId: 'team-123',
        userId: 'user-123',
        createdAt: now,
        updatedAt: now,
      });

      // Act
      const dto = TeamMemberMapper.toDto(teamMember);

      // Assert
      expect(dto.id).toBe('member-123');
      expect(dto.teamId).toBe('team-123');
      expect(dto.userId).toBe('user-123');
      expect(dto.createdAt).toBe(now.toISOString());
      expect(dto.updatedAt).toBe(now.toISOString());
    });
  });

  describe('toDetailedDto', () => {
    it('should map TeamMemberWithUserInfo to TeamMemberWithUserInfoOutputDto', () => {
      // Arrange
      const now = new Date();
      const teamMemberWithUserInfo: TeamMemberWithUserInfo = {
        id: 'member-123',
        teamId: 'team-123',
        userId: 'user-123',
        firstName: 'John',
        lastName: 'Doe',
        fullName: 'John Doe',
        email: 'john.doe@example.com',
        role: 'Developer',
        createdAt: now,
        updatedAt: now,
      };

      // Act
      const dto = TeamMemberMapper.toDetailedDto(teamMemberWithUserInfo);

      // Assert
      expect(dto.id).toBe('member-123');
      expect(dto.teamId).toBe('team-123');
      expect(dto.userId).toBe('user-123');
      expect(dto.firstName).toBe('John');
      expect(dto.lastName).toBe('Doe');
      expect(dto.fullName).toBe('John Doe');
      expect(dto.email).toBe('john.doe@example.com');
      expect(dto.role).toBe('Developer');
      expect(dto.createdAt).toBe(now.toISOString());
      expect(dto.updatedAt).toBe(now.toISOString());
    });
  });

  describe('toDetailedDtoList', () => {
    it('should map array of TeamMemberWithUserInfo to array of TeamMemberWithUserInfoOutputDto', () => {
      // Arrange
      const now = new Date();
      const teamMembers: TeamMemberWithUserInfo[] = [
        {
          id: 'member-1',
          teamId: 'team-123',
          userId: 'user-1',
          firstName: 'John',
          lastName: 'Doe',
          fullName: 'John Doe',
          email: 'john.doe@example.com',
          role: 'Developer',
          createdAt: now,
          updatedAt: now,
        },
        {
          id: 'member-2',
          teamId: 'team-123',
          userId: 'user-2',
          firstName: 'Jane',
          lastName: 'Smith',
          fullName: 'Jane Smith',
          email: 'jane.smith@example.com',
          role: 'Designer',
          createdAt: now,
          updatedAt: now,
        },
      ];

      // Act
      const dtos = TeamMemberMapper.toDetailedDtoList(teamMembers);

      // Assert
      expect(dtos).toHaveLength(2);
      expect(dtos[0].id).toBe('member-1');
      expect(dtos[0].fullName).toBe('John Doe');
      expect(dtos[0].role).toBe('Developer');
      expect(dtos[1].id).toBe('member-2');
      expect(dtos[1].fullName).toBe('Jane Smith');
      expect(dtos[1].role).toBe('Designer');
    });
  });
});
