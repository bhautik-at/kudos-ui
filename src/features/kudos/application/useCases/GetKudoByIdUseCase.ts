import { KudoRepository } from '../../domain/interfaces/KudoRepository';
import { CategoryRepository } from '../../domain/interfaces/CategoryRepository';
import { KudoOutputDto } from '../dtos/KudoOutputDto';
import { KudoToOutputDtoMapper } from '../mappers/KudoToOutputDtoMapper';
import { KudoValidationError } from '../../domain/errors/KudoValidationError';

// These would be imported from their respective feature modules
interface UserRepository {
  findById(id: string, organizationId: string): Promise<{ id: string; fullName: string } | null>;
}

interface TeamRepository {
  findById(id: string, organizationId: string): Promise<{ id: string; name: string } | null>;
}

export class GetKudoByIdUseCase {
  constructor(
    private kudoRepository: KudoRepository,
    private userRepository: UserRepository,
    private teamRepository: TeamRepository,
    private categoryRepository: CategoryRepository
  ) {}

  async execute(id: string, organizationId: string): Promise<KudoOutputDto> {
    try {
      // Find the kudo
      const kudo = await this.kudoRepository.findById(id, organizationId);

      if (!kudo) {
        throw new KudoValidationError('Kudo not found');
      }

      // Get additional data for the response
      const [recipient, sender, team, category] = await Promise.all([
        this.userRepository.findById(kudo.recipientId, organizationId),
        this.userRepository.findById(kudo.senderId, organizationId),
        this.teamRepository.findById(kudo.teamId, organizationId),
        this.categoryRepository.findById(kudo.categoryId, organizationId),
      ]);

      if (!recipient || !sender || !team || !category) {
        throw new KudoValidationError('Required entity not found');
      }

      // Convert entity to output DTO
      return KudoToOutputDtoMapper.toDto(
        kudo,
        recipient.fullName,
        sender.fullName,
        team.name,
        category.name
      );
    } catch (error) {
      if (error instanceof KudoValidationError) {
        throw error;
      }

      throw new Error(
        `Failed to get kudo: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}
