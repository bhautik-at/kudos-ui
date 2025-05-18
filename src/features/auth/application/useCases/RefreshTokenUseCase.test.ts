import { RefreshTokenUseCase } from './RefreshTokenUseCase';
import { IAuthRepository } from '../../domain/interfaces/IAuthRepository';
import { RefreshTokenInputDto } from '../dtos/RefreshTokenDto';

describe('RefreshTokenUseCase', () => {
  let authRepository: IAuthRepository;
  let refreshTokenUseCase: RefreshTokenUseCase;
  
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
    
    refreshTokenUseCase = new RefreshTokenUseCase(authRepository);
  });
  
  it('should successfully refresh token and return success response', async () => {
    // Arrange
    const inputDto: RefreshTokenInputDto = {};
    
    const mockResponse = {
      success: true,
      message: 'Token refreshed successfully',
      token: 'new-token-123',
      user: {
        id: 'user-123',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: 'user'
      }
    };
    
    (authRepository.refreshToken as jest.Mock).mockResolvedValue(mockResponse);
    
    // Act
    const result = await refreshTokenUseCase.execute(inputDto);
    
    // Assert
    expect(authRepository.refreshToken).toHaveBeenCalled();
    expect(result).toEqual({
      success: true,
      message: mockResponse.message,
      token: mockResponse.token,
      user: mockResponse.user
    });
  });
  
  it('should use default success message if none provided by repository', async () => {
    // Arrange
    const inputDto: RefreshTokenInputDto = {};
    
    const mockResponse = {
      success: true,
      token: 'new-token-123',
      user: {
        id: 'user-123',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: 'user'
      }
    };
    
    (authRepository.refreshToken as jest.Mock).mockResolvedValue(mockResponse);
    
    // Act
    const result = await refreshTokenUseCase.execute(inputDto);
    
    // Assert
    expect(result).toEqual({
      success: true,
      message: 'Token refreshed successfully',
      token: mockResponse.token,
      user: mockResponse.user
    });
  });
  
  it('should handle errors and return failure response', async () => {
    // Arrange
    const inputDto: RefreshTokenInputDto = {};
    
    const mockError = new Error('Token expired');
    (authRepository.refreshToken as jest.Mock).mockRejectedValue(mockError);
    
    // Act
    const result = await refreshTokenUseCase.execute(inputDto);
    
    // Assert
    expect(authRepository.refreshToken).toHaveBeenCalled();
    expect(result).toEqual({
      success: false,
      message: mockError.message,
      token: undefined,
      user: undefined
    });
  });
  
  it('should handle errors without message property', async () => {
    // Arrange
    const inputDto: RefreshTokenInputDto = {};
    
    (authRepository.refreshToken as jest.Mock).mockRejectedValue({});
    
    // Act
    const result = await refreshTokenUseCase.execute(inputDto);
    
    // Assert
    expect(result).toEqual({
      success: false,
      message: 'Failed to refresh token',
      token: undefined,
      user: undefined
    });
  });
}); 