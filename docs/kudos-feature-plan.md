# Kudos Feature Implementation Plan

This document outlines the implementation plan for the Kudos feature based on Clean Architecture principles.

## Feature Requirements

1. Add "Create Kudo" button on the dashboard (right corner), visible only to users with "tech_leader" role
2. Create a modal dialog with the following form fields:
   - Recipient's Name (Autocomplete - fetched from API)
   - Team Name (Autocomplete - static data for now)
   - Category (Autocomplete - static data for now)
   - Short Message (Textarea)
3. Submit the form to create a new kudo via API

## Implementation Plan

### 1. Domain Layer

#### 1.1 Entities

```typescript
// src/features/kudos/domain/entities/Kudo.ts
export interface KudoProps {
  id?: string;
  recipientId: string;
  senderId: string;
  teamId: string;
  categoryId: string;
  message: string;
  organizationId: string;
  createdAt?: Date;
}

export class Kudo {
  readonly id?: string;
  readonly recipientId: string;
  readonly senderId: string;
  readonly teamId: string;
  readonly categoryId: string;
  readonly message: string;
  readonly organizationId: string;
  readonly createdAt: Date;

  constructor(props: KudoProps) {
    this.id = props.id;
    this.recipientId = props.recipientId;
    this.senderId = props.senderId;
    this.teamId = props.teamId;
    this.categoryId = props.categoryId;
    this.message = props.message;
    this.organizationId = props.organizationId;
    this.createdAt = props.createdAt || new Date();

    this.validate();
  }

  private validate(): void {
    if (!this.recipientId) {
      throw new Error('Recipient is required');
    }
    if (!this.senderId) {
      throw new Error('Sender is required');
    }
    if (!this.teamId) {
      throw new Error('Team is required');
    }
    if (!this.categoryId) {
      throw new Error('Category is required');
    }
    if (!this.message || this.message.trim().length === 0) {
      throw new Error('Message is required');
    }
    if (!this.organizationId) {
      throw new Error('Organization is required');
    }
  }
}
```

#### 1.2 Interfaces

```typescript
// src/features/kudos/domain/interfaces/KudoRepository.ts
import { Kudo } from '../entities/Kudo';

export interface KudoRepository {
  create(kudo: Kudo): Promise<Kudo>;
  findById(id: string, organizationId: string): Promise<Kudo | null>;
  findByRecipient(recipientId: string, organizationId: string): Promise<Kudo[]>;
}
```

#### 1.3 Errors

```typescript
// src/features/kudos/domain/errors/KudoValidationError.ts
export class KudoValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'KudoValidationError';
  }
}
```

### 2. Application Layer

#### 2.1 DTOs

```typescript
// src/features/kudos/application/dtos/CreateKudoInputDto.ts
export interface CreateKudoInputDto {
  recipientId: string;
  teamId: string;
  categoryId: string;
  message: string;
  organizationId: string;
}

// src/features/kudos/application/dtos/KudoOutputDto.ts
export interface KudoOutputDto {
  id: string;
  recipientId: string;
  recipientName: string;
  senderId: string;
  senderName: string;
  teamId: string;
  teamName: string;
  categoryId: string;
  categoryName: string;
  message: string;
  organizationId: string;
  createdAt: string;
}
```

#### 2.2 Mappers

```typescript
// src/features/kudos/application/mappers/KudoToOutputDtoMapper.ts
import { Kudo } from '../../domain/entities/Kudo';
import { KudoOutputDto } from '../dtos/KudoOutputDto';

export class KudoToOutputDtoMapper {
  static toDto(
    kudo: Kudo,
    recipientName: string,
    senderName: string,
    teamName: string,
    categoryName: string
  ): KudoOutputDto {
    return {
      id: kudo.id || '',
      recipientId: kudo.recipientId,
      recipientName,
      senderId: kudo.senderId,
      senderName,
      teamId: kudo.teamId,
      teamName,
      categoryId: kudo.categoryId,
      categoryName,
      message: kudo.message,
      organizationId: kudo.organizationId,
      createdAt: kudo.createdAt.toISOString(),
    };
  }
}

// src/features/kudos/application/mappers/InputDtoToKudoMapper.ts
import { Kudo } from '../../domain/entities/Kudo';
import { CreateKudoInputDto } from '../dtos/CreateKudoInputDto';

export class InputDtoToKudoMapper {
  static toEntity(dto: CreateKudoInputDto, senderId: string): Kudo {
    return new Kudo({
      recipientId: dto.recipientId,
      senderId,
      teamId: dto.teamId,
      categoryId: dto.categoryId,
      message: dto.message,
      organizationId: dto.organizationId,
    });
  }
}
```

