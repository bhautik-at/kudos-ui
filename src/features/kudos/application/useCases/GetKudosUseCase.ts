import { KudoRepository } from '../../domain/interfaces/KudoRepository';
import { CategoryRepository } from '../../domain/interfaces/CategoryRepository';
import { KudoOutputDto } from '../dtos/KudoOutputDto';
import { KudoToOutputDtoMapper } from '../mappers/KudoToOutputDtoMapper';

// These would be imported from their respective feature modules
interface UserRepository {
  findByIds(
    ids: string[],
    organizationId: string
  ): Promise<Array<{ id: string; fullName: string }>>;
}

interface TeamRepository {
  findByIds(ids: string[], organizationId: string): Promise<Array<{ id: string; name: string }>>;
}

interface GetKudosParams {
  recipientId?: string;
  senderId?: string;
  teamId?: string;
  categoryId?: string;
  organizationId: string;
  page?: number;
  limit?: number;
}

interface GetKudosResult {
  kudos: KudoOutputDto[];
  total: number;
  pages: number;
  currentPage: number;
  limit: number;
}

export class GetKudosUseCase {
  constructor(
    private kudoRepository: KudoRepository,
    private userRepository: UserRepository,
    private teamRepository: TeamRepository,
    private categoryRepository: CategoryRepository
  ) {}

  async execute(params: GetKudosParams): Promise<GetKudosResult> {
    try {
      // Get kudos with pagination
      const result = await this.kudoRepository.findAll(params);

      if (result.kudos.length === 0) {
        return {
          kudos: [],
          total: result.total,
          pages: result.pages,
          currentPage: result.currentPage,
          limit: result.limit,
        };
      }

      // Extract unique IDs for batch lookup
      const recipientIds = [...new Set(result.kudos.map(kudo => kudo.recipientId))];
      const senderIds = [...new Set(result.kudos.map(kudo => kudo.senderId))];
      const teamIds = [...new Set(result.kudos.map(kudo => kudo.teamId))];
      const categoryIds = [...new Set(result.kudos.map(kudo => kudo.categoryId))];

      // Fetch related entities in parallel
      const [recipients, senders, teams, categories] = await Promise.all([
        this.userRepository.findByIds(recipientIds, params.organizationId),
        this.userRepository.findByIds(senderIds, params.organizationId),
        this.teamRepository.findByIds(teamIds, params.organizationId),
        this.categoryRepository.findAll(params.organizationId),
      ]);

      // Create lookup maps for each entity type
      const recipientMap: Record<string, string> = {};
      recipients.forEach(recipient => {
        recipientMap[recipient.id] = recipient.fullName;
      });

      const senderMap: Record<string, string> = {};
      senders.forEach(sender => {
        senderMap[sender.id] = sender.fullName;
      });

      const teamMap: Record<string, string> = {};
      teams.forEach(team => {
        teamMap[team.id] = team.name;
      });

      const categoryMap: Record<string, string> = {};
      categories.forEach(category => {
        categoryMap[category.id] = category.name;
      });

      // Map to DTOs
      const kudoDtos = KudoToOutputDtoMapper.toDtoList(
        result.kudos,
        recipientMap,
        senderMap,
        teamMap,
        categoryMap
      );

      return {
        kudos: kudoDtos,
        total: result.total,
        pages: result.pages,
        currentPage: result.currentPage,
        limit: result.limit,
      };
    } catch (error) {
      throw new Error(
        `Failed to get kudos: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}
