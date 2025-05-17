import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Button,
  Input,
  Label,
  Checkbox,
} from '@/shared/components/atoms';
import { useUpdateTeam } from '../hooks/useUpdateTeam';
import { TeamOutputDto } from '../../application/dtos/TeamOutputDto';
import { useToast } from '@/shared/hooks/use-toast';
import {
  UserManagementProvider,
  useUserManagement,
} from '@/features/userManagement/presentation/contexts/UserManagementContext';
import { useTeamMembers } from '../hooks/useTeamMembers';

const formSchema = z.object({
  name: z.string().min(2, 'Team name must be at least 2 characters'),
});

type FormValues = z.infer<typeof formSchema>;

interface EditTeamModalProps {
  team: TeamOutputDto;
  isOpen: boolean;
  onClose: () => void;
  onTeamUpdated: () => void;
}

export function EditTeamModalContent({ team, isOpen, onClose, onTeamUpdated }: EditTeamModalProps) {
  const { toast } = useToast();
  const { updateTeam, isUpdating, error } = useUpdateTeam();
  const [serverError, setServerError] = useState<string | null>(null);
  const { users, isLoading: isLoadingUsers } = useUserManagement();
  const { teamMembers, isLoading: isLoadingTeamMembers } = useTeamMembers(team.id);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  // Initialize selected members from existing team members when data is loaded
  useEffect(() => {
    if (teamMembers) {
      setSelectedMembers(teamMembers.map(member => member.userId));
    }
  }, [teamMembers]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: team.name,
    },
  });

  const handleSubmit = async (data: FormValues) => {
    setServerError(null);

    const result = await updateTeam({
      id: team.id,
      name: data.name,
      members: selectedMembers,
    });

    if (result) {
      toast({
        title: 'Team updated successfully',
        description: 'Team updated successfully',
      });
      onTeamUpdated();
      onClose();
    } else {
      setServerError(error?.message || 'Failed to update team');
    }
  };

  const toggleMember = (userId: string) => {
    setSelectedMembers(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Team</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Team Name</Label>
              <Input id="name" {...form.register('name')} placeholder="Enter team name" />
              {form.formState.errors.name && (
                <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Team Members</Label>
              <div className="border rounded-md p-4 max-h-60 overflow-y-auto">
                {isLoadingUsers || isLoadingTeamMembers ? (
                  <p className="text-sm text-gray-500">Loading users...</p>
                ) : users.length === 0 ? (
                  <p className="text-sm text-gray-500">No users found</p>
                ) : (
                  <div className="space-y-2">
                    {users.map(user => (
                      <div key={user.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`user-${user.id}`}
                          checked={selectedMembers.includes(user.id)}
                          onCheckedChange={() => toggleMember(user.id)}
                        />
                        <Label
                          htmlFor={`user-${user.id}`}
                          className="text-sm cursor-pointer flex items-center justify-between flex-1"
                        >
                          <span>{user.fullName || `${user.firstName} ${user.lastName}`}</span>
                          <span className="text-xs text-gray-500">{user.email}</span>
                        </Label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {serverError && (
              <div className="text-sm text-red-500 rounded-md p-2 bg-red-50">{serverError}</div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isUpdating}>
              Cancel
            </Button>
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? 'Updating...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function EditTeamModal(props: EditTeamModalProps) {
  return (
    <UserManagementProvider>
      <EditTeamModalContent {...props} />
    </UserManagementProvider>
  );
}
