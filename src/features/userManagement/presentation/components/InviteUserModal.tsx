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

export const InviteUserModal: React.FC = () => {
  const { isInviteModalOpen, closeInviteModal } = useUserManagement();

  return (
    <Dialog open={isInviteModalOpen} onOpenChange={closeInviteModal}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Invite Team Members</DialogTitle>
          <DialogDescription>
            Enter the email addresses of people you'd like to invite to your team.
          </DialogDescription>
        </DialogHeader>
        <InviteUsersForm />
      </DialogContent>
    </Dialog>
  );
};
