import { useUser } from '@/features/users/presentation/contexts/UserContext';
import { UserRole } from '@/features/userManagement/domain/entities/UserRole';

/**
 * Hook to determine the current user's role in the system
 * @returns An object with role information and helper methods
 */
export const useUserRole = () => {
  const { user } = useUser();

  // For now, we're hard-coding the tech leader role check
  // In a real application, this would come from the user object itself
  // This is a temporary solution until the backend provides role information

  // You can modify this condition based on how roles are actually determined in your app
  // Here we're using a simple logic based on email domain as an example
  const isTechLeader = user?.email?.includes('lead') || user?.email?.includes('admin') || false;
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
