import { AuthRepository } from './AuthRepository';
import { AuthApiClient } from '../api/AuthApiClient';

// Mock the AuthApiClient
jest.mock('../api/AuthApiClient');

describe('AuthRepository', () => {
  let authRepository: AuthRepository;
  let mockAuthApiClient: jest.Mocked<AuthApiClient>;

  beforeEach(() => {
    // Clear all mocks and create a new instance for each test
    jest.clearAllMocks();

    // Setup the mock instance that will be returned by the constructor
    mockAuthApiClient = new AuthApiClient() as jest.Mocked<AuthApiClient>;
    (AuthApiClient as jest.MockedClass<typeof AuthApiClient>).mockImplementation(() => mockAuthApiClient);
    
    // Create the repository
    authRepository = new AuthRepository();
  });

  describe('signup', () => {
    it('should return success response when signup succeeds', async () => {
      // Arrange
      const mockResponse = {
        success: true,
        message: 'OTP sent to your email',
      };

      mockAuthApiClient.signup.mockResolvedValue(mockResponse);

      // Act
      const result = await authRepository.signup('test@example.com', 'Test', 'User');

      // Assert
      expect(mockAuthApiClient.signup).toHaveBeenCalledWith('test@example.com', 'Test', 'User');
      expect(result).toEqual({
        success: true,
        message: mockResponse.message,
      });
    });

    it('should throw error when signup fails with error response', async () => {
      // Arrange
      const mockResponse = {
        success: false,
        message: 'Email already exists',
      };

      mockAuthApiClient.signup.mockResolvedValue(mockResponse);

      // Act & Assert
      await expect(authRepository.signup('test@example.com', 'Test', 'User')).rejects.toThrow(
        mockResponse.message
      );
      expect(mockAuthApiClient.signup).toHaveBeenCalledWith('test@example.com', 'Test', 'User');
    });

    it('should propagate errors from the API client', async () => {
      // Arrange
      const error = new Error('Network error');
      mockAuthApiClient.signup.mockRejectedValue(error);

      // Act & Assert
      await expect(authRepository.signup('test@example.com', 'Test', 'User')).rejects.toThrow(error);
    });
  });

  describe('login', () => {
    it('should return success response when login succeeds', async () => {
      // Arrange
      const mockResponse = {
        success: true,
        message: 'OTP sent to your email',
      };

      mockAuthApiClient.login.mockResolvedValue(mockResponse);

      // Act
      const result = await authRepository.login('test@example.com');

      // Assert
      expect(mockAuthApiClient.login).toHaveBeenCalledWith('test@example.com');
      expect(result).toEqual({
        success: true,
        message: mockResponse.message,
      });
    });

    it('should throw error when login fails with error response', async () => {
      // Arrange
      const mockResponse = {
        success: false,
        message: 'User not found',
      };

      mockAuthApiClient.login.mockResolvedValue(mockResponse);

      // Act & Assert
      await expect(authRepository.login('test@example.com')).rejects.toThrow(
        mockResponse.message
      );
    });
  });

  describe('verifyOtp', () => {
    it('should return success response when verifyOtp succeeds', async () => {
      // Arrange
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

      mockAuthApiClient.verifyOtp.mockResolvedValue(mockResponse);

      // Act
      const result = await authRepository.verifyOtp('test@example.com', '123456');

      // Assert
      expect(mockAuthApiClient.verifyOtp).toHaveBeenCalledWith('test@example.com', '123456');
      expect(result).toEqual({
        success: true,
        message: mockResponse.message,
        token: mockResponse.token,
        user: mockResponse.user
      });
    });
  });

  describe('resendOtp', () => {
    it('should return success response when resendOtp succeeds', async () => {
      // Arrange
      const mockResponse = {
        success: true,
        message: 'OTP resent to your email',
        attemptsRemaining: 2,
        cooldownSeconds: 0
      };

      mockAuthApiClient.resendOtp.mockResolvedValue(mockResponse);

      // Act
      const result = await authRepository.resendOtp('test@example.com');

      // Assert
      expect(mockAuthApiClient.resendOtp).toHaveBeenCalledWith('test@example.com');
      expect(result).toEqual({
        success: true,
        message: mockResponse.message,
        attemptsRemaining: mockResponse.attemptsRemaining,
        cooldownSeconds: mockResponse.cooldownSeconds
      });
    });
  });

  describe('refreshToken', () => {
    it('should return success response when refreshToken succeeds', async () => {
      // Arrange
      const mockResponse = {
        success: true,
        message: 'Token refreshed successfully',
        token: 'new-jwt-token-456',
        user: {
          id: 'user-123',
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          role: 'user'
        }
      };

      mockAuthApiClient.refreshToken.mockResolvedValue(mockResponse);

      // Act
      const result = await authRepository.refreshToken();

      // Assert
      expect(mockAuthApiClient.refreshToken).toHaveBeenCalled();
      expect(result).toEqual({
        success: true,
        message: mockResponse.message,
        token: mockResponse.token,
        user: mockResponse.user
      });
    });
  });

  describe('logout', () => {
    it('should return success response when logout succeeds', async () => {
      // Arrange
      const mockResponse = {
        success: true,
        message: 'Logged out successfully',
      };

      mockAuthApiClient.logout.mockResolvedValue(mockResponse);

      // Act
      const result = await authRepository.logout();

      // Assert
      expect(mockAuthApiClient.logout).toHaveBeenCalled();
      expect(result).toEqual({
        success: true,
        message: mockResponse.message,
      });
    });
  });
}); 