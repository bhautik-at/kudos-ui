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
import { Input } from '@/shared/components/atoms/Input';
import { Label } from '@/shared/components/atoms/Label';
import { useKudoCategoriesContext } from '../contexts/KudoCategoriesContext';
import { useToast } from '@/shared/hooks/use-toast';

interface EditCategoryModalProps {
  category: {
    id: string;
    name: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

export const EditCategoryModal: React.FC<EditCategoryModalProps> = ({
  category,
  isOpen,
  onClose,
}) => {
  const [categoryName, setCategoryName] = useState(category.name);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { updateCategory } = useKudoCategoriesContext();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      setError('Category name cannot be empty');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const success = await updateCategory(category.id, categoryName.trim());
      if (success) {
        toast({
          title: 'Success - Category updated successfully',
        });
        onClose();
      } else {
        setError('Failed to update category');
        toast({
          title: 'Error - Failed to update category',
          type: 'error',
        });
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
          <DialogDescription>Update the name of this kudo category.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={categoryName}
                onChange={e => setCategoryName(e.target.value)}
                disabled={isSubmitting}
                placeholder="Enter category name"
              />
            </div>
            {error && <div className="text-destructive text-sm">{error}</div>}
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Update'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
