import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { AuthRepository } from '../../infrastructure/repositories/AuthRepository';
import { SignupUseCase } from '../../application/useCases/SignupUseCase';
import { LoginUseCase } from '../../application/useCases/LoginUseCase';
import { VerifyOtpUseCase } from '../../application/useCases/VerifyOtpUseCase';
import { ResendOtpUseCase } from '../../application/useCases/ResendOtpUseCase';
import { RefreshTokenUseCase } from '../../application/useCases/RefreshTokenUseCase';
import { httpService } from '@/shared/services/http/HttpService';

// Define basic auth-related interfaces
interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface AuthContextProps {
  isAuthLoading: boolean;
  error: string | null;
  awaitingOtpVerification: boolean;
  currentEmail: string;
  isSignup: boolean;
  signup: (
    email: string,
    firstName: string,
    lastName: string
  ) => Promise<{ success: boolean; message: string }>;
  login: (email: string) => Promise<{ success: boolean; message: string }>;
  verifyOtp: (
    email: string,
    otp: string
  ) => Promise<{
    success: boolean;
    message: string;
    token?: string;
    user?: AuthUser;
  }>;
  resendOtp: (email: string) => Promise<{
    success: boolean;
    message: string;
    attemptsRemaining?: number;
    cooldownSeconds?: number;
  }>;
  refreshToken: () => Promise<{
    success: boolean;
    message: string;
    token?: string;
  }>;
  logout: () => Promise<void>;
  clearError: () => void;
  setCurrentEmail: (email: string) => void;
  setIsSignup: (isSignup: boolean) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [awaitingOtpVerification, setAwaitingOtpVerification] = useState<boolean>(false);
  const [currentEmail, setCurrentEmail] = useState<string>('');
  const [isSignup, setIsSignup] = useState<boolean>(false);

  const authRepository = new AuthRepository();
  const signupUseCase = new SignupUseCase(authRepository);
  const loginUseCase = new LoginUseCase(authRepository);
  const verifyOtpUseCase = new VerifyOtpUseCase(authRepository);
  const resendOtpUseCase = new ResendOtpUseCase(authRepository);
  const refreshTokenUseCase = new RefreshTokenUseCase(authRepository);

  // Check authentication status on initial load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Just set loading to false - we'll let UserContext determine auth status
        // by fetching the user profile
        setIsAuthLoading(false);
      } catch (error) {
        setError('Failed to check authentication status');
        setIsAuthLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const signup = async (email: string, firstName: string, lastName: string) => {
    setError(null);
    setIsAuthLoading(true);
    try {
      const result = await signupUseCase.execute({ email, firstName, lastName });

      if (result.success) {
        setAwaitingOtpVerification(true);
        setCurrentEmail(email);
        setIsSignup(true);
      } else {
        setError(result.message);
      }

      setIsAuthLoading(false);
      return result;
    } catch (error: any) {
      setError(error.message || 'Failed to sign up');
      setIsAuthLoading(false);
      return { success: false, message: error.message || 'Failed to sign up' };
    }
  };

  const login = async (email: string) => {
    setError(null);
    setIsAuthLoading(true);
    try {
      const result = await loginUseCase.execute({ email });

      if (result.success) {
        setAwaitingOtpVerification(true);
        setCurrentEmail(email);
        setIsSignup(false);
      } else {
        setError(result.message);
      }

      setIsAuthLoading(false);
      return result;
    } catch (error: any) {
      setError(error.message || 'Failed to log in');
      setIsAuthLoading(false);
      return { success: false, message: error.message || 'Failed to log in' };
    }
  };

  const verifyOtp = async (email: string, otp: string) => {
    setError(null);
    setIsAuthLoading(true);
    try {
      const result = await verifyOtpUseCase.execute({ email, otp });

      if (result.success && result.token) {
        setAwaitingOtpVerification(false);
      } else {
        setError(result.message);
      }

      setIsAuthLoading(false);
      return result;
    } catch (error: any) {
      setError(error.message || 'Failed to verify OTP');
      setIsAuthLoading(false);
      return { success: false, message: error.message || 'Failed to verify OTP' };
    }
  };

  const resendOtp = async (email: string) => {
    setError(null);
    try {
      const result = await resendOtpUseCase.execute({ email });

      if (!result.success) {
        setError(result.message);
      }

      return result;
    } catch (error: any) {
      setError(error.message || 'Failed to resend OTP');
      return {
        success: false,
        message: error.message || 'Failed to resend OTP',
      };
    }
  };

  // This function should only be called when we need to refresh an expired token
  const refreshToken = async () => {
    setError(null);
    try {
      const result = await refreshTokenUseCase.execute({});
      return result;
    } catch (error: any) {
      setError(error.message || 'Failed to refresh token');
      return {
        success: false,
        message: error.message || 'Failed to refresh token',
      };
    }
  };

  const logout = async () => {
    setIsAuthLoading(true);

    try {
      await authRepository.logout();

      // Clear auth state
      setAwaitingOtpVerification(false);

      // Redirect to login page
      router.push('/');
    } catch (error: any) {
      setError(error.message || 'Failed to log out');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    isAuthLoading,
    error,
    awaitingOtpVerification,
    currentEmail,
    isSignup,
    signup,
    login,
    verifyOtp,
    resendOtp,
    refreshToken,
    logout,
    clearError,
    setCurrentEmail,
    setIsSignup,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
