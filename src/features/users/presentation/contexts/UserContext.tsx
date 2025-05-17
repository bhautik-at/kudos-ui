import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserRepository } from '../../infrastructure/repositories/UserRepository';
import { GetCurrentUserUseCase } from '../../application/useCases/GetCurrentUserUseCase';
import { UserOutputDto } from '../../application/dtos/UserOutputDto';
import { useAuth } from '@/features/auth/presentation/contexts/AuthContext';
import { useToast } from '@/shared/hooks/use-toast';
import { useRouter } from 'next/router';
import { ApiError } from '@/shared/errors/ApiError';

interface UserContextProps {
  user: UserOutputDto | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean; // Computed from user presence
  refetchUser: () => Promise<void>;
  setUserFromAuth: (userData: any) => void; // New method to set user from auth response
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

// Pages that should skip automatic user fetching during navigation
const AUTH_PAGES = ['/', '/signup', '/auth/verify-otp'];

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserOutputDto | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false); // Start with false for SSR
  const [error, setError] = useState<string | null>(null);
  const [shouldSkipFetch, setShouldSkipFetch] = useState<boolean>(false);

  const { isAuthLoading, awaitingOtpVerification } = useAuth();
  const toast = useToast();
  const router = useRouter();
  const isServer = typeof window === 'undefined';

  const fetchUserDetails = async () => {
    // Don't fetch if on server or when we should skip fetching
    if (isServer || shouldSkipFetch) {
      return;
    }

    // Skip fetching for auth pages
    if (AUTH_PAGES.includes(router.pathname)) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const userRepository = new UserRepository();
      const getCurrentUserUseCase = new GetCurrentUserUseCase(userRepository);

      const userDetails = await getCurrentUserUseCase.execute();
      setUser(userDetails);
    } catch (error) {
      // Clear user data if we get a 401 (or any error)
      setUser(null);

      // Only set error and show toast for non-authentication errors
      if (error instanceof ApiError && error.status === 401) {
        // Silently handle 401 errors - that's expected for unauthenticated users
        setError(null);
      } else {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to fetch user details';
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Method to directly set user data from auth API response
  const setUserFromAuth = (userData: any) => {
    if (!userData) {
      setUser(null);
      return;
    }

    // Transform the auth user data to match UserOutputDto
    const transformedUser: UserOutputDto = {
      id: userData.id,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      fullName: `${userData.firstName} ${userData.lastName}`,
      isVerified: true, // User is verified if they completed OTP verification
    };

    setUser(transformedUser);

    // Set flag to skip automatic fetching after auth
    setShouldSkipFetch(true);

    // Reset the flag after a delay
    setTimeout(() => {
      setShouldSkipFetch(false);
    }, 5000); // Wait 5 seconds before allowing automatic fetches again
  };

  // Fetch user details on initial mount (client-side only)
  useEffect(() => {
    if (!isServer && !awaitingOtpVerification) {
      fetchUserDetails();
    }
  }, []);

  // Refetch when route changes (to catch login/logout navigation)
  // But skip auth pages where we don't need the user
  useEffect(() => {
    if (!isServer && !AUTH_PAGES.includes(router.pathname) && !awaitingOtpVerification) {
      fetchUserDetails();
    }
  }, [router.pathname]);

  // Refetch when AuthContext indicates authentication state has changed
  useEffect(() => {
    if (!isServer && !isAuthLoading && !awaitingOtpVerification) {
      fetchUserDetails();
    }
  }, [isAuthLoading]);

  const value: UserContextProps = {
    user,
    isLoading,
    error,
    isAuthenticated: !!user, // User is authenticated if user object exists
    refetchUser: fetchUserDetails,
    setUserFromAuth,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = (): UserContextProps => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
