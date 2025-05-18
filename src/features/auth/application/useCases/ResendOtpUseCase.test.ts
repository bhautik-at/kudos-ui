import { ResendOtpUseCase } from './ResendOtpUseCase';
import { IAuthRepository } from '../../domain/interfaces/IAuthRepository';
import { ResendOtpInputDto } from '../dtos/ResendOtpDto';

describe('ResendOtpUseCase', () => {
  let authRepository: IAuthRepository;
  let resendOtpUseCase: ResendOtpUseCase;
  
  beforeEach(() => {
    // Create a mock implementation of IAuthRepository
    authRepository = {
      login: jest.fn(),
      signup: jest.fn(),
      verifyOtp: jest.fn(),
      resendOtp: jest.fn(),
      refreshToken: jest.fn(),
      logout: jest.fn(),
    };
    
    resendOtpUseCase = new ResendOtpUseCase(authRepository);
  });
  
  it('should successfully resend OTP and return success response', async () => {
    // Arrange
    const inputDto: ResendOtpInputDto = {
      email: 'test@example.com'
    };
    
    const mockResponse = {
      success: true,
      message: 'OTP sent to your email',
      attemptsRemaining: 3,
      cooldownSeconds: 0
    };
    
    (authRepository.resendOtp as jest.Mock).mockResolvedValue(mockResponse);
    
    // Act
    const result = await resendOtpUseCase.execute(inputDto);
    
    // Assert
    expect(authRepository.resendOtp).toHaveBeenCalledWith(inputDto.email);
    expect(result).toEqual({
      success: true,
      message: mockResponse.message,
      attemptsRemaining: mockResponse.attemptsRemaining,
      cooldownSeconds: mockResponse.cooldownSeconds
    });
  });
  
  it('should use default success message if none provided by repository', async () => {
    // Arrange
    const inputDto: ResendOtpInputDto = {
      email: 'test@example.com'
    };
    
    const mockResponse = {
      success: true,
      attemptsRemaining: 3,
      cooldownSeconds: 0
    };
    
    (authRepository.resendOtp as jest.Mock).mockResolvedValue(mockResponse);
    
    // Act
    const result = await resendOtpUseCase.execute(inputDto);
    
    // Assert
    expect(result).toEqual({
      success: true,
      message: 'OTP resent successfully',
      attemptsRemaining: mockResponse.attemptsRemaining,
      cooldownSeconds: mockResponse.cooldownSeconds
    });
  });
  
  it('should handle errors and return failure response', async () => {
    // Arrange
    const inputDto: ResendOtpInputDto = {
      email: 'test@example.com'
    };
    
    const mockError = new Error('Too many attempts');
    (authRepository.resendOtp as jest.Mock).mockRejectedValue(mockError);
    
    // Act
    const result = await resendOtpUseCase.execute(inputDto);
    
    // Assert
    expect(authRepository.resendOtp).toHaveBeenCalledWith(inputDto.email);
    expect(result).toEqual({
      success: false,
      message: mockError.message
    });
  });
  
  it('should handle errors without message property', async () => {
    // Arrange
    const inputDto: ResendOtpInputDto = {
      email: 'test@example.com'
    };
    
    (authRepository.resendOtp as jest.Mock).mockRejectedValue({});
    
    // Act
    const result = await resendOtpUseCase.execute(inputDto);
    
    // Assert
    expect(result).toEqual({
      success: false,
      message: 'Failed to resend OTP'
    });
  });
}); 