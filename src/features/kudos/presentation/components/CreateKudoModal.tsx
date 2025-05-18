import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/shared/components/atoms/Dialog';
import { Button } from '@/shared/components/atoms/Button';
import { Textarea } from '@/shared/components/atoms/Textarea';
import { Label } from '@/shared/components/atoms/Label';
import { Form, FormItem, FormControl, FormMessage } from '@/shared/components/atoms/Form';
import { Autocomplete } from '@/shared/components/molecules/Autocomplete';
import { useToast } from '@/shared/hooks/use-toast';
import { CreateKudoInputDto } from '../../application/dtos/CreateKudoInputDto';
import { useUserManagement } from '@/features/userManagement/presentation/contexts/UserManagementContext';
import { useTeamList } from '@/features/teams/presentation/hooks/useTeamList';
import { UserManagementProvider } from '@/features/userManagement/presentation/contexts/UserManagementContext';
import { useKudoCategories } from '@/features/kudoCategories/presentation/hooks/useKudoCategories';

// Form validation schema
const createKudoSchema = z.object({
  recipientId: z.string().min(1, 'Recipient is required'),
  teamId: z.string().min(1, 'Team is required'),
  categoryId: z.string().min(1, 'Category is required'),
  message: z
    .string()
    .min(1, 'Message is required')
    .max(500, 'Message cannot be longer than 500 characters'),
  organizationId: z.string().min(1, 'Organization is required'),
});

type CreateKudoFormValues = z.infer<typeof createKudoSchema>;

interface CreateKudoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateKudoInputDto) => Promise<void>;
  organizationId: string;
}

// This wrapper component provides the UserManagementContext
const CreateKudoModalWithProvider = (props: CreateKudoModalProps) => {
  return (
    <UserManagementProvider>
      <CreateKudoModalInternal {...props} />
    </UserManagementProvider>
  );
};

// The internal component that uses the contexts
const CreateKudoModalInternal = ({
  isOpen,
  onClose,
  onSubmit,
  organizationId,
}: CreateKudoModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { users, isLoading: isLoadingUsers } = useUserManagement();
  const { teams, isLoading: isLoadingTeams } = useTeamList(organizationId);
  const { categories, isLoading: isLoadingCategories } = useKudoCategories(organizationId);

  const form = useForm<CreateKudoFormValues>({
    resolver: zodResolver(createKudoSchema),
    defaultValues: {
      recipientId: '',
      teamId: '',
      categoryId: '',
      message: '',
      organizationId: organizationId,
    },
  });

  // Set organization ID whenever it changes
  useEffect(() => {
    if (organizationId) {
      form.setValue('organizationId', organizationId);
    }
  }, [organizationId, form]);

  // Reset form when modal is opened
  useEffect(() => {
    if (isOpen) {
      form.reset({
        recipientId: '',
        teamId: '',
        categoryId: '',
        message: '',
        organizationId: organizationId,
      });
    }
  }, [isOpen, form, organizationId]);

  const handleSubmit = async (data: CreateKudoFormValues) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      form.reset();
    } catch (error) {
      toast({
        title:
          'Failed to create kudo: ' +
          (error instanceof Error ? error.message : 'Unknown error occurred'),
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Map users to autocomplete options
  const userOptions = useMemo(
    () =>
      users.map(user => ({
        value: user.id,
        label: user.fullName || `${user.firstName} ${user.lastName}`,
      })),
    [users]
  );

  // Map teams to autocomplete options from API data
  const teamOptions = useMemo(() => {
    if (teams && teams.length > 0) {
      return teams.map(team => ({
        value: team.id,
        label: team.name,
      }));
    }
    return [];
  }, [teams]);

  // Map categories to autocomplete options from API data
  const categoryOptions = useMemo(() => {
    if (categories && categories.length > 0) {
      return categories.map(category => ({
        value: category.id,
        label: category.name,
      }));
    }
    return [];
  }, [categories]);

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Kudo</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormItem>
              <Label htmlFor="recipientId">Recipient's Name</Label>
              <FormControl>
                <Autocomplete
                  options={userOptions}
                  placeholder="Select recipient"
                  value={form.watch('recipientId')}
                  onChange={value => form.setValue('recipientId', value, { shouldValidate: true })}
                  disabled={isSubmitting || isLoadingUsers}
                />
              </FormControl>
              <FormMessage>{form.formState.errors.recipientId?.message}</FormMessage>
            </FormItem>

            <FormItem>
              <Label htmlFor="teamId">Team Name</Label>
              <FormControl>
                <Autocomplete
                  options={teamOptions}
                  placeholder="Select team"
                  value={form.watch('teamId')}
                  onChange={value => form.setValue('teamId', value, { shouldValidate: true })}
                  disabled={isSubmitting || isLoadingTeams}
                />
              </FormControl>
              <FormMessage>{form.formState.errors.teamId?.message}</FormMessage>
            </FormItem>

            <FormItem>
              <Label htmlFor="categoryId">Category</Label>
              <FormControl>
                <Autocomplete
                  options={categoryOptions}
                  placeholder="Select category"
                  value={form.watch('categoryId')}
                  onChange={value => form.setValue('categoryId', value, { shouldValidate: true })}
                  disabled={isSubmitting || isLoadingCategories}
                />
              </FormControl>
              <FormMessage>{form.formState.errors.categoryId?.message}</FormMessage>
            </FormItem>

            <FormItem>
              <Label htmlFor="message">Message</Label>
              <FormControl>
                <Textarea
                  {...form.register('message')}
                  placeholder="Write a short message..."
                  disabled={isSubmitting}
                  rows={4}
                />
              </FormControl>
              <FormMessage>{form.formState.errors.message?.message}</FormMessage>
            </FormItem>

            {/* Hidden field for organization ID */}
            <input type="hidden" {...form.register('organizationId')} />

            <DialogFooter>
              <Button variant="outline" type="button" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || !organizationId}>
                {isSubmitting ? 'Creating...' : 'Create Kudo'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

// Export the wrapped component
export const CreateKudoModal = CreateKudoModalWithProvider;
