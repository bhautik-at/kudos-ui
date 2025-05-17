import { TeamMember } from '../../domain/entities/TeamMember';
import { TeamMemberWithUserInfo } from '../../domain/interfaces/TeamMemberRepository';
import { TeamMemberInputDto } from '../dtos/TeamMemberInputDto';
import { TeamMemberOutputDto, TeamMemberWithUserInfoOutputDto } from '../dtos/TeamMemberOutputDto';

export class TeamMemberMapper {
  static toEntity(dto: TeamMemberInputDto): TeamMember {
    return new TeamMember({
      teamId: dto.teamId,
      userId: dto.memberUserId,
    });
  }

  static toDto(teamMember: TeamMember): TeamMemberOutputDto {
    return {
      id: teamMember.id!,
      teamId: teamMember.teamId,
      userId: teamMember.userId,
      createdAt: teamMember.createdAt.toISOString(),
      updatedAt: teamMember.updatedAt.toISOString(),
    };
  }

  static toDetailedDto(teamMember: TeamMemberWithUserInfo): TeamMemberWithUserInfoOutputDto {
    return {
      id: teamMember.id!,
      teamId: teamMember.teamId,
      userId: teamMember.userId,
      firstName: teamMember.firstName,
      lastName: teamMember.lastName,
      fullName: teamMember.fullName,
      email: teamMember.email,
      role: teamMember.role,
      createdAt: teamMember.createdAt.toISOString(),
      updatedAt: teamMember.updatedAt.toISOString(),
    };
  }

  static toDetailedDtoList(
    teamMembers: TeamMemberWithUserInfo[]
  ): TeamMemberWithUserInfoOutputDto[] {
    return teamMembers.map(member => this.toDetailedDto(member));
  }
}
