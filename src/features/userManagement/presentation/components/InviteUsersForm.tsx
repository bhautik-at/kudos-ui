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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium">Email Addresses</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter email address and press Enter"
                  className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  {...field}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading}
                />
              </FormControl>
              <FormDescription className="text-xs text-gray-500">
                Enter email addresses and press Enter to add them
              </FormDescription>
              <FormMessage className="text-sm text-red-500" />
            </FormItem>
          )}
        />

        {/* Email tags */}
        {emails.length > 0 && (
          <div className="rounded-lg bg-gray-50 dark:bg-gray-900 p-4 border border-gray-200 dark:border-gray-800">
            <p className="text-xs text-gray-500 mb-3 font-medium uppercase tracking-wider">
              {emails.length} {emails.length === 1 ? 'Email' : 'Emails'} Added
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {emails.map(email => (
                <div
                  key={email}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-gray-800 dark:text-gray-100 rounded-full border border-blue-100 dark:border-purple-900/20 transition-colors hover:from-blue-500/20 hover:to-purple-500/20"
                >
                  <span className="font-medium">{email}</span>
                  <button
                    type="button"
                    className="ml-1 text-gray-500 hover:text-red-500 rounded-full h-5 w-5 flex items-center justify-center transition-colors"
                    onClick={() => removeEmail(email)}
                    aria-label={`Remove ${email}`}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="pt-2">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md transition-all font-medium"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Sending Invitations...
              </span>
            ) : (
              'Invite Users'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