#### 2.3 Use Cases

```typescript
// src/features/kudos/application/useCases/CreateKudoUseCase.ts
import { KudoRepository } from '../../domain/interfaces/KudoRepository';
import { CreateKudoInputDto } from '../dtos/CreateKudoInputDto';
import { KudoOutputDto } from '../dtos/KudoOutputDto';
import { InputDtoToKudoMapper } from '../mappers/InputDtoToKudoMapper';
import { KudoToOutputDtoMapper } from '../mappers/KudoToOutputDtoMapper';
import { UserRepository } from '@/features/users/domain/interfaces/UserRepository';
import { TeamRepository } from '@/features/teams/domain/interfaces/TeamRepository';
import { CategoryRepository } from '@/features/kudos/domain/interfaces/CategoryRepository';
import { OrganizationRepository } from '@/features/organizations/domain/interfaces/OrganizationRepository';

export class CreateKudoUseCase {
  constructor(
    private kudoRepository: KudoRepository,
    private userRepository: UserRepository,
    private teamRepository: TeamRepository,
    private categoryRepository: CategoryRepository,
    private organizationRepository: OrganizationRepository
  ) {}

  async execute(inputDto: CreateKudoInputDto, senderId: string): Promise<KudoOutputDto> {
    // Convert input DTO to domain entity
    const kudo = InputDtoToKudoMapper.toEntity(inputDto, senderId);

    // Save the kudo
    const savedKudo = await this.kudoRepository.create(kudo);

    // Get additional data for the response
    const [recipient, sender, team, category] = await Promise.all([
      this.userRepository.findById(savedKudo.recipientId, savedKudo.organizationId),
      this.userRepository.findById(savedKudo.senderId, savedKudo.organizationId),
      this.teamRepository.findById(savedKudo.teamId, savedKudo.organizationId),
      this.categoryRepository.findById(savedKudo.categoryId, savedKudo.organizationId),
    ]);

    if (!recipient || !sender || !team || !category) {
      throw new Error('Required entity not found');
    }

    // Convert entity to output DTO
    return KudoToOutputDtoMapper.toDto(
      savedKudo,
      recipient.fullName,
      sender.fullName,
      team.name,
      category.name
    );
  }
}
```

### 3. Infrastructure Layer

#### 3.1 API Clients

