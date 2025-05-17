export interface IAuthRepository {
  signup(
    email: string,
    firstName: string,
    lastName: string
  ): Promise<{
    success: boolean;
    message: string;
  }>;

  login(email: string): Promise<{
    success: boolean;
    message: string;
  }>;

  verifyOtp(
    email: string,
    otp: string
  ): Promise<{
    success: boolean;
    message: string;
    token?: string;
    user?: any;
  }>;

  resendOtp(email: string): Promise<{
    success: boolean;
    message: string;
    attemptsRemaining?: number;
    cooldownSeconds?: number;
  }>;

  refreshToken(): Promise<{
    success: boolean;
    message: string;
    token?: string;
    user?: any;
  }>;

  logout(): Promise<{
    success: boolean;
    message: string;
  }>;
}
