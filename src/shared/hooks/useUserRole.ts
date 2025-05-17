import { useUser } from '@/features/users/presentation/contexts/UserContext';
import { UserRole } from '@/features/userManagement/domain/entities/UserRole';

/**
 * Hook to determine the current user's role in the system
 * @returns An object with role information and helper methods
 */
export const useUserRole = () => {
  const { user } = useUser();

  // DEVELOPMENT OVERRIDE: Set to true to force tech leader permissions for testing
  const FORCE_TECH_LEADER = true;

  // For now, we're hard-coding the tech leader role check
  // In a real application, this would come from the user object itself
  // This is a temporary solution until the backend provides role information

  // Updated logic to check for any tech leader pattern variations
  const isTechLeader =
    FORCE_TECH_LEADER ||
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

    // Whether the user can perform certain actions
    canInviteUsers: isTechLeader,
    canUpdateRoles: isTechLeader,
    canDeleteUsers: isTechLeader,
  };
};
