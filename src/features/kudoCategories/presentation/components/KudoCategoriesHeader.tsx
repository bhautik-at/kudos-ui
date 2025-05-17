import React, { useState } from 'react';
import { Button } from '@/shared/components/atoms/Button';
import { useKudoCategoriesContext } from '../contexts/KudoCategoriesContext';
import { CreateCategoryModal } from './CreateCategoryModal';
import { useUser } from '@/features/users/presentation/contexts/UserContext';
import { useUserRole } from '@/shared/hooks/useUserRole';
import { UserRole } from '@/features/userManagement/domain/entities/UserRole';

export const KudoCategoriesHeader: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isLoading } = useKudoCategoriesContext();
  const { role } = useUserRole();

  // Check if user can add categories (any role except "Member")
  const canAddCategory = role !== UserRole.Member;

  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Kudo Categories</h1>
      {canAddCategory && (
        <Button variant="default" disabled={isLoading} onClick={() => setIsModalOpen(true)}>
          Add New Category
        </Button>
      )}
      <CreateCategoryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
