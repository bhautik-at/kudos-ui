import React, { useState } from 'react';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/shared/components/atoms/Table';
import { Button } from '@/shared/components/atoms/Button';
import { Spinner } from '@/shared/components/atoms/Spinner';
import { useKudoCategoriesContext } from '../contexts/KudoCategoriesContext';
import { EditCategoryModal } from './EditCategoryModal';
import { DeleteCategoryModal } from './DeleteCategoryModal';
import { formatDate } from '@/shared/utils/formatDate';
import { useUser } from '@/features/users/presentation/contexts/UserContext';
import { useUserRole } from '@/shared/hooks/useUserRole';
import { UserRole } from '@/features/userManagement/domain/entities/UserRole';

export const CategoryTable: React.FC = () => {
  const { categories, isLoading, error } = useKudoCategoriesContext();
  const [categoryToEdit, setCategoryToEdit] = useState<{ id: string; name: string } | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<{ id: string; name: string } | null>(
    null
  );
  const { role } = useUserRole();

  // Check if user can edit and delete categories (any role except "Member")
  const canEditCategories = role !== UserRole.Member;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/10 p-4 rounded-md mb-4 text-destructive">
        <p className="font-medium">Failed to load categories</p>
        <p className="text-sm">{error.message}</p>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="bg-muted p-8 text-center rounded-md">
        <p className="text-muted-foreground">No categories found. Create your first category!</p>
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map(category => (
            <TableRow key={category.id}>
              <TableCell className="font-medium">{category.name}</TableCell>
              <TableCell>{formatDate(category.createdAt)}</TableCell>
              <TableCell>{formatDate(category.updatedAt)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCategoryToEdit({ id: category.id, name: category.name })}
                    disabled={!canEditCategories}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setCategoryToDelete({ id: category.id, name: category.name })}
                    disabled={!canEditCategories}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {categoryToEdit && (
        <EditCategoryModal
          category={categoryToEdit}
          isOpen={!!categoryToEdit}
          onClose={() => setCategoryToEdit(null)}
        />
      )}

      {categoryToDelete && (
        <DeleteCategoryModal
          category={categoryToDelete}
          isOpen={!!categoryToDelete}
          onClose={() => setCategoryToDelete(null)}
        />
      )}
    </>
  );
};
