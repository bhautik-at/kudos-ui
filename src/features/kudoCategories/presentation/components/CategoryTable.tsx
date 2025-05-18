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
import { useKudoCategoriesContext } from '../contexts/KudoCategoriesContext';
import { EditCategoryModal } from './EditCategoryModal';
import { DeleteCategoryModal } from './DeleteCategoryModal';
import { formatDate } from '@/shared/utils/formatDate';
import { useUser } from '@/features/users/presentation/contexts/UserContext';
import { useUserRole } from '@/shared/hooks/useUserRole';
import { UserRole } from '@/features/userManagement/domain/entities/UserRole';
import { Pencil, Trash2, AlertCircle, Calendar, Tag } from 'lucide-react';

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
      <div className="bg-white dark:bg-gray-850 rounded-xl border shadow-sm p-6">
        <div className="flex flex-col space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
                <div className="flex space-x-2">
                  <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800 p-6 text-red-800 dark:text-red-200">
        <div className="flex items-center space-x-3">
          <AlertCircle className="h-6 w-6 text-red-500" />
          <div>
            <h3 className="font-medium text-red-800 dark:text-red-200">
              Failed to load categories
            </h3>
            <p className="text-sm text-red-600 dark:text-red-300">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-850 rounded-xl border shadow-sm p-12 text-center">
        <div className="flex flex-col items-center justify-center text-muted-foreground">
          <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-3 mb-4">
            <Tag className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium mb-1">No categories found</h3>
          <p className="text-sm">Create your first category to get started</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white dark:bg-gray-850 overflow-hidden rounded-xl border shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50 dark:bg-gray-800/40">
              <TableRow>
                <TableHead className="font-medium w-[40%]">Name</TableHead>
                <TableHead className="font-medium">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4 opacity-70" />
                    <span>Created</span>
                  </div>
                </TableHead>
                <TableHead className="font-medium">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4 opacity-70" />
                    <span>Last Updated</span>
                  </div>
                </TableHead>
                <TableHead className="text-right font-medium">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map(category => (
                <TableRow
                  key={category.id}
                  className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-700/10">
                        <Tag className="h-3.5 w-3.5" />
                      </span>
                      <span>{category.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(category.createdAt)}</TableCell>
                  <TableCell>{formatDate(category.updatedAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCategoryToEdit({ id: category.id, name: category.name })}
                        disabled={!canEditCategories}
                        className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setCategoryToDelete({ id: category.id, name: category.name })
                        }
                        disabled={!canEditCategories}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

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
