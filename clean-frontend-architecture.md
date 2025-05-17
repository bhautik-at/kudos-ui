# Clean Frontend Architecture for Next.js

## Overview

This document outlines a clean, modular frontend architecture for Next.js applications using Pages Router that incorporates DTOs and Mappers to create clear boundaries between layers. The architecture is organized by features, with each feature containing its own layered structure.

## Core Principles

- **Separation of Concerns**: Each layer has a specific responsibility
- **Dependency Rule**: Dependencies point inward (UI → Application → Domain)
- **Data Transformation**: DTOs and Mappers handle data translation between layers
- **Testability**: Components can be tested in isolation
- **Single Responsibility**: Each class/module does one thing well
- **Feature-First Organization**: Code is organized primarily by feature rather than by layer

## Folder Structure

```
src/
├── pages/                  # Next.js pages router
│   ├── api/                # API routes
│   │   └── <feature>/      # Feature-specific API routes
│   └── [...route paths]    # Page components
│
├── features/               # Feature Modules (organized by domain concept)
│   └── <feature>/          # e.g., users, products, auth
│       ├── domain/         # Domain Layer
│       │   ├── entities/   # Domain entities
│       │   │   ├── User.ts
│       │   │   └── User.test.ts     # Unit tests parallel to source
│       │   ├── interfaces/ # Core contracts
│       │   └── errors/     # Custom error types
│       │
│       ├── application/    # Application Layer
│       │   ├── dtos/       # Data Transfer Objects
│       │   │   ├── InputDto.ts     # Input DTOs
│       │   │   └── OutputDto.ts    # Output DTOs
│       │   ├── mappers/    # Object mappers
│       │   │   ├── EntityToDtoMapper.ts
│       │   │   ├── EntityToDtoMapper.test.ts  # Unit tests
│       │   │   ├── DtoToEntityMapper.ts
│       │   │   └── DtoToEntityMapper.test.ts
│       │   ├── useCases/   # Business logic
│       │   │   ├── CreateUserUseCase.ts
│       │   │   └── CreateUserUseCase.test.ts  # Integration tests
│       │   └── commands/   # Command objects
│       │
│       ├── infrastructure/ # Infrastructure Layer
│       │   ├── api/        # API clients
│       │   │   ├── UserApiClient.ts
│       │   │   └── UserApiClient.test.ts
│       │   └── repositories/ # Repository implementations
│       │       ├── UserRepository.ts
│       │       └── UserRepository.test.ts
│       │
│       ├── e2e/            # End-to-end tests with Playwright
│       │   ├── user-registration.spec.ts
│       │   └── user-profile.spec.ts
│       │
│       └── presentation/   # Presentation Layer
│           ├── components/ # Feature-specific components
│           │   ├── UserForm.tsx
│           │   └── UserForm.test.tsx  # Unit/Integration tests
│           ├── templates/  # Feature-specific page templates
│           │   ├── UserProfileTemplate.tsx
│           │   └── UserProfileTemplate.test.tsx
│           ├── hooks/      # React hooks
│           │   ├── useUser.ts
│           │   └── useUser.test.ts
│           └── utils/      # UI utilities
│
├── components/             # shadcn/ui components (auto-generated)
│   └── ui/                 # Generated UI components
│       ├── button.tsx      # Example: shadcn Button component
│       ├── input.tsx       # Example: shadcn Input component
│       └── ...             # Other shadcn components
│
├── shared/                 # Shared code across features
│   ├── interfaces/         # Shared interfaces and type definitions
│   │   ├── User.ts
│   │   └── ApiResponse.ts
│   ├── services/           # Shared services for API calls, data handling
│   │   ├── api.ts
│   │   └── auth.ts
│   ├── components/         # Reusable UI components (follows Atomic Design)
│   │   ├── atoms/          # Basic building blocks (buttons, inputs, etc.)
│   │   │   ├── Button.tsx
│   │   │   └── Button.test.tsx
│   │   ├── molecules/      # Combinations of atoms (form fields, search bars)
│   │   └── organisms/      # Complex components (forms, tables)
│   ├── types/              # TypeScript type definitions
│   │   ├── common.ts
│   │   └── enums.ts
│   └── utils/              # Helper functions, formatters, constants
│       ├── formats.ts
│       └── validation.ts
│
├── lib/                    # Utility functions
│   ├── utils/              # Helper functions
│   ├── constants/          # Constant values
│   └── hooks/              # Global hooks
│
├── styles/                 # Global styles
├── public/                 # Static assets
└── types/                  # TypeScript type definitions
```

