import { IAuthRepository } from '../../domain/interfaces/IAuthRepository';
import { RefreshTokenInputDto, RefreshTokenOutputDto } from '../dtos/RefreshTokenDto';

export class RefreshTokenUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(input: RefreshTokenInputDto): Promise<RefreshTokenOutputDto> {
    try {
      const response = await this.authRepository.refreshToken();

      return {
        success: true,
        message: response.message || 'Token refreshed successfully',
        token: response.token,
        user: response.user,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to refresh token',
        token: undefined,
        user: undefined,
      };
    }
  }
}
