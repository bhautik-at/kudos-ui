**`InviteUsersForm.tsx`** - Define form for inviting users with just emails

```typescript
// src/features/userManagement/presentation/components/InviteUsersForm.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form } from '@/shared/components/atoms/Form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/shared/components/atoms/Form';
import { Textarea } from '@/shared/components/atoms/Textarea';
import { Input } from '@/shared/components/atoms/Input';
import { Button } from '@/shared/components/atoms/Button';
import { useUserManagement } from '../contexts/UserManagementContext';
import { toastService } from '@/shared/services/toast';

// Form schema
const inviteUsersSchema = z.object({
  emailsText: z.string().min(1, 'Please enter at least one email address')
});

type InviteUsersFormValues = z.infer<typeof inviteUsersSchema>;

export const InviteUsersForm: React.FC = () => {
  const { isLoading, inviteUsers } = useUserManagement();
  const [emailCount, setEmailCount] = useState(0);

  const form = useForm<InviteUsersFormValues>({
    resolver: zodResolver(inviteUsersSchema),
    defaultValues: {
      emailsText: ''
    }
  });

  // Parse multiple emails from text input
  const parseEmails = (text: string): string[] => {
    // Split by commas, semicolons, spaces, and newlines
    const emails = text
      .split(/[,;\s\n]+/)
      .map(email => email.trim())
      .filter(email => email.length > 0);

    // Simple validation to remove obviously invalid emails
    const validEmails = emails.filter(email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
    setEmailCount(validEmails.length);

    return validEmails;
  };

  // Update email count on input change
  const handleEmailsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const emails = parseEmails(e.target.value);
    setEmailCount(emails.length);
  };

  const onSubmit = async (data: InviteUsersFormValues) => {
    const emails = parseEmails(data.emailsText);

    if (emails.length === 0) {
      form.setError('emailsText', {
        type: 'manual',
        message: 'Please enter at least one valid email address'
      });
      return;
    }

    try {
      await inviteUsers(emails);
      toastService.success(`Successfully invited ${emails.length} users`);
      form.reset();
      setEmailCount(0);
    } catch (error) {
      toastService.error(
        'Failed to invite users',
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="emailsText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Addresses</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter email addresses separated by commas, spaces, or new lines"
                  {...field}
                  disabled={isLoading}
                  rows={6}
                  onChange={(e) => {
                    field.onChange(e);
                    handleEmailsChange(e);
                  }}
                />
              </FormControl>
              <FormDescription>
                {emailCount > 0
                  ? `${emailCount} valid email${emailCount === 1 ? '' : 's'} detected`
                  : 'Enter one or more email addresses'}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Inviting...' : 'Invite Users'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
```

**`InviteUserModal.tsx`** - Define modal for the invite user form

```typescript
// src/features/userManagement/presentation/components/InviteUserModal.tsx
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/shared/components/atoms/Dialog';
import { useUserManagement } from '../contexts/UserManagementContext';
import { InviteUsersForm } from './InviteUsersForm';

export const InviteUserModal: React.FC = () => {
  const { isInviteModalOpen, closeInviteModal } = useUserManagement();

  return (
    <Dialog open={isInviteModalOpen} onOpenChange={closeInviteModal}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Invite Team Members</DialogTitle>
          <DialogDescription>
            Enter the email addresses of people you'd like to invite to your team.
          </DialogDescription>
        </DialogHeader>
        <InviteUsersForm />
      </DialogContent>
    </Dialog>
  );
};
```

**`UserManagementHeader.tsx`** - Define the header with invite button

```typescript
// src/features/userManagement/presentation/components/UserManagementHeader.tsx
import React from 'react';
import { Button } from '@/shared/components/atoms/Button';
import { useUserManagement } from '../contexts/UserManagementContext';
import { UserPlus } from 'lucide-react';

export const UserManagementHeader: React.FC = () => {
  const { openInviteModal } = useUserManagement();

  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold">User Management</h1>
      <Button onClick={openInviteModal} className="flex items-center gap-2">
        <UserPlus className="h-4 w-4" />
        <span>Invite Team Member</span>
      </Button>
    </div>
  );
};
```

#### Template

**`UserManagementTemplate.tsx`** - Define the template for the user management page

