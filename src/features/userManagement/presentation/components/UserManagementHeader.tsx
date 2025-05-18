import React from 'react';
import { Button } from '@/shared/components/atoms/Button';
import { useUserManagement } from '../contexts/UserManagementContext';
import { UserPlus, Users } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/components/atoms/Tooltip';
import { useUserRole } from '@/shared/hooks/useUserRole';
import { UserRole } from '../../domain/entities/UserRole';
import { useUser } from '@/features/users/presentation/contexts/UserContext';

export const UserManagementHeader: React.FC = () => {
  const { openInviteModal } = useUserManagement();
  const { role } = useUserRole();
  const { isLoading: isUserLoading, user } = useUser();

  // We'll render the invite button if:
  // 1. User data is still loading (to prevent flickering) OR
  // 2. User is confirmed to be a tech leader
  const showInviteButton = isUserLoading || role === UserRole.TechLeader;

  return (
    <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
      <div className="flex items-center space-x-3">
        <div className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 p-3 text-white shadow-md">
          <Users className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            User Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your team members and their access levels
          </p>
        </div>
      </div>

      {/* Only show invite buttons if the user has permission or data is loading */}
      {showInviteButton && (
        <>
          {/* Desktop version with text */}
          <Button
            onClick={openInviteModal}
            className="hidden md:flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md transition-all"
            disabled={isUserLoading}
          >
            <UserPlus className="h-4 w-4" />
            <span>Invite</span>
          </Button>

          {/* Mobile version with icon only and tooltip */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={openInviteModal}
                  size="icon"
                  className="md:hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md"
                  aria-label="Invite Team Member"
                  disabled={isUserLoading}
                >
                  <UserPlus className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Invite Team Member</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </>
      )}
    </div>
  );
};
