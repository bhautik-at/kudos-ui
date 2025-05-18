import { VerifyOtpUseCase } from './VerifyOtpUseCase';
import { IAuthRepository } from '../../domain/interfaces/IAuthRepository';
import { VerifyOtpInputDto } from '../dtos/VerifyOtpDto';

describe('VerifyOtpUseCase', () => {
  let authRepository: IAuthRepository;
  let verifyOtpUseCase: VerifyOtpUseCase;
  
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
    
    verifyOtpUseCase = new VerifyOtpUseCase(authRepository);
  });
  
  it('should successfully verify OTP and return success response', async () => {
    // Arrange
    const inputDto: VerifyOtpInputDto = {
      email: 'test@example.com',
      otp: '123456'
    };
    
    const mockResponse = {
      success: true,
      message: 'Authentication successful',
      token: 'jwt-token-123',
      user: {
        id: 'user-123',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: 'user'
      }
    };
    
    (authRepository.verifyOtp as jest.Mock).mockResolvedValue(mockResponse);
    
    // Act
    const result = await verifyOtpUseCase.execute(inputDto);
    
    // Assert
    expect(authRepository.verifyOtp).toHaveBeenCalledWith(inputDto.email, inputDto.otp);
    expect(result).toEqual({
      success: true,
      message: mockResponse.message,
      token: mockResponse.token,
      user: mockResponse.user
    });
  });
  
  it('should use default success message if none provided by repository', async () => {
    // Arrange
    const inputDto: VerifyOtpInputDto = {
      email: 'test@example.com',
      otp: '123456'
    };
    
    const mockResponse = {
      success: true,
      token: 'jwt-token-123',
      user: {
        id: 'user-123',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: 'user'
      }
    };
    
    (authRepository.verifyOtp as jest.Mock).mockResolvedValue(mockResponse);
    
    // Act
    const result = await verifyOtpUseCase.execute(inputDto);
    
    // Assert
    expect(result).toEqual({
      success: true,
      message: 'Authentication successful',
      token: mockResponse.token,
      user: mockResponse.user
    });
  });
  
  it('should handle errors and return failure response', async () => {
    // Arrange
    const inputDto: VerifyOtpInputDto = {
      email: 'test@example.com',
      otp: '123456'
    };
    
    const mockError = new Error('Invalid OTP');
    (authRepository.verifyOtp as jest.Mock).mockRejectedValue(mockError);
    
    // Act
    const result = await verifyOtpUseCase.execute(inputDto);
    
    // Assert
    expect(authRepository.verifyOtp).toHaveBeenCalledWith(inputDto.email, inputDto.otp);
    expect(result).toEqual({
      success: false,
      message: mockError.message
    });
  });
  
  it('should handle errors without message property', async () => {
    // Arrange
    const inputDto: VerifyOtpInputDto = {
      email: 'test@example.com',
      otp: '123456'
    };
    
    (authRepository.verifyOtp as jest.Mock).mockRejectedValue({});
    
    // Act
    const result = await verifyOtpUseCase.execute(inputDto);
    
    // Assert
    expect(result).toEqual({
      success: false,
      message: 'Failed to verify OTP'
    });
  });
}); 