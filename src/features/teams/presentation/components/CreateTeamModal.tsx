import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/shared/components/atoms/Dialog';
import { Button } from '@/shared/components/atoms/Button';
import { Input } from '@/shared/components/atoms/Input';
import { Label } from '@/shared/components/atoms/Label';
import { Checkbox } from '@/shared/components/atoms/Checkbox';
import { useCreateTeam } from '../hooks/useCreateTeam';
import { useToast } from '@/shared/hooks/use-toast';
import {
  UserManagementProvider,
  useUserManagement,
} from '@/features/userManagement/presentation/contexts/UserManagementContext';
import { Users, AlertCircle, UserPlus, Loader2 } from 'lucide-react';

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
  const [processingMembers, setProcessingMembers] = useState<Record<string, boolean>>({});
  const [teamCreated, setTeamCreated] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  });

  const handleClose = useCallback(() => {
    if (teamCreated) {
      onTeamCreated();
    }
    onClose();
  }, [teamCreated, onTeamCreated, onClose]);

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
      });
      setTeamCreated(true);
      onClose();
      onTeamCreated();
    } else {
      setServerError(error?.message || 'Failed to create team');
    }
  };

  const toggleMember = async (userId: string) => {
    // Set this member as processing
    setProcessingMembers(prev => ({ ...prev, [userId]: true }));

    try {
      // Toggle the selection state
      setSelectedMembers(prev => {
        if (prev.includes(userId)) {
          // If user is already selected, remove them
          return prev.filter(id => id !== userId);
        } else {
          // Otherwise add them
          return [...prev, userId];
        }
      });

      // Simulate an API delay for consistent UX with EditTeamModal
      await new Promise(resolve => setTimeout(resolve, 150));
    } catch (err) {
      console.error('Error toggling member selection:', err);
    } finally {
      // Clear processing state
      setProcessingMembers(prev => ({ ...prev, [userId]: false }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden rounded-xl border-0">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-center space-x-3">
            <div className="rounded-full bg-white/20 p-2">
              <Users className="h-6 w-6" />
            </div>
            <DialogHeader className="text-white">
              <DialogTitle className="text-2xl font-bold text-white">Create New Team</DialogTitle>
              <DialogDescription className="text-white/80 mt-1">
                Add a new team and assign members
              </DialogDescription>
            </DialogHeader>
          </div>
        </div>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="p-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-base font-medium">
                Team Name
              </Label>
              <Input
                id="name"
                {...form.register('name')}
                placeholder="Enter team name"
                className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {form.formState.errors.name && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div className="space-y-3">
              <Label className="text-base font-medium">Team Members</Label>
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <div className="bg-gray-50 dark:bg-gray-800/50 py-2 px-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Select members to add to this team</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {selectedMembers.length} selected
                    </span>
                  </div>
                </div>
                <div className="max-h-60 overflow-y-auto p-2">
                  {isLoadingUsers ? (
                    <div className="p-4 text-center">
                      <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-blue-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                      <p className="text-sm text-gray-500 mt-2">Loading users...</p>
                    </div>
                  ) : users.length === 0 ? (
                    <div className="p-4 text-center">
                      <p className="text-sm text-gray-500">No users found</p>
                    </div>
                  ) : (
                    <div className="space-y-1 p-2">
                      {users.map(user => {
                        const isSelected = selectedMembers.includes(user.id);
                        const isProcessing = processingMembers[user.id];

                        return (
                          <div
                            key={user.id}
                            className={`flex items-center space-x-3 p-2 rounded-md transition-colors ${
                              isSelected
                                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100'
                                : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                            }`}
                          >
                            <div className="relative">
                              <Checkbox
                                id={`user-${user.id}`}
                                checked={isSelected}
                                onCheckedChange={() => toggleMember(user.id)}
                                disabled={isProcessing}
                                className={isSelected ? 'text-blue-600' : ''}
                              />
                              {isProcessing && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                                </div>
                              )}
                            </div>
                            <div className="flex items-center justify-between flex-1 min-w-0">
                              <Label htmlFor={`user-${user.id}`} className="text-sm cursor-pointer">
                                {user.fullName || `${user.firstName} ${user.lastName}`}
                              </Label>
                              <span className="text-xs text-gray-500 truncate ml-2">
                                {user.email}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {serverError && (
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                <div className="text-red-600 dark:text-red-400 text-sm">{serverError}</div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isCreating}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isCreating}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md transition-all"
            >
              {isCreating ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </span>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Create Team
                </>
              )}
            </Button>
          </div>
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
