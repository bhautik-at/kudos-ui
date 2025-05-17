import React from 'react';
import { Button } from '@/shared/components/atoms/Button';
import { useUserManagement } from '../contexts/UserManagementContext';
import { UserPlus } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/components/atoms/Tooltip';
import { useUserRole } from '@/shared/hooks/useUserRole';

export const UserManagementHeader: React.FC = () => {
  const { openInviteModal } = useUserManagement();
  const { canInviteUsers } = useUserRole();

  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold">User Management</h1>

      {/* Only show invite buttons if the user has permission */}
      {canInviteUsers && (
        <>
          {/* Desktop version with text */}
          <Button onClick={openInviteModal} className="hidden md:flex items-center gap-2">
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
                  className="md:hidden"
                  aria-label="Invite Team Member"
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
