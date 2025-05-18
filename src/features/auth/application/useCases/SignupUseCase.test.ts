import { SignupUseCase } from './SignupUseCase';
import { IAuthRepository } from '../../domain/interfaces/IAuthRepository';
import { SignupInputDto } from '../dtos/SignupDto';

describe('SignupUseCase', () => {
  let authRepository: IAuthRepository;
  let signupUseCase: SignupUseCase;
  
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
    
    signupUseCase = new SignupUseCase(authRepository);
  });
  
  it('should successfully signup and return success response', async () => {
    // Arrange
    const inputDto: SignupInputDto = {
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User'
    };
    
    const mockResponse = {
      success: true,
      message: 'OTP sent successfully'
    };
    
    (authRepository.signup as jest.Mock).mockResolvedValue(mockResponse);
    
    // Act
    const result = await signupUseCase.execute(inputDto);
    
    // Assert
    expect(authRepository.signup).toHaveBeenCalledWith(
      inputDto.email,
      inputDto.firstName,
      inputDto.lastName
    );
    expect(result).toEqual({
      success: true,
      email: inputDto.email,
      message: mockResponse.message
    });
  });
  
  it('should handle errors and return failure response', async () => {
    // Arrange
    const inputDto: SignupInputDto = {
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User'
    };
    
    const mockError = new Error('Email already exists');
    (authRepository.signup as jest.Mock).mockRejectedValue(mockError);
    
    // Act
    const result = await signupUseCase.execute(inputDto);
    
    // Assert
    expect(authRepository.signup).toHaveBeenCalledWith(
      inputDto.email,
      inputDto.firstName,
      inputDto.lastName
    );
    expect(result).toEqual({
      success: false,
      email: inputDto.email,
      message: mockError.message
    });
  });
  
  it('should handle errors without message property', async () => {
    // Arrange
    const inputDto: SignupInputDto = {
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User'
    };
    
    (authRepository.signup as jest.Mock).mockRejectedValue({});
    
    // Act
    const result = await signupUseCase.execute(inputDto);
    
    // Assert
    expect(result).toEqual({
      success: false,
      email: inputDto.email,
      message: 'Failed to initiate signup'
    });
  });
}); 