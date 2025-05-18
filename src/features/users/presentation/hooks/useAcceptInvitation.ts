import { useState } from 'react';
import { AcceptInvitationUseCase } from '../../application/useCases/AcceptInvitationUseCase';
import { UserRepository } from '../../infrastructure/repositories/UserRepository';
import { AcceptInvitationInputDto } from '../../application/dtos/AcceptInvitationInputDto';
import { AcceptInvitationOutputDto } from '../../application/dtos/AcceptInvitationOutputDto';

export const useAcceptInvitation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AcceptInvitationOutputDto | null>(null);

  const acceptInvitation = async (organizationId: string): Promise<AcceptInvitationOutputDto> => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Create dependencies
      const userRepository = new UserRepository();
      const acceptInvitationUseCase = new AcceptInvitationUseCase(userRepository);

      // Create input DTO
      const input: AcceptInvitationInputDto = { organizationId };

      // Execute use case
      const outputDto = await acceptInvitationUseCase.execute(input);

      // Handle response
      if (!outputDto.success) {
        setError(outputDto.message);
      } else {
        setResult(outputDto);
      }

      return outputDto;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'An unexpected error occurred while accepting the invitation';

      setError(errorMessage);

      return {
        success: false,
        message: errorMessage,
        organizationId,
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    acceptInvitation,
    loading,
    error,
    result,
  };
};