### Simplified Root Structure

```
/
├── public/               # Static assets
├── src/                  # Source code
│   ├── pages/            # Next.js Pages Router
│   ├── features/         # Feature modules
│   ├── components/       # shadcn/ui components (auto-generated)
│   ├── shared/           # Shared modules across features (with simplified structure)
│   ├── lib/              # Shared utilities and configurations
│   └── styles/           # Global styles
├── jest.config.js        # Jest configuration
├── playwright.config.ts  # Playwright configuration
└── config files          # package.json, tsconfig.json, etc.
```

## shadcn/ui Component Installation and Usage

This architecture uses shadcn/ui components that are wrapped in our own component abstractions following atomic design principles.

### Installing Components

To add a new shadcn component:

```bash
# Install a component (e.g., button)
npx shadcn@latest add button
```

This will generate the component in the `src/components/ui` directory according to the shadcn configuration.

### Component Wrapper Pattern

For each shadcn component, create a wrapper in the appropriate atomic design category:

```typescript
// src/shared/components/atoms/Button.tsx
import { forwardRef } from 'react';
import { Button as ShadcnButton, ButtonProps as ShadcnButtonProps } from '@/components/ui/button';

export interface ButtonProps extends ShadcnButtonProps {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  return <ShadcnButton ref={ref} {...props} />;
});

Button.displayName = 'Button';
```

### Usage in Application

Always import from the wrapper components, not directly from shadcn:

```typescript
// CORRECT
import { Button } from '@/shared/components/atoms/Button';

// INCORRECT
import { Button } from '@/components/ui/button';
```

This maintains the separation between the UI library and your application components.

## Testing Strategy

This architecture emphasizes testability with a comprehensive testing approach:

### Unit Tests

- Located parallel to the source files they test
- Focus on testing individual units in isolation
- Use Jest as the testing framework
- Mock dependencies for true unit testing
- Cover domain entities, mappers, and small components

```typescript
// features/users/domain/entities/User.test.ts
import { User } from './User';

describe('User Entity', () => {
  it('should validate email format', () => {
    expect(
      () =>
        new User({
          username: 'testuser',
          email: 'invalid-email',
          firstName: 'Test',
          lastName: 'User',
          password: 'password123',
        })
    ).toThrow('Invalid email format');
  });

  it('should validate username length', () => {
    expect(
      () =>
        new User({
          username: 'ab',
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          password: 'password123',
        })
    ).toThrow('Username must be at least 3 characters long');
  });

  it('should create a valid user', () => {
    const user = new User({
      username: 'testuser',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      password: 'password123',
    });

    expect(user.username).toBe('testuser');
    expect(user.email).toBe('test@example.com');
    expect(user.firstName).toBe('Test');
    expect(user.lastName).toBe('User');
    expect(user.fullName).toBe('Test User');
    expect(user.passwordHash).toContain('hashed_');
  });
});
```

### Integration Tests

- Also located parallel to the source files
- Test interactions between units
- Use Jest with strategic mocking
- Focus on use cases, repositories, and complex components
- Validate behavior across boundaries

