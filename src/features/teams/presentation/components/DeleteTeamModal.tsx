import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/shared/components/atoms/Dialog';
import { Button } from '@/shared/components/atoms/Button';
import { useDeleteTeam } from '../hooks/useDeleteTeam';
import { TeamOutputDto } from '../../application/dtos/TeamOutputDto';
import { useToast } from '@/shared/hooks/use-toast';
import { AlertTriangle, AlertCircle } from 'lucide-react';

interface DeleteTeamModalProps {
  team: TeamOutputDto;
  isOpen: boolean;
  onClose: () => void;
  onTeamDeleted: () => void;
}

export function DeleteTeamModal({ team, isOpen, onClose, onTeamDeleted }: DeleteTeamModalProps) {
  const { toast } = useToast();
  const { deleteTeam, isDeleting, error } = useDeleteTeam();
  const [serverError, setServerError] = useState<string | null>(null);

  const handleDeleteTeam = async () => {
    setServerError(null);
    const result = await deleteTeam(team.id);

    if (result) {
      toast({
        title: 'Team deleted successfully',
      });
      onTeamDeleted();
      onClose();
    } else {
      setServerError(error?.message || 'Failed to delete team');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden rounded-xl border-0">
        <div className="bg-gradient-to-r from-red-500 to-red-700 p-6 text-white">
          <div className="flex items-center space-x-3">
            <div className="rounded-full bg-white/20 p-2">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <DialogHeader className="text-white">
              <DialogTitle className="text-2xl font-bold text-white">Delete Team</DialogTitle>
              <DialogDescription className="text-white/80 mt-1">
                This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
          </div>
        </div>

        <div className="p-6">
          <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-lg p-4 mb-6">
            <p className="text-red-800 dark:text-red-200">
              Are you sure you want to delete the team{' '}
              <span className="font-semibold">"{team.name}"</span>?
            </p>
            <p className="text-red-600 dark:text-red-300 text-sm mt-2">
              This will permanently remove the team and all its member associations from your
              organization.
            </p>
          </div>

          {serverError && (
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 flex items-start space-x-2 mb-4">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
              <div className="text-red-600 dark:text-red-400 text-sm">{serverError}</div>
            </div>
          )}

          <div className="flex justify-end space-x-3 mt-4">
            <Button
              variant="outline"
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              type="button"
              onClick={handleDeleteTeam}
              disabled={isDeleting}
              className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 shadow-md"
            >
              {isDeleting ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Deleting...
                </span>
              ) : (
                'Delete Team'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
