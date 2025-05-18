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
import { Pencil, AlertCircle } from 'lucide-react';

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
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden rounded-xl border-0">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-center space-x-3">
            <div className="rounded-full bg-white/20 p-2">
              <Pencil className="h-6 w-6" />
            </div>
            <DialogHeader className="text-white">
              <DialogTitle className="text-2xl font-bold text-white">Edit Category</DialogTitle>
              <DialogDescription className="text-white/80 mt-1">
                Update the name of this kudo category.
              </DialogDescription>
            </DialogHeader>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-base font-medium">
                Category Name
              </Label>
              <Input
                id="name"
                value={categoryName}
                onChange={e => setCategoryName(e.target.value)}
                disabled={isSubmitting}
                placeholder="Enter category name"
                className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                <div className="text-red-600 dark:text-red-400 text-sm">{error}</div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <Button
              variant="outline"
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md transition-all"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Updating...
                </span>
              ) : (
                'Update Category'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
