# Organization Flow Implementation Plan

## Overview

This implementation plan outlines how to implement the organization flow where a user, after successful OTP verification from `/signup`, is redirected to `/organization` if no invite code is detected in the URL. The user will fill a form with an organization name, which creates an organization ID and redirects to `/dashboard?orgId="[id]"`.

## Feature Structure

Following the Clean Architecture principles, we'll implement this feature with the following structure:

```
/src
├── features/
│   └── organizations/
│       ├── domain/
│       │   ├── entities/
│       │   │   └── Organization.ts
│       │   └── interfaces/
│       │       └── OrganizationRepository.ts
│       ├── application/
│       │   ├── dtos/
│       │   │   ├── CreateOrganizationInputDto.ts
│       │   │   └── OrganizationOutputDto.ts
│       │   ├── useCases/
│       │   │   └── CreateOrganizationUseCase.ts
│       │   └── mappers/
│       │       └── OrganizationMapper.ts
│       ├── infrastructure/
│       │   ├── api/
│       │   │   └── OrganizationApiClient.ts
│       │   └── repositories/
│       │       └── OrganizationRepository.ts
│       └── presentation/
│           ├── components/
│           │   └── OrganizationForm.tsx
│           ├── templates/
│           │   └── OrganizationTemplate.tsx
│           └── hooks/
│               └── useCreateOrganization.ts
├── pages/
│   ├── organization.tsx
│   ├── signup.tsx
│   └── dashboard.tsx
└── shared/
    ├── contexts/
    │   └── AuthContext.tsx
    └── hooks/
        └── useInviteCode.ts
```

## Implementation Details

### 1. Domain Layer

#### Organization Entity

```typescript
// features/organizations/domain/entities/Organization.ts
interface OrganizationProps {
  id?: string;
  name: string;
  createdAt?: Date;
}

export class Organization {
  readonly id?: string;
  readonly name: string;
  readonly createdAt: Date;

  constructor(props: OrganizationProps) {
    this.id = props.id;
    this.name = props.name;
    this.createdAt = props.createdAt || new Date();

    this.validate();
  }

  private validate(): void {
    if (this.name.trim().length < 2) {
      throw new Error('Organization name must be at least 2 characters');
    }
  }
}
```

#### Organization Repository Interface

```typescript
// features/organizations/domain/interfaces/OrganizationRepository.ts
import { Organization } from '../entities/Organization';

export interface OrganizationRepository {
  create(organization: Organization): Promise<Organization>;
}
```

### 2. Application Layer

#### DTOs

```typescript
// features/organizations/application/dtos/CreateOrganizationInputDto.ts
export interface CreateOrganizationInputDto {
  name: string;
}

// features/organizations/application/dtos/OrganizationOutputDto.ts
export interface OrganizationOutputDto {
  id: string;
  name: string;
  createdAt: string;
}
```

#### Mappers

```typescript
// features/organizations/application/mappers/OrganizationMapper.ts
import { Organization } from '../../domain/entities/Organization';
import { CreateOrganizationInputDto } from '../dtos/CreateOrganizationInputDto';
import { OrganizationOutputDto } from '../dtos/OrganizationOutputDto';

export class OrganizationMapper {
  static toEntity(dto: CreateOrganizationInputDto): Organization {
    return new Organization({
      name: dto.name,
    });
  }

  static toDto(entity: Organization): OrganizationOutputDto {
    return {
      id: entity.id!,
      name: entity.name,
      createdAt: entity.createdAt.toISOString(),
    };
  }
}
```

#### Use Cases

```typescript
// features/organizations/application/useCases/CreateOrganizationUseCase.ts
import { OrganizationRepository } from '../../domain/interfaces/OrganizationRepository';
import { CreateOrganizationInputDto } from '../dtos/CreateOrganizationInputDto';
import { OrganizationOutputDto } from '../dtos/OrganizationOutputDto';
import { OrganizationMapper } from '../mappers/OrganizationMapper';

export class CreateOrganizationUseCase {
  constructor(private organizationRepository: OrganizationRepository) {}

  async execute(input: CreateOrganizationInputDto): Promise<OrganizationOutputDto> {
    // Convert DTO to entity
    const organization = OrganizationMapper.toEntity(input);

    // Save organization
    const savedOrganization = await this.organizationRepository.create(organization);

    // Return DTO
    return OrganizationMapper.toDto(savedOrganization);
  }
}
```

