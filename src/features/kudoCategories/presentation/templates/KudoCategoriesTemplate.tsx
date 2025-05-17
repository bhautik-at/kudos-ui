import React from 'react';
import { KudoCategoriesProvider } from '../contexts/KudoCategoriesContext';
import { KudoCategoriesHeader } from '../components/KudoCategoriesHeader';
import { CategoryTable } from '../components/CategoryTable';
import { DashboardLayout } from '@/shared/components/templates/DashboardLayout';

export const KudoCategoriesTemplate: React.FC = () => {
  return (
    <DashboardLayout>
      <KudoCategoriesProvider>
        <div className="container mx-auto py-4">
          <KudoCategoriesHeader />
          <CategoryTable />
        </div>
      </KudoCategoriesProvider>
    </DashboardLayout>
  );
};