```typescript
// features/users/application/useCases/CreateUserUseCase.test.ts
import { CreateUserUseCase } from './CreateUserUseCase';
import { UserRepository } from '../../infrastructure/repositories/UserRepository';
import { EmailAlreadyExistsError } from '../../domain/errors/EmailAlreadyExistsError';

// Mock the repository
jest.mock('../../infrastructure/repositories/UserRepository');

describe('CreateUserUseCase', () => {
  let userRepository: jest.Mocked<UserRepository>;
  let createUserUseCase: CreateUserUseCase;

  beforeEach(() => {
    userRepository = new UserRepository() as jest.Mocked<UserRepository>;
    createUserUseCase = new CreateUserUseCase(userRepository);
  });

  it('should throw an error when email already exists', async () => {
    // Arrange
    userRepository.emailExists.mockResolvedValue(true);

    // Act & Assert
    await expect(
      createUserUseCase.execute({
        username: 'testuser',
        email: 'existing@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
      })
    ).rejects.toThrow(EmailAlreadyExistsError);
  });

  it('should create a user and return DTO when valid input is provided', async () => {
    // Arrange
    userRepository.emailExists.mockResolvedValue(false);
    userRepository.save.mockImplementation(user =>
      Promise.resolve({
        ...user,
        id: '123',
        role: { id: '2', name: 'user' },
        createdAt: new Date('2023-01-01'),
      })
    );

    // Act
    const result = await createUserUseCase.execute({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
    });

    // Assert
    expect(result.id).toBe('123');
    expect(result.username).toBe('testuser');
    expect(result.email).toBe('test@example.com');
    expect(result.displayName).toBe('Test User');
    expect(result.role).toBe('user');
    expect(result).not.toHaveProperty('password');
  });
});
```

### End-to-End Tests

- Located in feature-specific `e2e` folders
- Use Playwright for browser automation
- Test complete user flows
- Verify the system works as a whole
- Focus on critical user journeys

```typescript
// features/users/e2e/user-registration.spec.ts
import { test, expect } from '@playwright/test';

test.describe('User Registration', () => {
  test('should register a new user successfully', async ({ page }) => {
    // Navigate to registration page
    await page.goto('/register');

    // Fill the form
    await page.fill('[name="username"]', 'newuser');
    await page.fill('[name="email"]', 'newuser@example.com');
    await page.fill('[name="password"]', 'Password123!');
    await page.fill('[name="firstName"]', 'New');
    await page.fill('[name="lastName"]', 'User');

    // Submit the form
    await page.click('button[type="submit"]');

    // Verify success - redirected to dashboard
    await expect(page).toHaveURL('/dashboard');

    // Verify user is logged in
    await expect(page.locator('[data-testid="user-greeting"]')).toContainText('New User');
  });

  test('should show error for existing email', async ({ page }) => {
    // Navigate to registration page
    await page.goto('/register');

    // Fill the form with existing email
    await page.fill('[name="username"]', 'existinguser');
    await page.fill('[name="email"]', 'existing@example.com');
    await page.fill('[name="password"]', 'Password123!');
    await page.fill('[name="firstName"]', 'Existing');
    await page.fill('[name="lastName"]', 'User');

    // Submit the form
    await page.click('button[type="submit"]');

    // Verify error message
    await expect(page.locator('.text-red-500')).toContainText('Email already exists');

    // Verify we're still on the registration page
    await expect(page).toHaveURL('/register');
  });
});
```

## Example: Atom Component as a shadcn Wrapper

```typescript
// shared/components/atoms/Button.tsx
import { forwardRef } from 'react';
import { Button as ShadcnButton, ButtonProps as ShadcnButtonProps } from '@/components/ui/button';

export interface ButtonProps extends ShadcnButtonProps {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  return <ShadcnButton ref={ref} {...props} />;
});

Button.displayName = 'Button';
```

## DTOs (Data Transfer Objects)

DTOs are simple data structures used to transfer data between layers. They:

- Decouple the domain model from external interfaces
- Expose only necessary data for each use case
- Ensure type safety across layer boundaries
- Control what data is exposed to the UI or API

### DTO Types

1. **Input DTOs**: Represent data coming into use cases
2. **Output DTOs**: Represent data returning from use cases

### Example DTOs

```typescript
// features/users/application/dtos/CreateUserInputDto.ts
export interface CreateUserInputDto {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

// features/users/application/dtos/UserOutputDto.ts
export interface UserOutputDto {
  id: string;
  username: string;
  email: string;
  displayName: string;
  role: string;
  createdAt: string;
}
```

