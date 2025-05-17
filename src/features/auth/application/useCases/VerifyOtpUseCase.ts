import { IAuthRepository } from '../../domain/interfaces/IAuthRepository';
import { VerifyOtpInputDto, VerifyOtpOutputDto } from '../dtos/VerifyOtpDto';

export class VerifyOtpUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(input: VerifyOtpInputDto): Promise<VerifyOtpOutputDto> {
    try {
      const response = await this.authRepository.verifyOtp(input.email, input.otp);

      return {
        success: true,
        message: response.message || 'Authentication successful',
        token: response.token,
        user: response.user,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to verify OTP',
      };
    }
  }
}
