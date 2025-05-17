import React from 'react';
import { UserManagementProvider } from '../contexts/UserManagementContext';
import { UserManagementHeader } from '../components/UserManagementHeader';
import { UserTable } from '../components/UserTable';
import { InviteUserModal } from '../components/InviteUserModal';
import { DashboardLayout } from '@/shared/components/templates/DashboardLayout';

export const UserManagementTemplate: React.FC = () => {
  return (
    <DashboardLayout>
      <UserManagementProvider>
        <div className="container mx-auto py-4">
          <UserManagementHeader />
          <UserTable />
          <InviteUserModal />
        </div>
      </UserManagementProvider>
    </DashboardLayout>
  );
};