### 3. Infrastructure Layer

#### API Client

```typescript
// features/organizations/infrastructure/api/OrganizationApiClient.ts
interface OrganizationApiData {
  id: string;
  name: string;
  created_at: string;
}

interface CreateOrganizationData {
  name: string;
}

export class OrganizationApiClient {
  private baseUrl: string;

  constructor(baseUrl = '/api') {
    this.baseUrl = baseUrl;
  }

  async createOrganization(data: CreateOrganizationData): Promise<OrganizationApiData> {
    try {
      const response = await fetch(`${this.baseUrl}/organizations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create organization');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating organization:', error);
      throw error;
    }
  }
}
```

#### Repository Implementation

```typescript
// features/organizations/infrastructure/repositories/OrganizationRepository.ts
import { Organization } from '../../domain/entities/Organization';
import { OrganizationRepository as OrganizationRepositoryInterface } from '../../domain/interfaces/OrganizationRepository';
import { OrganizationApiClient } from '../api/OrganizationApiClient';

export class OrganizationRepository implements OrganizationRepositoryInterface {
  constructor(private apiClient: OrganizationApiClient) {}

  async create(organization: Organization): Promise<Organization> {
    const response = await this.apiClient.createOrganization({
      name: organization.name,
    });

    return new Organization({
      id: response.id,
      name: response.name,
      createdAt: new Date(response.created_at),
    });
  }
}
```

### 4. Presentation Layer

#### Custom Hook

```typescript
// features/organizations/presentation/hooks/useCreateOrganization.ts
import { useState } from 'react';
import { useRouter } from 'next/router';
import { CreateOrganizationInputDto } from '../../application/dtos/CreateOrganizationInputDto';
import { OrganizationOutputDto } from '../../application/dtos/OrganizationOutputDto';
import { CreateOrganizationUseCase } from '../../application/useCases/CreateOrganizationUseCase';
import { OrganizationRepository } from '../../infrastructure/repositories/OrganizationRepository';
import { OrganizationApiClient } from '../../infrastructure/api/OrganizationApiClient';
import { useToast } from '@/shared/hooks/useToast';

