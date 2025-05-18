import { AuthApiClient } from './AuthApiClient';
import { httpService } from '@/shared/services/http/HttpService';
import { HttpError } from '@/shared/services/http/HttpError';

// Mock the HttpService
jest.mock('@/shared/services/http/HttpService', () => ({
  httpService: {
    post: jest.fn(),
  },
}));

describe('AuthApiClient', () => {
  let authApiClient: AuthApiClient;

  beforeEach(() => {
    authApiClient = new AuthApiClient();
    jest.clearAllMocks();
  });

  describe('signup', () => {
    it('should return success response when signup API call succeeds', async () => {
      // Arrange
      const mockResponse = {
        data: {
          success: true,
          message: 'OTP sent to your email',
        },
      };

      (httpService.post as jest.Mock).mockResolvedValue(mockResponse);

      // Act
      const result = await authApiClient.signup('test@example.com', 'Test', 'User');

      // Assert
      expect(httpService.post).toHaveBeenCalledWith(
        'api/auth/signup',
        { email: 'test@example.com', firstName: 'Test', lastName: 'User' },
        { withCredentials: true }
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('should throw error with API message when signup API returns an error', async () => {
      // Arrange
      const errorMessage = 'Email already registered';
      const httpError = new HttpError(400, 'Bad Request', 'api/auth/signup', {
        message: errorMessage,
      });

      (httpService.post as jest.Mock).mockRejectedValue(httpError);

      // Act & Assert
      await expect(authApiClient.signup('test@example.com', 'Test', 'User')).rejects.toThrow(
        errorMessage
      );
      expect(httpService.post).toHaveBeenCalledWith(
        'api/auth/signup',
        { email: 'test@example.com', firstName: 'Test', lastName: 'User' },
        { withCredentials: true }
      );
    });

    it('should throw default error message when API error has no message', async () => {
      // Arrange
      const httpError = new HttpError(500, 'Internal Server Error', 'api/auth/signup');

      (httpService.post as jest.Mock).mockRejectedValue(httpError);

      // Act & Assert
      await expect(authApiClient.signup('test@example.com', 'Test', 'User')).rejects.toThrow(
        'Failed to signup'
      );
    });
  });

  describe('login', () => {
    it('should return success response when login API call succeeds', async () => {
      // Arrange
      const mockResponse = {
        data: {
          success: true,
          message: 'OTP sent to your email',
        },
      };

      (httpService.post as jest.Mock).mockResolvedValue(mockResponse);

      // Act
      const result = await authApiClient.login('test@example.com');

      // Assert
      expect(httpService.post).toHaveBeenCalledWith(
        'api/auth/login',
        { email: 'test@example.com' },
        { withCredentials: true }
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('should throw error with API message when login API returns an error', async () => {
      // Arrange
      const errorMessage = 'User not found';
      const httpError = new HttpError(400, 'Bad Request', 'api/auth/login', {
        message: errorMessage,
      });

      (httpService.post as jest.Mock).mockRejectedValue(httpError);

      // Act & Assert
      await expect(authApiClient.login('test@example.com')).rejects.toThrow(
        errorMessage
      );
    });
  });

  describe('verifyOtp', () => {
    it('should return success response when verifyOtp API call succeeds', async () => {
      // Arrange
      const mockResponse = {
        data: {
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
        },
      };

      (httpService.post as jest.Mock).mockResolvedValue(mockResponse);

      // Act
      const result = await authApiClient.verifyOtp('test@example.com', '123456');

      // Assert
      expect(httpService.post).toHaveBeenCalledWith(
        'api/auth/verify-otp',
        { email: 'test@example.com', otp: '123456' },
        { withCredentials: true }
      );
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('resendOtp', () => {
    it('should return success response when resendOtp API call succeeds', async () => {
      // Arrange
      const mockResponse = {
        data: {
          success: true,
          message: 'OTP resent to your email',
          attemptsRemaining: 2,
          cooldownSeconds: 0
        },
      };

      (httpService.post as jest.Mock).mockResolvedValue(mockResponse);

      // Act
      const result = await authApiClient.resendOtp('test@example.com');

      // Assert
      expect(httpService.post).toHaveBeenCalledWith(
        'api/auth/resend-otp',
        { email: 'test@example.com' },
        { withCredentials: true }
      );
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('refreshToken', () => {
    it('should return success response when refreshToken API call succeeds', async () => {
      // Arrange
      const mockResponse = {
        data: {
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
        },
      };

      (httpService.post as jest.Mock).mockResolvedValue(mockResponse);

      // Act
      const result = await authApiClient.refreshToken();

      // Assert
      expect(httpService.post).toHaveBeenCalledWith(
        'api/auth/refresh-token',
        {},
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
          }
        }
      );
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('logout', () => {
    it('should return success response when logout API call succeeds', async () => {
      // Arrange
      const mockResponse = {
        data: {
          success: true,
          message: 'Logged out successfully',
        },
      };

      (httpService.post as jest.Mock).mockResolvedValue(mockResponse);

      // Act
      const result = await authApiClient.logout();

      // Assert
      expect(httpService.post).toHaveBeenCalledWith(
        'api/auth/logout',
        {},
        { withCredentials: true }
      );
      expect(result).toEqual(mockResponse.data);
    });
  });
}); 