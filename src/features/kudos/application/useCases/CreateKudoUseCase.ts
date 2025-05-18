import { KudoRepository } from '../../domain/interfaces/KudoRepository';
import { CategoryRepository } from '../../domain/interfaces/CategoryRepository';
import { CreateKudoInputDto } from '../dtos/CreateKudoInputDto';
import { KudoOutputDto } from '../dtos/KudoOutputDto';
import { InputDtoToKudoMapper } from '../mappers/InputDtoToKudoMapper';
import { KudoToOutputDtoMapper } from '../mappers/KudoToOutputDtoMapper';
import { KudoValidationError } from '../../domain/errors/KudoValidationError';

// These would be imported from their respective feature modules
interface UserRepository {
  findById(id: string, organizationId: string): Promise<{ id: string; fullName: string } | null>;
}

interface TeamRepository {
  findById(id: string, organizationId: string): Promise<{ id: string; name: string } | null>;
}

export class CreateKudoUseCase {
  constructor(
    private kudoRepository: KudoRepository,
    private userRepository: UserRepository,
    private teamRepository: TeamRepository,
    private categoryRepository: CategoryRepository
  ) {}

  async execute(inputDto: CreateKudoInputDto, senderId: string): Promise<KudoOutputDto> {
    try {
      // Convert input DTO to domain entity
      const kudo = InputDtoToKudoMapper.toEntity(inputDto, senderId);

      // Save the kudo
      const savedKudo = await this.kudoRepository.create(kudo);

      // Get additional data for the response
      const [recipient, sender, team, category] = await Promise.all([
        this.userRepository.findById(savedKudo.recipientId, savedKudo.organizationId),
        this.userRepository.findById(savedKudo.senderId, savedKudo.organizationId),
        this.teamRepository.findById(savedKudo.teamId, savedKudo.organizationId),
        this.categoryRepository.findById(savedKudo.categoryId, savedKudo.organizationId),
      ]);

      if (!recipient) {
        throw new KudoValidationError('Recipient not found');
      }

      if (!sender) {
        throw new KudoValidationError('Sender not found');
      }

      if (!team) {
        throw new KudoValidationError('Team not found');
      }

      if (!category) {
        throw new KudoValidationError('Category not found');
      }

      // Convert entity to output DTO
      return KudoToOutputDtoMapper.toDto(
        savedKudo,
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
        `Failed to create kudo: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}
