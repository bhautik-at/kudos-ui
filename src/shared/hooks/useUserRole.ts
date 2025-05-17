import { useUser } from '@/features/users/presentation/contexts/UserContext';
import { UserRole } from '@/features/userManagement/domain/entities/UserRole';

/**
 * Hook to determine the current user's role in the system
 * @returns An object with role information and helper methods
 */
export const useUserRole = () => {
  const { user } = useUser();

  // Updated logic to check for any tech leader pattern variations
  const isTechLeader =
    user?.role === UserRole.TechLeader ||
    user?.email?.includes('lead') ||
    user?.email?.includes('admin') ||
    user?.email?.includes('tech_leader') ||
    false;

  const isTeamMember = !isTechLeader && !!user;
  return {
    // Role status helpers
    isTechLeader,
    isTeamMember,

    // Full role value (for cases where you need the exact role enum)
    role: isTechLeader ? UserRole.TechLeader : UserRole.Member,
  };
};
