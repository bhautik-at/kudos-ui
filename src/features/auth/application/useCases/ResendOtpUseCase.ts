import { IAuthRepository } from '../../domain/interfaces/IAuthRepository';
import { ResendOtpInputDto, ResendOtpOutputDto } from '../dtos/ResendOtpDto';

export class ResendOtpUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(input: ResendOtpInputDto): Promise<ResendOtpOutputDto> {
    try {
      const response = await this.authRepository.resendOtp(input.email);

      return {
        success: true,
        message: response.message || 'OTP resent successfully',
        attemptsRemaining: response.attemptsRemaining,
        cooldownSeconds: response.cooldownSeconds,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to resend OTP',
      };
    }
  }
}