## Mappers

Mappers are responsible for transforming data between different layers:

- **Domain to DTO**: Convert domain entities to DTOs for external consumption
- **DTO to Domain**: Convert DTOs to domain entities for business logic
- **API to Domain**: Convert API responses to domain entities

### Example Mappers

```typescript
// features/users/application/mappers/UserToOutputDtoMapper.ts
import { User } from '../../domain/entities/User';
import { UserOutputDto } from '../dtos/UserOutputDto';

export class UserToOutputDtoMapper {
  static toDto(user: User): UserOutputDto {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      displayName: `${user.firstName} ${user.lastName}`,
      role: user.role.name,
      createdAt: user.createdAt.toISOString(),
    };
  }

  static toDtoList(users: User[]): UserOutputDto[] {
    return users.map(user => this.toDto(user));
  }
}

// features/users/application/mappers/InputDtoToUserMapper.ts
import { User } from '../../domain/entities/User';
import { CreateUserInputDto } from '../dtos/CreateUserInputDto';

export class InputDtoToUserMapper {
  static toEntity(dto: CreateUserInputDto): User {
    return new User({
      username: dto.username,
      email: dto.email,
      firstName: dto.firstName,
      lastName: dto.lastName,
      password: dto.password, // Domain handles password hashing
    });
  }
}
```

## Use Cases with Mappers and DTOs

```typescript
// features/users/application/useCases/CreateUserUseCase.ts
import { UserRepository } from '../../domain/interfaces/UserRepository';
import { EmailAlreadyExistsError } from '../../domain/errors/EmailAlreadyExistsError';
import { CreateUserInputDto } from '../dtos/CreateUserInputDto';
import { UserOutputDto } from '../dtos/UserOutputDto';
import { InputDtoToUserMapper } from '../mappers/InputDtoToUserMapper';
import { UserToOutputDtoMapper } from '../mappers/UserToOutputDtoMapper';

export class CreateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(inputDto: CreateUserInputDto): Promise<UserOutputDto> {
    // Convert input DTO to domain entity
    const user = InputDtoToUserMapper.toEntity(inputDto);

    // Business logic
    if (await this.userRepository.emailExists(user.email)) {
      throw new EmailAlreadyExistsError();
    }

    // Save entity
    const savedUser = await this.userRepository.save(user);

    // Convert domain entity to output DTO
    return UserToOutputDtoMapper.toDto(savedUser);
  }
}
```

## Next.js Pages Integration

### API Routes

```typescript
// pages/api/users/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { CreateUserUseCase } from '@/features/users/application/useCases/CreateUserUseCase';
import { UserRepository } from '@/features/users/infrastructure/repositories/UserRepository';
import { EmailAlreadyExistsError } from '@/features/users/domain/errors/EmailAlreadyExistsError';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Instantiate dependencies
    const userRepository = new UserRepository();
    const createUserUseCase = new CreateUserUseCase(userRepository);

    // Execute use case with input DTO
    const userDto = await createUserUseCase.execute(req.body);

    // Return output DTO
    return res.status(201).json(userDto);
  } catch (error) {
    // Error handling
    if (error instanceof EmailAlreadyExistsError) {
      return res.status(409).json({ message: error.message });
    }

    return res.status(500).json({ message: 'Internal server error' });
  }
}
```

### React Hooks

```typescript
// features/users/presentation/hooks/useCreateUser.ts
import { useState } from 'react';
import { CreateUserInputDto } from '../../application/dtos/CreateUserInputDto';
import { UserOutputDto } from '../../application/dtos/UserOutputDto';

export function useCreateUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createUser = async (inputDto: CreateUserInputDto) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputDto),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create user');
      }

      return (await response.json()) as UserOutputDto;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createUser, loading, error };
}
```

### Presentation Components

