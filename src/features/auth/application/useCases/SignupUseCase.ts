import { IAuthRepository } from '../../domain/interfaces/IAuthRepository';
import { SignupInputDto, SignupOutputDto } from '../dtos/SignupDto';

export class SignupUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(input: SignupInputDto): Promise<SignupOutputDto> {
    try {
      const response = await this.authRepository.signup(
        input.email,
        input.firstName,
        input.lastName
      );

      return {
        success: true,
        email: input.email,
        message: response.message,
      };
    } catch (error: any) {
      return {
        success: false,
        email: input.email,
        message: error.message || 'Failed to initiate signup',
      };
    }
  }
}
