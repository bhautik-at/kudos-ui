import { KudoRepository } from '../../domain/interfaces/KudoRepository';
import { CategoryRepository } from '../../domain/interfaces/CategoryRepository';
import { UpdateKudoInputDto } from '../dtos/UpdateKudoInputDto';
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

export class UpdateKudoUseCase {
  constructor(
    private kudoRepository: KudoRepository,
    private userRepository: UserRepository,
    private teamRepository: TeamRepository,
    private categoryRepository: CategoryRepository
  ) {}

  async execute(inputDto: UpdateKudoInputDto, userId: string): Promise<KudoOutputDto> {
    try {
      // Find the existing kudo
      const existingKudo = await this.kudoRepository.findById(inputDto.id, inputDto.organizationId);

      if (!existingKudo) {
        throw new KudoValidationError('Kudo not found');
      }

      // Check if the user is the sender of the kudo
      if (existingKudo.senderId !== userId) {
        throw new KudoValidationError('You are not authorized to update this kudo');
      }

      // Convert input DTO to domain entity for update
      const kudo = InputDtoToKudoMapper.toEntityForUpdate(inputDto, existingKudo);

      // Update the kudo
      const updatedKudo = await this.kudoRepository.update(kudo);

      // Get additional data for the response
      const [recipient, sender, team, category] = await Promise.all([
        this.userRepository.findById(updatedKudo.recipientId, updatedKudo.organizationId),
        this.userRepository.findById(updatedKudo.senderId, updatedKudo.organizationId),
        this.teamRepository.findById(updatedKudo.teamId, updatedKudo.organizationId),
        this.categoryRepository.findById(updatedKudo.categoryId, updatedKudo.organizationId),
      ]);

      if (!recipient || !sender || !team || !category) {
        throw new KudoValidationError('Required entity not found');
      }

      // Convert entity to output DTO
      return KudoToOutputDtoMapper.toDto(
        updatedKudo,
        recipient.fullName,
        sender.fullName,
        team.name,
        category.name,
        new Date() // Use current date as updated_at
      );
    } catch (error) {
      if (error instanceof KudoValidationError) {
        throw error;
      }

      throw new Error(
        `Failed to update kudo: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}
