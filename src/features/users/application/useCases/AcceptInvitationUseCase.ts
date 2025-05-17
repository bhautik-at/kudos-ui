import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import { AcceptInvitationInputDto } from '../dtos/AcceptInvitationInputDto';
import { AcceptInvitationOutputDto } from '../dtos/AcceptInvitationOutputDto';

export class AcceptInvitationUseCase {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  /**
   * Executes the accept invitation use case
   * @param input The AcceptInvitationInputDto containing the organizationId
   * @returns AcceptInvitationOutputDto with the result of the operation
   */
  async execute(input: AcceptInvitationInputDto): Promise<AcceptInvitationOutputDto> {
    try {
      // Validate input
      if (!input.organizationId) {
        return {
          success: false,
          message: 'Organization ID is required',
          organizationId: '',
        };
      }

      // Call repository to accept the invitation
      const organizationId = await this.userRepository.acceptInvitation(input.organizationId);

      // Return success response
      return {
        success: true,
        message: 'Invitation accepted successfully',
        organizationId,
      };
    } catch (error) {
      // Return failure response
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to accept invitation',
        organizationId: input.organizationId,
      };
    }
  }
}