export function useCreateOrganization() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const router = useRouter();
  const toast = useToast();

  const createOrganization = async (orgName: string): Promise<OrganizationOutputDto | null> => {
    setIsLoading(true);
    setError(null);

    try {
      // Create dependencies
      const apiClient = new OrganizationApiClient();
      const repository = new OrganizationRepository(apiClient);
      const useCase = new CreateOrganizationUseCase(repository);

      // Create input DTO
      const input: CreateOrganizationInputDto = {
        name: orgName,
      };

      // Execute use case
      const result = await useCase.execute(input);

      // Navigate to dashboard with orgId
      router.push(`/dashboard?orgId=${result.id}`);

      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      toast.error(`Failed to create organization: ${error.message}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createOrganization,
    isLoading,
    error,
  };
}
```

#### Organization Form Component

```typescript
// features/organizations/presentation/components/OrganizationForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/shared/components/atoms/button';
import { Input } from '@/shared/components/atoms/input';
import { Form } from '@/shared/components/organisms/form';
import { FormItem } from '@/shared/components/atoms/form';
import { FormControl } from '@/shared/components/atoms/form';
import { FormMessage } from '@/shared/components/atoms/form';
import { Label } from '@/shared/components/atoms/label';

// Schema validation
const organizationFormSchema = z.object({
  name: z.string().min(2, 'Organization name must be at least 2 characters')
});

type OrganizationFormValues = z.infer<typeof organizationFormSchema>;

interface OrganizationFormProps {
  onSubmit: (data: { name: string }) => Promise<void>;
  isLoading: boolean;
  error: Error | null;
}

export function OrganizationForm({ onSubmit, isLoading, error }: OrganizationFormProps) {
  const form = useForm<OrganizationFormValues>({
    resolver: zodResolver(organizationFormSchema),
    defaultValues: {
      name: ''
    }
  });

  const handleSubmit = async (data: OrganizationFormValues) => {
    await onSubmit(data);
  };

  return (
    <Form onSubmit={form.handleSubmit(handleSubmit)}>
      <FormItem>
        <Label htmlFor="name">Organization Name</Label>
        <FormControl>
          <Input
            id="name"
            {...form.register('name')}
            placeholder="Enter your organization name"
            disabled={isLoading}
          />
        </FormControl>
        <FormMessage>{form.formState.errors.name?.message}</FormMessage>
      </FormItem>

      {error && (
        <div className="text-destructive" role="alert">
          {error.message}
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create Organization'}
      </Button>
    </Form>
  );
}
```

#### Organization Template

```typescript
// features/organizations/presentation/templates/OrganizationTemplate.tsx
import { OrganizationForm } from '../components/OrganizationForm';
import { useCreateOrganization } from '../hooks/useCreateOrganization';

export function OrganizationTemplate() {
  const { createOrganization, isLoading, error } = useCreateOrganization();

  const handleSubmit = async (data: { name: string }) => {
    await createOrganization(data.name);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-center">Create Your Organization</h1>
        <p className="mb-4 text-sm text-gray-600 text-center">
          Create an organization to start managing your projects.
        </p>

        <OrganizationForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </div>
  );
}
```

### 5. Page Components

#### Organization Page

```typescript
// pages/organization.tsx
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuth } from '@/shared/hooks/useAuth';
import { OrganizationTemplate } from '@/features/organizations/presentation/templates/OrganizationTemplate';

const OrganizationPage: NextPage = () => {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If user is not authenticated, redirect to login
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null; // Will redirect to login via useEffect
  }

  return (
    <>
      <Head>
        <title>Create Organization</title>
      </Head>
      <OrganizationTemplate />
    </>
  );
};

export default OrganizationPage;
```

#### Signup Page Modification

```typescript
// pages/signup.tsx
// Add redirect logic after successful OTP verification
import { useRouter } from 'next/router';
import { useInviteCode } from '@/shared/hooks/useInviteCode';

// Existing signup page code...

// After successful OTP verification
const handleOtpVerification = async () => {
  try {
    await verifyOtp(otp);

    // Check if invite code exists in URL
    const { inviteCode } = useInviteCode();

    if (inviteCode) {
      // Redirect to dashboard with invite code logic
      router.push(`/dashboard?inviteCode=${inviteCode}`);
    } else {
      // Redirect to organization creation
      router.push('/organization');
    }
  } catch (error) {
    toast.error(`OTP verification failed: ${error.message}`);
  }
};
```

#### Dashboard Page

```typescript
// pages/dashboard.tsx
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuth } from '@/shared/hooks/useAuth';

const DashboardPage: NextPage = () => {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { orgId } = router.query;

  useEffect(() => {
    // If user is not authenticated, redirect to login
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    // If no orgId in URL, redirect to organization creation
    if (!authLoading && user && !orgId) {
      router.push('/organization');
    }
  }, [user, authLoading, router, orgId]);

  if (authLoading || !user || !orgId) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Organization ID: {orgId}</p>
      {/* Dashboard content */}
    </div>
  );
};

export default DashboardPage;
```

### 6. Shared Hooks

```typescript
// shared/hooks/useInviteCode.ts
import { useRouter } from 'next/router';

export function useInviteCode() {
  const router = useRouter();
  const inviteCode = router.query.inviteCode as string | undefined;

  return {
    inviteCode,
    hasInviteCode: !!inviteCode,
  };
}
```

## Implementation Flow

1. Create domain layer entity and repository interface
2. Implement application layer DTOs, mapper, and use case
3. Develop infrastructure layer API client and repository (create method only)
4. Build presentation layer components, template, and hook
5. Create/modify page components with proper routing logic
6. Implement shared hooks and utilities
7. Test the complete flow

## Testing Strategy

1. **Unit Tests**: Test individual components, use cases, and repositories
2. **Integration Tests**: Test the interaction between layers
3. **E2E Tests**: Test the complete flow from signup to organization creation

## Data Flow

1. User completes signup and OTP verification
2. System checks for invite code in URL
3. If no invite code, redirect to `/organization`
4. User enters organization name
5. System creates organization and gets organization ID
6. Redirect to `/dashboard?orgId="[id]"`

This implementation follows the Clean Architecture principles and error handling guidelines outlined in the project documentation.
