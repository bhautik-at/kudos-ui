import { Team } from '../../domain/entities/Team';
import { CreateTeamInputDto } from '../dtos/CreateTeamInputDto';
import { TeamOutputDto } from '../dtos/TeamOutputDto';
import { UpdateTeamInputDto } from '../dtos/UpdateTeamInputDto';

export class TeamMapper {
  static toEntity(dto: CreateTeamInputDto): Team {
    return new Team({
      name: dto.name,
      organizationId: dto.organizationId,
      createdBy: dto.createdBy,
      members: dto.members,
    });
  }

  static toEntityFromUpdate(dto: UpdateTeamInputDto, existingTeam: Team): Team {
    return new Team({
      id: dto.id,
      name: dto.name,
      organizationId: existingTeam.organizationId,
      createdBy: existingTeam.createdBy,
      createdAt: existingTeam.createdAt,
      updatedAt: new Date(),
      members: existingTeam.members,
    });
  }

  static toDto(team: Team): TeamOutputDto {
    return {
      id: team.id!,
      name: team.name,
      organizationId: team.organizationId,
      createdBy: team.createdBy,
      createdAt: team.createdAt.toISOString(),
      updatedAt: team.updatedAt.toISOString(),
      members: team.members,
    };
  }

  static toDtoList(teams: Team[]): TeamOutputDto[] {
    return teams.map(team => this.toDto(team));
  }
}
