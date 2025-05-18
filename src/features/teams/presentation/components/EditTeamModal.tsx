import { useState, useEffect, useCallback } from 'react';
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
import { useUpdateTeam } from '../hooks/useUpdateTeam';
import { useAddTeamMember } from '../hooks/useAddTeamMember';
import { useRemoveTeamMember } from '../hooks/useRemoveTeamMember';
import { useTeamMembers } from '../hooks/useTeamMembers';
import { TeamOutputDto } from '../../application/dtos/TeamOutputDto';
import { useToast } from '@/shared/hooks/use-toast';
import {
  UserManagementProvider,
  useUserManagement,
} from '@/features/userManagement/presentation/contexts/UserManagementContext';
import { Pencil, AlertCircle, UserCheck, Loader2 } from 'lucide-react';

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
  const { updateTeam, isUpdating, error: updateError } = useUpdateTeam();
  const { addTeamMember, isAdding, error: addError } = useAddTeamMember();
  const { removeTeamMember, isRemoving, error: removeError } = useRemoveTeamMember();
  const [serverError, setServerError] = useState<string | null>(null);
  const { users, isLoading: isLoadingUsers } = useUserManagement();
  const [hasChanges, setHasChanges] = useState(false);

  // Fetch current team members for the checkbox selection
  const {
    teamMembers,
    isLoading: isLoadingTeamMembers,
    refetchMembers,
  } = useTeamMembers(team.id, false);

  // Track members being processed
  const [processingMembers, setProcessingMembers] = useState<Record<string, boolean>>({});

  // Initialize form with team name
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: team.name,
    },
  });

  // Custom close handler that triggers the update callback only if changes were made
  const handleClose = useCallback(() => {
    if (hasChanges) {
      onTeamUpdated();
    }
    onClose();
  }, [hasChanges, onClose, onTeamUpdated]);

  // Update team name only
  const handleSubmit = async (data: FormValues) => {
    setServerError(null);

    if (data.name === team.name) {
      toast({
        title: 'No changes to save',
      });
      return;
    }

    const result = await updateTeam({
      id: team.id,
      name: data.name,
      // Don't update members here as we handle that separately
    });

    if (result) {
      toast({
        title: 'Team name updated successfully',
      });
      setHasChanges(true);
    } else {
      setServerError(updateError?.message || 'Failed to update team name');
    }
  };

  // Handle real-time member toggling
  const toggleMember = async (userId: string, isCurrentlyMember: boolean) => {
    // Set this member as processing
    setProcessingMembers(prev => ({ ...prev, [userId]: true }));
    setServerError(null);

    try {
      if (isCurrentlyMember) {
        // Remove member
        const success = await removeTeamMember(team.id, userId);
        if (success) {
          toast({
            title: 'Member removed successfully',
          });
          setHasChanges(true);
        } else {
          toast({
            title: 'Failed to remove member: ' + (removeError?.message || 'Unknown error'),
          });
          return;
        }
      } else {
        // Add member
        const result = await addTeamMember(team.id, userId);
        if (result) {
          toast({
            title: 'Member added successfully',
          });
          setHasChanges(true);
        } else {
          toast({
            title: 'Failed to add member: ' + (addError?.message || 'Unknown error'),
          });
          return;
        }
      }

      // Refresh the member list locally
      refetchMembers();
    } catch (err) {
      setServerError(String(err));
    } finally {
      // Clear processing state
      setProcessingMembers(prev => ({ ...prev, [userId]: false }));
    }
  };

  // Check if a user is a member of the team
  const isUserTeamMember = (userId: string): boolean => {
    return teamMembers.some(member => member.userId === userId);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden rounded-xl border-0">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-center space-x-3">
            <div className="rounded-full bg-white/20 p-2">
              <Pencil className="h-6 w-6" />
            </div>
            <DialogHeader className="text-white">
              <DialogTitle className="text-2xl font-bold text-white">Edit Team</DialogTitle>
              <DialogDescription className="text-white/80 mt-1">
                Update team details and manage members
              </DialogDescription>
            </DialogHeader>
          </div>
        </div>

        <div className="p-6">
          <form onSubmit={form.handleSubmit(handleSubmit)} className="mb-6">
            <div className="space-y-4">
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

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isUpdating}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md transition-all"
                >
                  {isUpdating ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Updating...
                    </span>
                  ) : (
                    <>
                      <UserCheck className="h-4 w-4 mr-2" />
                      Update Name
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>

          <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>

          <div className="space-y-3">
            <Label className="text-base font-medium">Team Members</Label>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <div className="bg-gray-50 dark:bg-gray-800/50 py-2 px-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Add or remove team members (changes are saved immediately)
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {teamMembers.length} members
                  </span>
                </div>
              </div>
              <div className="max-h-60 overflow-y-auto p-2">
                {isLoadingUsers || isLoadingTeamMembers ? (
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
                      const isCurrentMember = isUserTeamMember(user.id);
                      const isProcessing = processingMembers[user.id];

                      return (
                        <div
                          key={user.id}
                          className={`flex items-center space-x-3 p-2 rounded-md transition-colors ${
                            isCurrentMember
                              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100'
                              : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                          }`}
                        >
                          <div className="relative">
                            <Checkbox
                              id={`user-${user.id}`}
                              checked={isCurrentMember}
                              onCheckedChange={() => toggleMember(user.id, isCurrentMember)}
                              disabled={isProcessing || isAdding || isRemoving}
                              className={isCurrentMember ? 'text-blue-600' : ''}
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
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 flex items-start space-x-2 mt-4">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
              <div className="text-red-600 dark:text-red-400 text-sm">{serverError}</div>
            </div>
          )}

          <div className="flex justify-end mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              {hasChanges ? 'Save & Close' : 'Close'}
            </Button>
          </div>
        </div>
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