```tsx
// features/users/presentation/components/UserRegistrationForm.tsx
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { useCreateUser } from '../hooks/useCreateUser';
import { CreateUserInputDto } from '../../application/dtos/CreateUserInputDto';
import { Button } from '@/shared/components/atoms/Button';
import { Input } from '@/shared/components/atoms/Input';
import { Form } from '@/shared/components/organisms/Form';

export function UserRegistrationForm() {
  const { createUser, loading, error } = useCreateUser();
  const router = useRouter();
  const form = useForm<CreateUserInputDto>();

  const onSubmit = async (data: CreateUserInputDto) => {
    try {
      await createUser(data);
      router.push('/dashboard');
    } catch (err) {
      // Error handling done by the hook
    }
  };

  return (
    <Form onSubmit={form.handleSubmit(onSubmit)}>
      <Form.Field>
        <Form.Label>Username</Form.Label>
        <Input {...form.register('username', { required: true })} />
        {form.formState.errors.username && <Form.Error>Username is required</Form.Error>}
      </Form.Field>

      <Form.Field>
        <Form.Label>Email</Form.Label>
        <Input type="email" {...form.register('email', { required: true })} />
        {form.formState.errors.email && <Form.Error>Email is required</Form.Error>}
      </Form.Field>

      <Form.Field>
        <Form.Label>Password</Form.Label>
        <Input type="password" {...form.register('password', { required: true })} />
        {form.formState.errors.password && <Form.Error>Password is required</Form.Error>}
      </Form.Field>

      <Form.Field>
        <Form.Label>First Name</Form.Label>
        <Input {...form.register('firstName', { required: true })} />
        {form.formState.errors.firstName && <Form.Error>First name is required</Form.Error>}
      </Form.Field>

      <Form.Field>
        <Form.Label>Last Name</Form.Label>
        <Input {...form.register('lastName', { required: true })} />
        {form.formState.errors.lastName && <Form.Error>Last name is required</Form.Error>}
      </Form.Field>

      {error && (
        <div className="text-red-500" role="alert">
          {error.message}
        </div>
      )}

      <Button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Account'}
      </Button>
    </Form>
  );
}
```

## Page Component Example

```tsx
// pages/register.tsx
import type { NextPage } from 'next';
import Head from 'next/head';
import { MainLayout } from '@/shared/components/templates/MainLayout';
import { UserRegistrationForm } from '@/features/users/presentation/components/UserRegistrationForm';

const RegisterPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Register | My App</title>
      </Head>
      <MainLayout>
        <div className="container mx-auto py-10">
          <h1 className="text-2xl font-bold mb-6">Create an Account</h1>
          <UserRegistrationForm />
        </div>
      </MainLayout>
    </>
  );
};

export default RegisterPage;
```

## Domain Model Example

```typescript
// features/users/domain/entities/User.ts
import { Role } from './Role';

interface UserProps {
  id?: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role?: Role;
  createdAt?: Date;
}

export class User {
  readonly id?: string;
  readonly username: string;
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly passwordHash: string;
  readonly role: Role;
  readonly createdAt: Date;

  constructor(props: UserProps) {
    this.id = props.id;
    this.username = props.username;
    this.email = props.email.toLowerCase();
    this.firstName = props.firstName;
    this.lastName = props.lastName;
    this.passwordHash = this.hashPassword(props.password);
    this.role = props.role || { id: '2', name: 'user' }; // Default role
    this.createdAt = props.createdAt || new Date();

    this.validate();
  }

  private validate(): void {
    if (!this.email.includes('@')) {
      throw new Error('Invalid email format');
    }

    if (this.username.length < 3) {
      throw new Error('Username must be at least 3 characters long');
    }
  }

  private hashPassword(password: string): string {
    // In a real implementation, use a proper hashing library
    return `hashed_${password}`;
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
```

## Benefits of This Architecture

1. **Feature Cohesion**: All related code is grouped by feature, improving discoverability
2. **Clean Layer Separation**: DTOs and mappers create clear boundaries
3. **Type Safety**: Strong typing across layer boundaries
4. **Data Control**: Control what data passes between layers
5. **Testability**: Easy to mock DTOs for testing
6. **Flexibility**: UI can evolve independently of domain logic
