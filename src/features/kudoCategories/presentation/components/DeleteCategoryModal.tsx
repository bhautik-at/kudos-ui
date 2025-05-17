import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/shared/components/atoms/Dialog';
import { Button } from '@/shared/components/atoms/Button';
import { useKudoCategoriesContext } from '../contexts/KudoCategoriesContext';
import { useToast } from '@/shared/hooks/use-toast';

interface DeleteCategoryModalProps {
  category: {
    id: string;
    name: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

export const DeleteCategoryModal: React.FC<DeleteCategoryModalProps> = ({
  category,
  isOpen,
  onClose,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { deleteCategory } = useKudoCategoriesContext();
  const { toast } = useToast();

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      const success = await deleteCategory(category.id);
      if (success) {
        toast({
          title: 'Success - Category deleted successfully',
        });
        onClose();
      } else {
        setError('Failed to delete category');
        toast({
          title: 'Error - Failed to delete category',
          type: 'error',
        });
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Category</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the category "{category.name}"? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {error && <div className="text-destructive text-sm mb-4">{error}</div>}
        </div>
        <DialogFooter>
          <Button variant="outline" type="button" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="destructive" type="button" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
