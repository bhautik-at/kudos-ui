import { LoginUseCase } from './LoginUseCase';
import { IAuthRepository } from '../../domain/interfaces/IAuthRepository';
import { LoginInputDto } from '../dtos/LoginDto';

describe('LoginUseCase', () => {
  let authRepository: IAuthRepository;
  let loginUseCase: LoginUseCase;
  
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
    
    loginUseCase = new LoginUseCase(authRepository);
  });
  
  it('should successfully login and return success response', async () => {
    // Arrange
    const inputDto: LoginInputDto = {
      email: 'test@example.com'
    };
    
    const mockResponse = {
      success: true,
      message: 'OTP sent successfully'
    };
    
    (authRepository.login as jest.Mock).mockResolvedValue(mockResponse);
    
    // Act
    const result = await loginUseCase.execute(inputDto);
    
    // Assert
    expect(authRepository.login).toHaveBeenCalledWith(inputDto.email);
    expect(result).toEqual({
      success: true,
      email: inputDto.email,
      message: mockResponse.message
    });
  });
  
  it('should handle errors and return failure response', async () => {
    // Arrange
    const inputDto: LoginInputDto = {
      email: 'test@example.com'
    };
    
    const mockError = new Error('User not found');
    (authRepository.login as jest.Mock).mockRejectedValue(mockError);
    
    // Act
    const result = await loginUseCase.execute(inputDto);
    
    // Assert
    expect(authRepository.login).toHaveBeenCalledWith(inputDto.email);
    expect(result).toEqual({
      success: false,
      email: inputDto.email,
      message: mockError.message
    });
  });
  
  it('should handle errors without message property', async () => {
    // Arrange
    const inputDto: LoginInputDto = {
      email: 'test@example.com'
    };
    
    (authRepository.login as jest.Mock).mockRejectedValue({});
    
    // Act
    const result = await loginUseCase.execute(inputDto);
    
    // Assert
    expect(result).toEqual({
      success: false,
      email: inputDto.email,
      message: 'Failed to initiate login'
    });
  });
}); 