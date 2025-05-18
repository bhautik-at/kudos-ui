import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/shared/components/atoms/Dialog';
import { useUserManagement } from '../contexts/UserManagementContext';
import { InviteUsersForm } from './InviteUsersForm';
import { UserPlus } from 'lucide-react';

export const InviteUserModal: React.FC = () => {
  const { isInviteModalOpen, closeInviteModal } = useUserManagement();

  return (
    <Dialog open={isInviteModalOpen} onOpenChange={closeInviteModal}>
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden rounded-xl border-0">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-center space-x-3">
            <div className="rounded-full bg-white/20 p-2">
              <UserPlus className="h-6 w-6" />
            </div>
            <DialogHeader className="text-white">
              <DialogTitle className="text-2xl font-bold text-white">
                Invite Team Members
              </DialogTitle>
              <DialogDescription className="text-white/80 mt-1">
                Enter the email addresses of people you'd like to invite to your team.
              </DialogDescription>
            </DialogHeader>
          </div>
        </div>
        <div className="p-6">
          <InviteUsersForm />
        </div>
      </DialogContent>
    </Dialog>
  );
};