```typescript
// src/features/kudos/infrastructure/api/KudoApiClient.ts
import { ApiError } from '@/shared/errors/ApiError';

interface KudoApiData {
  id: string;
  recipient_id: string;
  sender_id: string;
  team_id: string;
  category_id: string;
  message: string;
  organization_id: string;
  created_at: string;
}

interface CreateKudoData {
  recipient_id: string;
  team_id: string;
  category_id: string;
  message: string;
  organization_id: string;
}

export class KudoApiClient {
  private baseUrl: string;

  constructor(baseUrl = '/api') {
    this.baseUrl = baseUrl;
  }

  async createKudo(kudoData: CreateKudoData): Promise<KudoApiData> {
    try {
      const response = await fetch(`${this.baseUrl}/kudos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(kudoData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new ApiError(
          errorData.message || 'Failed to create kudo',
          response.status,
          errorData.errors
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Network error', 500);
    }
  }

  async getKudos(organizationId: string): Promise<KudoApiData[]> {
    try {
      const response = await fetch(`${this.baseUrl}/kudos?organization_id=${encodeURIComponent(organizationId)}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new ApiError(
          errorData.message || 'Failed to fetch kudos',
          response.status
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Network error', 500);
    }
  }

  async getKudoById(id: string, organizationId: string): Promise<KudoApiData> {
    try {
      const response = await fetch(`${this.baseUrl}/kudos/${id}?organization_id=${encodeURIComponent(organizationId)}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new ApiError(
          errorData.message || 'Failed to fetch kudo',
          response.status
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Network error', 500);
    }
  }
}

// src/features/users/infrastructure/api/UserApiClient.ts (extending existing client)
async getUsersForAutocomplete(query: string, organizationId: string): Promise<UserApiData[]> {
  try {
    const response = await fetch(
      `${this.baseUrl}/users/search?query=${encodeURIComponent(query)}&organization_id=${encodeURIComponent(organizationId)}`
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new ApiError(
        errorData.message || 'Failed to search users',
        response.status
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError('Network error', 500);
  }
}
```

#### 3.2 Repositories

```typescript
// src/features/kudos/infrastructure/repositories/KudoRepository.ts
import { Kudo } from '../../domain/entities/Kudo';
import { KudoRepository as KudoRepositoryInterface } from '../../domain/interfaces/KudoRepository';
import { KudoApiClient } from '../api/KudoApiClient';

export class KudoRepository implements KudoRepositoryInterface {
  constructor(private apiClient: KudoApiClient) {}

  async create(kudo: Kudo): Promise<Kudo> {
    try {
      const kudoData = await this.apiClient.createKudo({
        recipient_id: kudo.recipientId,
        team_id: kudo.teamId,
        category_id: kudo.categoryId,
        message: kudo.message,
        organization_id: kudo.organizationId,
      });

      return new Kudo({
        id: kudoData.id,
        recipientId: kudoData.recipient_id,
        senderId: kudoData.sender_id,
        teamId: kudoData.team_id,
        categoryId: kudoData.category_id,
        message: kudoData.message,
        organizationId: kudoData.organization_id,
        createdAt: new Date(kudoData.created_at),
      });
    } catch (error) {
      console.error('Error creating kudo:', error);
      throw error;
    }
  }

  async findById(id: string, organizationId: string): Promise<Kudo | null> {
    try {
      const kudoData = await this.apiClient.getKudoById(id, organizationId);

      return new Kudo({
        id: kudoData.id,
        recipientId: kudoData.recipient_id,
        senderId: kudoData.sender_id,
        teamId: kudoData.team_id,
        categoryId: kudoData.category_id,
        message: kudoData.message,
        organizationId: kudoData.organization_id,
        createdAt: new Date(kudoData.created_at),
      });
    } catch (error) {
      console.error('Error fetching kudo:', error);
      return null;
    }
  }

  async findByRecipient(recipientId: string, organizationId: string): Promise<Kudo[]> {
    try {
      // Get all kudos for the organization
      const kudosData = await this.apiClient.getKudos(organizationId);

      // Filter by recipient
      const recipientKudos = kudosData.filter(kudo => kudo.recipient_id === recipientId);

      // Map to domain entities
      return recipientKudos.map(
        kudoData =>
          new Kudo({
            id: kudoData.id,
            recipientId: kudoData.recipient_id,
            senderId: kudoData.sender_id,
            teamId: kudoData.team_id,
            categoryId: kudoData.category_id,
            message: kudoData.message,
            organizationId: kudoData.organization_id,
            createdAt: new Date(kudoData.created_at),
          })
      );
    } catch (error) {
      console.error('Error fetching kudos by recipient:', error);
      return [];
    }
  }
}
```

### 4. Presentation Layer

#### 4.1 Components

```typescript
// src/features/kudos/presentation/components/CreateKudoButton.tsx
import { Button } from '@/shared/components/atoms/Button';
import { useCurrentUser } from '@/features/auth/presentation/hooks/useCurrentUser';
import { PlusIcon } from '@heroicons/react/24/outline';

interface CreateKudoButtonProps {
  onClick: () => void;
}

export const CreateKudoButton = ({ onClick }: CreateKudoButtonProps) => {
  const { user } = useCurrentUser();

  // Only render if user has tech_leader role
  if (user?.role !== 'tech_leader') {
    return null;
  }

  return (
    <Button onClick={onClick} variant="primary">
      <PlusIcon className="h-5 w-5 mr-2" />
      Create Kudo
    </Button>
  );
};
```

```typescript
// src/features/kudos/presentation/components/CreateKudoModal.tsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/shared/components/atoms/Dialog';
import { Button } from '@/shared/components/atoms/Button';
import { Textarea } from '@/shared/components/atoms/Textarea';
import { Label } from '@/shared/components/atoms/Label';
import { Form, FormItem, FormControl, FormMessage } from '@/shared/components/atoms/Form';
import { Autocomplete } from '@/shared/components/molecules/Autocomplete';
import { useUserSearch } from '@/features/users/presentation/hooks/useUserSearch';
import { useToast } from '@/shared/hooks/useToast';
import { useCurrentOrganization } from '@/features/organizations/presentation/hooks/useCurrentOrganization';
import { CreateKudoInputDto } from '../../application/dtos/CreateKudoInputDto';

// Temporary static data for teams and categories
const STATIC_TEAMS = [
  { value: '1', label: 'Engineering' },
  { value: '2', label: 'Product' },
  { value: '3', label: 'Design' },
  { value: '4', label: 'Marketing' }
];

const STATIC_CATEGORIES = [
  { value: '1', label: 'Teamwork' },
  { value: '2', label: 'Innovation' },
  { value: '3', label: 'Leadership' },
  { value: '4', label: 'Problem Solving' }
];

// Form validation schema
const createKudoSchema = z.object({
  recipientId: z.string().min(1, 'Recipient is required'),
  teamId: z.string().min(1, 'Team is required'),
  categoryId: z.string().min(1, 'Category is required'),
  message: z.string().min(1, 'Message is required').max(500, 'Message cannot be longer than 500 characters'),
  organizationId: z.string().min(1, 'Organization is required')
});

type CreateKudoFormValues = z.infer<typeof createKudoSchema>;

interface CreateKudoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateKudoInputDto) => Promise<void>;
}

export const CreateKudoModal = ({ isOpen, onClose, onSubmit }: CreateKudoModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { organization } = useCurrentOrganization();
  const { users, searchUsers, isLoading: isLoadingUsers } = useUserSearch();
  const { toast } = useToast();

  const form = useForm<CreateKudoFormValues>({
    resolver: zodResolver(createKudoSchema),
    defaultValues: {
      recipientId: '',
      teamId: '',
      categoryId: '',
      message: '',
      organizationId: organization?.id || ''
    }
  });

  // Set organization ID whenever it changes
  React.useEffect(() => {
    if (organization?.id) {
      form.setValue('organizationId', organization.id);
    }
  }, [organization, form]);

  const handleSubmit = async (data: CreateKudoFormValues) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      toast.success('Kudo created successfully!');
      onClose();
      form.reset();
    } catch (error) {
      toast.error(`Failed to create kudo: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Map users to autocomplete options
  const userOptions = users.map(user => ({
    value: user.id,
    label: user.fullName || `${user.firstName} ${user.lastName}`
  }));

  const handleSearchUsers = (query: string) => {
    if (organization?.id) {
      searchUsers(query, organization.id);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Kudo</DialogTitle>
        </DialogHeader>

        <Form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="space-y-4 py-4">
            <FormItem>
              <Label htmlFor="recipientId">Recipient's Name</Label>
              <FormControl>
                <Autocomplete
                  options={userOptions}
                  placeholder="Select recipient"
                  value={form.watch('recipientId')}
                  onChange={value => form.setValue('recipientId', value, { shouldValidate: true })}
                  disabled={isSubmitting}
                  searchPlaceholder="Search users..."
                  emptyMessage={isLoadingUsers ? "Loading..." : "No users found"}
                  onInputChange={handleSearchUsers}
                />
              </FormControl>
              <FormMessage>{form.formState.errors.recipientId?.message}</FormMessage>
            </FormItem>

            <FormItem>
              <Label htmlFor="teamId">Team Name</Label>
              <FormControl>
                <Autocomplete
                  options={STATIC_TEAMS}
                  placeholder="Select team"
                  value={form.watch('teamId')}
                  onChange={value => form.setValue('teamId', value, { shouldValidate: true })}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage>{form.formState.errors.teamId?.message}</FormMessage>
            </FormItem>

            <FormItem>
              <Label htmlFor="categoryId">Category</Label>
              <FormControl>
                <Autocomplete
                  options={STATIC_CATEGORIES}
                  placeholder="Select category"
                  value={form.watch('categoryId')}
                  onChange={value => form.setValue('categoryId', value, { shouldValidate: true })}
                  disabled={isSubmitting}
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
          </div>

          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !organization?.id}>
              {isSubmitting ? 'Creating...' : 'Create Kudo'}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
```

#### 4.2 Hooks

```typescript
// src/features/kudos/presentation/hooks/useCreateKudo.ts
import { useState } from 'react';
import { CreateKudoInputDto } from '../../application/dtos/CreateKudoInputDto';
import { KudoOutputDto } from '../../application/dtos/KudoOutputDto';
import { KudoRepository } from '../../infrastructure/repositories/KudoRepository';
import { KudoApiClient } from '../../infrastructure/api/KudoApiClient';
import { CreateKudoUseCase } from '../../application/useCases/CreateKudoUseCase';
import { useAuth } from '@/features/auth/presentation/hooks/useAuth';
import { UserRepository } from '@/features/users/infrastructure/repositories/UserRepository';
import { UserApiClient } from '@/features/users/infrastructure/api/UserApiClient';
import { TeamRepository } from '@/features/teams/infrastructure/repositories/TeamRepository';
import { TeamApiClient } from '@/features/teams/infrastructure/api/TeamApiClient';
import { CategoryRepository } from '@/features/kudos/infrastructure/repositories/CategoryRepository';
import { CategoryApiClient } from '@/features/kudos/infrastructure/api/CategoryApiClient';
import { OrganizationRepository } from '@/features/organizations/infrastructure/repositories/OrganizationRepository';
import { OrganizationApiClient } from '@/features/organizations/infrastructure/api/OrganizationApiClient';

export const useCreateKudo = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  const createKudo = async (kudoData: CreateKudoInputDto): Promise<KudoOutputDto> => {
    if (!user?.id) {
      throw new Error('User not authenticated');
    }

    setIsLoading(true);
    setError(null);

    try {
      // Create dependencies
      const kudoApiClient = new KudoApiClient();
      const kudoRepository = new KudoRepository(kudoApiClient);

      const userApiClient = new UserApiClient();
      const userRepository = new UserRepository(userApiClient);

      const teamApiClient = new TeamApiClient();
      const teamRepository = new TeamRepository(teamApiClient);

      const categoryApiClient = new CategoryApiClient();
      const categoryRepository = new CategoryRepository(categoryApiClient);

      const organizationApiClient = new OrganizationApiClient();
      const organizationRepository = new OrganizationRepository(organizationApiClient);

      // Create use case
      const createKudoUseCase = new CreateKudoUseCase(
        kudoRepository,
        userRepository,
        teamRepository,
        categoryRepository,
        organizationRepository
      );

      // Execute use case
      const result = await createKudoUseCase.execute(kudoData, user.id);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An unknown error occurred');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { createKudo, isLoading, error };
};

// src/features/users/presentation/hooks/useUserSearch.ts
import { useState, useEffect, useCallback } from 'react';
import { User } from '@/features/users/domain/entities/User';
import { UserRepository } from '@/features/users/infrastructure/repositories/UserRepository';
import { UserApiClient } from '@/features/users/infrastructure/api/UserApiClient';

export const useUserSearch = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const searchUsers = useCallback(async (query: string, organizationId: string) => {
    if (!query || query.length < 2) {
      setUsers([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const apiClient = new UserApiClient();
      const userRepository = new UserRepository(apiClient);
      const foundUsers = await userRepository.search(query, organizationId);
      setUsers(foundUsers);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An unknown error occurred');
      setError(error);
      console.error('Error searching users:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { users, searchUsers, isLoading, error };
};
```

#### 4.3 Dashboard Integration

Modify the Dashboard component to include the "Create Kudo" button and modal:

```typescript
// src/features/dashboard/presentation/templates/DashboardTemplate.tsx (extending existing component)
import { useState } from 'react';
import { CreateKudoButton } from '@/features/kudos/presentation/components/CreateKudoButton';
import { CreateKudoModal } from '@/features/kudos/presentation/components/CreateKudoModal';
import { useCreateKudo } from '@/features/kudos/presentation/hooks/useCreateKudo';
import { CreateKudoInputDto } from '@/features/kudos/application/dtos/CreateKudoInputDto';
import { useCurrentOrganization } from '@/features/organizations/presentation/hooks/useCurrentOrganization';

export const DashboardTemplate = () => {
  const [isCreateKudoModalOpen, setIsCreateKudoModalOpen] = useState(false);
  const { createKudo } = useCreateKudo();
  const { organization } = useCurrentOrganization();

  const handleOpenCreateKudoModal = () => {
    setIsCreateKudoModalOpen(true);
  };

  const handleCloseCreateKudoModal = () => {
    setIsCreateKudoModalOpen(false);
  };

  const handleCreateKudo = async (kudoData: CreateKudoInputDto) => {
    await createKudo(kudoData);
  };

  // Only show the button if there's an active organization
  if (!organization) {
    return <div>Please select an organization</div>;
  }

  return (
    <div>
      {/* Existing dashboard content */}

      {/* Add Create Kudo button in the top-right corner */}
      <div className="absolute top-4 right-4">
        <CreateKudoButton onClick={handleOpenCreateKudoModal} />
      </div>

      {/* Create Kudo Modal */}
      <CreateKudoModal
        isOpen={isCreateKudoModalOpen}
        onClose={handleCloseCreateKudoModal}
        onSubmit={handleCreateKudo}
      />
    </div>
  );
};
```

## Testing Strategy

Each layer should have appropriate tests:

1. **Domain Layer**: Unit tests for entities, validation logic
2. **Application Layer**: Unit tests for use cases, mappers with mocks for repositories
3. **Infrastructure Layer**: Integration tests for repositories, API clients
4. **Presentation Layer**: Component tests for rendering, interactions, form validation

## Implementation Timeline

1. Domain Layer implementation - 1 day
2. Application Layer implementation - 1 day
3. Infrastructure Layer implementation - 1 day
4. Presentation Layer implementation - 2 days
5. Integration and testing - 1 day

Total estimated time: 6 days
