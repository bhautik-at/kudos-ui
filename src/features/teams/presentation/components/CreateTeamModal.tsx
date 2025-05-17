import { useState } from 'react';
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
import { useCreateTeam } from '../hooks/useCreateTeam';
import { useToast } from '@/shared/hooks/use-toast';
import {
  UserManagementProvider,
  useUserManagement,
} from '@/features/userManagement/presentation/contexts/UserManagementContext';

const formSchema = z.object({
  name: z.string().min(2, 'Team name must be at least 2 characters'),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateTeamModalProps {
  organizationId: string;
  userId: string;
  isOpen: boolean;
  onClose: () => void;
  onTeamCreated: () => void;
}

export function CreateTeamModalContent({
  organizationId,
  userId,
  isOpen,
  onClose,
  onTeamCreated,
}: CreateTeamModalProps) {
  const { toast } = useToast();
  const { createTeam, isCreating, error } = useCreateTeam();
  const [serverError, setServerError] = useState<string | null>(null);
  const { users, isLoading: isLoadingUsers } = useUserManagement();
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  });

  const handleSubmit = async (data: FormValues) => {
    setServerError(null);

    const result = await createTeam({
      name: data.name,
      organizationId,
      createdBy: userId,
      members: selectedMembers,
    });

    if (result) {
      toast({
        title: 'Team created successfully',
        description: 'Team created successfully',
      });
      onTeamCreated();
      onClose();
    } else {
      setServerError(error?.message || 'Failed to create team');
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
          <DialogTitle>Create Team</DialogTitle>
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
                {isLoadingUsers ? (
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
            <Button type="button" variant="outline" onClick={onClose} disabled={isCreating}>
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? 'Creating...' : 'Create Team'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function CreateTeamModal(props: CreateTeamModalProps) {
  return (
    <UserManagementProvider>
      <CreateTeamModalContent {...props} />
    </UserManagementProvider>
  );
}
