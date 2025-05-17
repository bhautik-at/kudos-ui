import React, { useState, KeyboardEvent } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form } from '@/shared/components/atoms/Form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/shared/components/atoms/Form';
import { Input } from '@/shared/components/atoms/Input';
import { Button } from '@/shared/components/atoms/Button';
import { X } from 'lucide-react';
import { useUserManagement } from '../contexts/UserManagementContext';
import { toastService } from '@/shared/services/toast';

// Form schema
const inviteUsersSchema = z.object({
  email: z.string().email('Please enter a valid email address').or(z.string().length(0)),
});

type InviteUsersFormValues = z.infer<typeof inviteUsersSchema>;

export const InviteUsersForm: React.FC = () => {
  const { isLoading, inviteUsers } = useUserManagement();
  const [emails, setEmails] = useState<string[]>([]);

  const form = useForm<InviteUsersFormValues>({
    resolver: zodResolver(inviteUsersSchema),
    defaultValues: {
      email: '',
    },
  });

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const addEmail = (email: string) => {
    const trimmedEmail = email.trim();
    if (trimmedEmail && isValidEmail(trimmedEmail) && !emails.includes(trimmedEmail)) {
      setEmails([...emails, trimmedEmail]);
      form.reset({ email: '' });
    } else if (trimmedEmail && !isValidEmail(trimmedEmail)) {
      form.setError('email', {
        type: 'manual',
        message: 'Please enter a valid email address',
      });
    }
  };

  const removeEmail = (email: string) => {
    setEmails(emails.filter(e => e !== email));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const email = form.getValues('email');
      addEmail(email);
    }
  };

  const onSubmit = async (data: InviteUsersFormValues) => {
    // Add the current email if valid
    if (data.email) {
      addEmail(data.email);
    }

    if (emails.length === 0) {
      form.setError('email', {
        type: 'manual',
        message: 'Please add at least one email address',
      });
      return;
    }

    try {
      await inviteUsers(emails);
      toastService.success(`Successfully invited ${emails.length} users`);
      setEmails([]);
      form.reset();
    } catch (error) {
      toastService.error(
        `Failed to invite users: ${error instanceof Error ? error.message : 'An unexpected error occurred'}`
      );
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Addresses</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter email address and press Enter"
                  {...field}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading}
                />
              </FormControl>
              <FormDescription>Enter email addresses and press Enter to add them</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email tags */}
        {emails.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {emails.map(email => (
              <div
                key={email}
                className="flex items-center gap-1 px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded-full"
              >
                <span>{email}</span>
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-800"
                  onClick={() => removeEmail(email)}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end mt-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Inviting...' : 'Invite Users'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
