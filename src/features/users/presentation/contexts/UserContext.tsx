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

// Storage key for userId in localStorage
const USER_ID_STORAGE_KEY = 'kudos_user_id';

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
  const orgId = router.query.orgId as string | undefined;

  // Helper function to check if we're on an auth page
  const isAuthPage = (): boolean => {
    return AUTH_PAGES.includes(router.pathname);
  };

  // Check localStorage for userId on initial load (client-side only)
  useEffect(() => {
    if (!isServer) {
      try {
        const storedUserId = localStorage.getItem(USER_ID_STORAGE_KEY);
        // If we have a userId in localStorage but no user data, trigger a fetch
        // Only if we're not on an auth page
        if (storedUserId && !user && !isAuthPage()) {
          fetchUserDetails();
        }
      } catch (error) {
        console.error('Error accessing localStorage:', error);
      }
    }
  }, [router.pathname]);

  // Redirect away from auth pages if user is already authenticated
  useEffect(() => {
    if (!isServer && !isLoading) {
      const storedUserId = localStorage.getItem(USER_ID_STORAGE_KEY);

      if (storedUserId && isAuthPage() && !orgId) {
        // User is authenticated but on an auth page, redirect to dashboard
        router.replace(`/dashboard?orgId=${orgId}`);
      }
    }
  }, [router.pathname, isLoading, user]);

  const fetchUserDetails = async () => {
    // Don't fetch if:
    // 1. We're on the server
    // 2. We should skip fetching
    // 3. We're on an auth page
    if (isServer || shouldSkipFetch || isAuthPage()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const userRepository = new UserRepository();
      const getCurrentUserUseCase = new GetCurrentUserUseCase(userRepository);

      const userDetails = await getCurrentUserUseCase.execute();
      setUser(userDetails);

      // Store userId in localStorage
      if (userDetails?.id) {
        localStorage.setItem(USER_ID_STORAGE_KEY, userDetails.id);
      }
    } catch (error) {
      // Clear user data if we get a 401 (or any error)
      setUser(null);

      // Remove userId from localStorage on authentication error
      if (error instanceof ApiError && error.status === 401) {
        localStorage.removeItem(USER_ID_STORAGE_KEY);
      }

      // Only set error and show toast for non-authentication errors
      // Don't show ANY errors on auth pages or if it's a 401
      if ((error instanceof ApiError && error.status === 401) || isAuthPage()) {
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
      localStorage.removeItem(USER_ID_STORAGE_KEY);
      return;
    }

    // Get the role from userData if it exists
    const userRole = userData.role || null;

    // Transform the auth user data to match UserOutputDto
    const transformedUser: UserOutputDto = {
      id: userData.id,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      fullName: `${userData.firstName} ${userData.lastName}`,
      isVerified: true, // User is verified if they completed OTP verification
      role: userRole, // Add the role to the user object
    };

    setUser(transformedUser);

    // Store userId in localStorage
    localStorage.setItem(USER_ID_STORAGE_KEY, userData.id);

    // Set flag to skip automatic fetching after auth
    setShouldSkipFetch(true);

    // Reset the flag after a delay
    setTimeout(() => {
      setShouldSkipFetch(false);
    }, 5000); // Wait 5 seconds before allowing automatic fetches again
  };

  // Fetch user details on initial mount (client-side only)
  // But only if we're not on an auth page
  useEffect(() => {
    if (!isServer && !awaitingOtpVerification && !isAuthPage()) {
      fetchUserDetails();
    }
  }, []);

  // Refetch when route changes (to catch login/logout navigation)
  // But skip auth pages where we don't need the user
  useEffect(() => {
    if (!isServer && !isAuthPage() && !awaitingOtpVerification) {
      fetchUserDetails();
    }
  }, [router.pathname]);

  // Refetch when AuthContext indicates authentication state has changed
  useEffect(() => {
    if (!isServer && !isAuthLoading && !awaitingOtpVerification && !isAuthPage()) {
      fetchUserDetails();
    }
  }, [isAuthLoading]);

  const value: UserContextProps = {
    user,
    isLoading,
    error,
    isAuthenticated: !!user || (!isServer && !!localStorage.getItem(USER_ID_STORAGE_KEY)), // User is authenticated if user object exists or userId is in localStorage
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
