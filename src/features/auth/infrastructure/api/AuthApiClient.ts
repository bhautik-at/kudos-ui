import { httpService } from '@/shared/services/http/HttpService';
import { HttpError } from '@/shared/services/http/HttpError';

interface AuthResponse {
  success: boolean;
  message: string;
}

interface VerifyOtpResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: any;
}

interface ResendOtpResponse {
  success: boolean;
  message: string;
  attemptsRemaining?: number;
  cooldownSeconds?: number;
}

export class AuthApiClient {
  private baseUrl = 'api/auth'; // Auth API path

  async signup(email: string, firstName: string, lastName: string): Promise<AuthResponse> {
    try {
      const response = await httpService.post<AuthResponse>(
        `${this.baseUrl}/signup`,
        { email, firstName, lastName },
        { withCredentials: true }
      );

      return response.data;
    } catch (error) {
      if (error instanceof HttpError) {
        throw new Error(error.data?.message || 'Failed to signup');
      }
      throw error;
    }
  }

  async login(email: string): Promise<AuthResponse> {
    try {
      const response = await httpService.post<AuthResponse>(
        `${this.baseUrl}/login`,
        { email },
        { withCredentials: true }
      );

      return response.data;
    } catch (error) {
      if (error instanceof HttpError) {
        throw new Error(error.data?.message || 'Failed to login');
      }
      throw error;
    }
  }

  async verifyOtp(email: string, otp: string): Promise<VerifyOtpResponse> {
    try {
      console.log('AuthApiClient: Verifying OTP for email:', email);
      const response = await httpService.post<VerifyOtpResponse>(
        `${this.baseUrl}/verify-otp`,
        { email, otp },
        { withCredentials: true }
      );

      console.log('AuthApiClient: OTP verification response:', response.data);
      return response.data;
    } catch (error) {
      console.error('AuthApiClient: Error verifying OTP:', error);
      if (error instanceof HttpError) {
        throw new Error(error.data?.message || 'Failed to verify OTP');
      }
      throw error;
    }
  }

  async resendOtp(email: string): Promise<ResendOtpResponse> {
    try {
      const response = await httpService.post<ResendOtpResponse>(
        `${this.baseUrl}/resend-otp`,
        { email },
        { withCredentials: true }
      );

      return response.data;
    } catch (error) {
      if (error instanceof HttpError) {
        throw new Error(error.data?.message || 'Failed to resend OTP');
      }
      throw error;
    }
  }

  async refreshToken(): Promise<VerifyOtpResponse> {
    try {
      console.log('AuthApiClient: Refreshing token');
      const response = await httpService.post<VerifyOtpResponse>(
        `${this.baseUrl}/refresh-token`,
        {},
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          }
        }
      );

      console.log('AuthApiClient: Token refresh response:', response.data);
      return response.data;
    } catch (error) {
      console.error('AuthApiClient: Error refreshing token:', error);
      if (error instanceof HttpError) {
        throw new Error(error.data?.message || 'Failed to refresh token');
      }
      throw error;
    }
  }

  async logout(): Promise<AuthResponse> {
    try {
      const response = await httpService.post<AuthResponse>(
        `${this.baseUrl}/logout`,
        {},
        { withCredentials: true }
      );

      return response.data;
    } catch (error) {
      if (error instanceof HttpError) {
        throw new Error(error.data?.message || 'Failed to logout');
      }
      throw error;
    }
  }
}
