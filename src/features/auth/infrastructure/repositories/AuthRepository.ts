import { IAuthRepository } from '../../domain/interfaces/IAuthRepository';
import { AuthApiClient } from '../api/AuthApiClient';

export class AuthRepository implements IAuthRepository {
  private authApiClient: AuthApiClient;

  constructor() {
    this.authApiClient = new AuthApiClient();
  }

  async signup(
    email: string,
    firstName: string,
    lastName: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await this.authApiClient.signup(email, firstName, lastName);

      if (!response.success) {
        throw new Error(response.message);
      }

      return {
        success: true,
        message: response.message,
      };
    } catch (error) {
      throw error;
    }
  }

  async login(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await this.authApiClient.login(email);

      if (!response.success) {
        throw new Error(response.message);
      }

      return {
        success: true,
        message: response.message,
      };
    } catch (error) {
      throw error;
    }
  }

  async verifyOtp(
    email: string,
    otp: string
  ): Promise<{
    success: boolean;
    message: string;
    token?: string;
    user?: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      role: string;
    };
  }> {
    try {
      const response = await this.authApiClient.verifyOtp(email, otp);

      if (!response.success) {
        throw new Error(response.message);
      }

      return {
        success: true,
        message: response.message,
        token: response.token,
        user: response.user,
      };
    } catch (error) {
      throw error;
    }
  }

  async resendOtp(email: string): Promise<{
    success: boolean;
    message: string;
    attemptsRemaining?: number;
    cooldownSeconds?: number;
  }> {
    try {
      const response = await this.authApiClient.resendOtp(email);

      if (!response.success) {
        throw new Error(response.message);
      }

      return {
        success: true,
        message: response.message,
        attemptsRemaining: response.attemptsRemaining,
        cooldownSeconds: response.cooldownSeconds,
      };
    } catch (error) {
      throw error;
    }
  }

  async refreshToken(): Promise<{
    success: boolean;
    message: string;
    token?: string;
    user?: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      role: string;
    };
  }> {
    try {
      const response = await this.authApiClient.refreshToken();

      if (!response.success) {
        throw new Error(response.message);
      }

      return {
        success: true,
        message: response.message,
        token: response.token,
        user: response.user,
      };
    } catch (error) {
      throw error;
    }
  }

  async logout(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await this.authApiClient.logout();

      if (!response.success) {
        throw new Error(response.message);
      }

      return {
        success: true,
        message: response.message,
      };
    } catch (error) {
      throw error;
    }
  }
}
