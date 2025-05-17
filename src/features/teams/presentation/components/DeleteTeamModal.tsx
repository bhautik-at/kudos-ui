import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  Button,
} from '@/shared/components/atoms';
import { useDeleteTeam } from '../hooks/useDeleteTeam';
import { TeamOutputDto } from '../../application/dtos/TeamOutputDto';
import { useToast } from '@/shared/hooks/use-toast';

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

  const handleDelete = async () => {
    setServerError(null);

    const success = await deleteTeam(team.id);

    if (success) {
      toast({
        title: 'Team deleted successfully',
        description: 'Team deleted successfully',
      });
      onTeamDeleted();
      onClose();
    } else {
      setServerError(error?.message || 'Failed to delete team');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Team</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the team "{team.name}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {serverError && (
            <div className="text-sm text-red-500 rounded-md p-2 bg-red-50 mb-4">{serverError}</div>
          )}

          <p className="text-sm text-gray-500">
            This will permanently delete the team and remove all team members from it.
          </p>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : 'Delete Team'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
