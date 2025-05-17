import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { AuthRepository } from '../../infrastructure/repositories/AuthRepository';
import { SignupUseCase } from '../../application/useCases/SignupUseCase';
import { LoginUseCase } from '../../application/useCases/LoginUseCase';
import { VerifyOtpUseCase } from '../../application/useCases/VerifyOtpUseCase';
import { ResendOtpUseCase } from '../../application/useCases/ResendOtpUseCase';
import { RefreshTokenUseCase } from '../../application/useCases/RefreshTokenUseCase';
import { httpService } from '@/shared/services/http/HttpService';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface AuthContextProps {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
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
    user?: User;
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
    user?: User;
  }>;
  logout: () => Promise<void>;
  clearError: () => void;
  setCurrentEmail: (email: string) => void;
  setIsSignup: (isSignup: boolean) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
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

  // Check if user is already authenticated on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Try to refresh token to check if user is authenticated
        const result = await refreshToken();
        if (result.success && 'token' in result && result.token) {
          setIsAuthenticated(true);
          if ('user' in result && result.user) {
            setUser(result.user);
          }
        }
        setIsLoading(false);
      } catch (error) {
        setError('Failed to check authentication status');
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Removed automatic redirect to dashboard
  // The OtpVerificationForm component will handle navigation directly

  const signup = async (email: string, firstName: string, lastName: string) => {
    setError(null);
    setIsLoading(true);
    try {
      const result = await signupUseCase.execute({ email, firstName, lastName });

      if (result.success) {
        setAwaitingOtpVerification(true);
        setCurrentEmail(email);
        setIsSignup(true);
      } else {
        setError(result.message);
      }

      setIsLoading(false);
      return result;
    } catch (error: any) {
      setError(error.message || 'Failed to sign up');
      setIsLoading(false);
      return { success: false, message: error.message || 'Failed to sign up' };
    }
  };

  const login = async (email: string) => {
    setError(null);
    setIsLoading(true);
    try {
      const result = await loginUseCase.execute({ email });

      if (result.success) {
        setAwaitingOtpVerification(true);
        setCurrentEmail(email);
        setIsSignup(false);
      } else {
        setError(result.message);
      }

      setIsLoading(false);
      return result;
    } catch (error: any) {
      setError(error.message || 'Failed to log in');
      setIsLoading(false);
      return { success: false, message: error.message || 'Failed to log in' };
    }
  };

  const verifyOtp = async (email: string, otp: string) => {
    setError(null);
    setIsLoading(true);
    try {
      console.log('AuthContext: Verifying OTP...');
      const result = await verifyOtpUseCase.execute({ email, otp });
      console.log('AuthContext: OTP verification result:', result);

      if (result.success && result.token) {
        console.log('AuthContext: Setting authenticated state to true');
        setIsAuthenticated(true);
        setAwaitingOtpVerification(false);

        // Set token in HTTP service for future authenticated requests
        httpService.setAuthToken(result.token);

        // Set user data if available
        if (result.user) {
          console.log('AuthContext: Setting user data:', result.user);
          setUser(result.user);
        }
      } else {
        console.log('AuthContext: OTP verification failed');
        setError(result.message);
      }

      setIsLoading(false);
      return result;
    } catch (error: any) {
      console.error('AuthContext: Error verifying OTP:', error);
      setError(error.message || 'Failed to verify OTP');
      setIsLoading(false);
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

  const refreshToken = async () => {
    setError(null);
    try {
      const result = await refreshTokenUseCase.execute({});

      if (result.success && result.token) {
        // Set token in HTTP service for future authenticated requests
        httpService.setAuthToken(result.token);

        // Set user data if available
        if (result.user) {
          setUser(result.user);
          setIsAuthenticated(true);
        }
      }

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
    setIsLoading(true);

    try {
      await authRepository.logout();

      // Clear auth state
      setUser(null);
      setIsAuthenticated(false);
      setAwaitingOtpVerification(false);

      // Clear auth token
      httpService.clearAuthToken();

      // Redirect to login page
      router.push('/');
    } catch (error: any) {
      setError(error.message || 'Failed to log out');
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
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
