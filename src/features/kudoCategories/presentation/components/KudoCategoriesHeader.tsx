import React, { useState } from 'react';
import { Button } from '@/shared/components/atoms/Button';
import { useKudoCategoriesContext } from '../contexts/KudoCategoriesContext';
import { CreateCategoryModal } from './CreateCategoryModal';
import { useUser } from '@/features/users/presentation/contexts/UserContext';
import { useUserRole } from '@/shared/hooks/useUserRole';
import { UserRole } from '@/features/userManagement/domain/entities/UserRole';
import { Tag, Plus } from 'lucide-react';

export const KudoCategoriesHeader: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isLoading } = useKudoCategoriesContext();
  const { role } = useUserRole();
  const { isLoading: isUserLoading } = useUser();

  // Check if user can add categories (any role except "Member")
  const canAddCategory = role !== UserRole.Member;
  const showAddButton = isUserLoading || canAddCategory;

  return (
    <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
      <div className="flex items-center space-x-3">
        <div className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 p-3 text-white shadow-md">
          <Tag className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Kudo Categories
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage category tags for kudos in your organization
          </p>
        </div>
      </div>

      {showAddButton && (
        <Button
          variant="default"
          disabled={isLoading || isUserLoading}
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md transition-all flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Category</span>
        </Button>
      )}
      <CreateCategoryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
