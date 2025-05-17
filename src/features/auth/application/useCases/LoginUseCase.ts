import { IAuthRepository } from '../../domain/interfaces/IAuthRepository';
import { LoginInputDto, LoginOutputDto } from '../dtos/LoginDto';

export class LoginUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(input: LoginInputDto): Promise<LoginOutputDto> {
    try {
      const response = await this.authRepository.login(input.email);

      return {
        success: true,
        email: input.email,
        message: response.message,
      };
    } catch (error: any) {
      return {
        success: false,
        email: input.email,
        message: error.message || 'Failed to initiate login',
      };
    }
  }
}