```typescript
// src/features/userManagement/presentation/templates/UserManagementTemplate.tsx
import React from 'react';
import { UserManagementProvider } from '../contexts/UserManagementContext';
import { UserManagementHeader } from '../components/UserManagementHeader';
import { UserTable } from '../components/UserTable';
import { InviteUserModal } from '../components/InviteUserModal';
import { DashboardLayout } from '@/shared/components/templates/DashboardLayout';

export const UserManagementTemplate: React.FC = () => {
  return (
    <DashboardLayout>
      <UserManagementProvider>
        <div className="container mx-auto py-4">
          <UserManagementHeader />
          <UserTable />
          <InviteUserModal />
        </div>
      </UserManagementProvider>
    </DashboardLayout>
  );
};
```

### 5. Page Component

**`user-management.tsx`** - Define the page component for the user management route

```typescript
// src/pages/user-management.tsx
import { NextPage } from 'next';
import Head from 'next/head';
import { UserManagementTemplate } from '@/features/userManagement/presentation/templates/UserManagementTemplate';

const UserManagementPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>User Management | Kudos</title>
        <meta name="description" content="Manage users and team members" />
      </Head>
      <UserManagementTemplate />
    </>
  );
};

export default UserManagementPage;
```

## Implementation Steps

Follow these steps to implement the User Management feature:

1. **Set up the Domain Layer**:

   - Create the `Role.ts` entity
   - Create the `UserManagementUser.ts` entity
   - Define the `IUserManagementRepository.ts` interface
   - Implement domain-specific errors

2. **Implement the Application Layer**:

   - Create DTOs for all operations
   - Implement mappers for entity-DTO conversion
   - Create the use cases for all required operations

3. **Build the Infrastructure Layer**:

   - Create the API client for user management operations
   - Implement the repository to handle API interactions

4. **Develop the Presentation Layer**:

   - Create a context to manage user management state
   - Implement UI components for the user table
   - Build the invite user form and modal
   - Create a template to compose all components

5. **Create the Page Component**:
   - Create the user management page at `/user-management`
   - Use the template in the page component

## API Endpoints Required

The feature requires these API endpoints to be implemented on the backend:

1. `GET /api/users` - Fetch users with pagination and sorting

   - Query parameters: `page`, `pageSize`, `sortField`, `sortDirection`
   - Returns: Paginated list of users with roles

2. `GET /api/roles` - Fetch available roles

   - Returns: List of roles (Team Member, Team Lead)

3. `PATCH /api/users/{userId}/role` - Update a user's role

   - Request body: `{ roleId: string }`
   - Returns: Updated user object

4. `POST /api/users/invite` - Invite a new user
   - Request body: `{ email, firstName, lastName, roleId }`
   - Returns: Created user object

## Testing Strategy

Tests should be implemented for each layer:

1. **Domain Layer Tests**:

   - Test the `Role` and `UserManagementUser` entities
   - Validate entity behaviors and constraints

2. **Application Layer Tests**:

   - Test use cases with mocked repositories
   - Verify DTO transformations

3. **Infrastructure Layer Tests**:

   - Test the repository with mocked API responses
   - Validate API request/response handling

4. **Presentation Layer Tests**:

   - Test UI components with React Testing Library
   - Verify component behaviors and user interactions

5. **Integration Tests**:
   - Test the entire feature end-to-end
   - Verify data flow through all layers

## Dependencies

This feature depends on these shared components:

1. `@/shared/components/atoms/Table`
2. `@/shared/components/atoms/Button`
3. `@/shared/components/atoms/Select`
4. `@/shared/components/atoms/Pagination`
5. `@/shared/components/atoms/Dialog`
6. `@/shared/components/atoms/Form`
7. `@/shared/components/atoms/Input`
8. `@/shared/services/toast`

## Conclusion

This implementation plan follows the clean architecture principles and meets all the requirements:

1. Creates a user management page at the `/user-management` route
2. Adds an "Invite Team Member" button in the top right corner
3. Displays user details in a table with:
   - Name (First Name + Last Name)
   - Email
   - Role (dropdown with Team Member and Team Lead options)
4. Supports sorting by name (ascending/descending)
5. Implements pagination for the user table

The feature is organized into domain, application, infrastructure, and presentation layers, following the project's architectural guidelines.
