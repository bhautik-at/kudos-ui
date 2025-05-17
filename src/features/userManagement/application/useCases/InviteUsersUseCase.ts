import { IUserManagementRepository } from '../../domain/interfaces/IUserManagementRepository';
import { InviteUsersInputDto, InviteUsersResultDto } from '../dtos/UserManagementDtos';
import { UserInvitationError } from '../../domain/errors/UserManagementError';

export class InviteUsersUseCase {
  constructor(private userManagementRepository: IUserManagementRepository) {}

  async execute(inputDto: InviteUsersInputDto): Promise<InviteUsersResultDto> {
    // Validate emails
    if (!inputDto.emails || inputDto.emails.length === 0) {
      throw new UserInvitationError('No emails provided');
    }

    // Filter out invalid emails
    const validEmails = inputDto.emails.filter(email => this.isValidEmail(email));

    if (validEmails.length === 0) {
      throw new UserInvitationError('No valid emails provided');
    }

    try {
      const invitedCount = await this.userManagementRepository.inviteUsers(
        validEmails,
        inputDto.organizationId
      );

      return {
        invitedCount,
      };
    } catch (error) {
      throw new UserInvitationError(
        error instanceof Error ? error.message : 'Failed to invite users'
      );
    }
  }

  private isValidEmail(email: string): boolean {
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
