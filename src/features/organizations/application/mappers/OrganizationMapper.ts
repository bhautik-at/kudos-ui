import { Organization } from '../../domain/entities/Organization';
import { CreateOrganizationInputDto } from '../dtos/CreateOrganizationInputDto';
import { OrganizationOutputDto } from '../dtos/OrganizationOutputDto';

export class OrganizationMapper {
  static toEntity(dto: CreateOrganizationInputDto): Organization {
    return new Organization({
      name: dto.name,
      description: dto.description,
    });
  }

  static toDto(entity: Organization): OrganizationOutputDto {
    return {
      id: entity.id!,
      name: entity.name,
      description: entity.description,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }

  static toDtoList(entities: Organization[]): OrganizationOutputDto[] {
    return entities.map(entity => this.toDto(entity));
  }
}
