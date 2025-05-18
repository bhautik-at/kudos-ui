# User Management Feature Implementation Plan

This document outlines the implementation plan for the User Management feature, following the clean architecture principles defined in the project structure.

## Requirements

1. Create a user management page at `/user-management` route
2. Add an "Invite Team Member" button in the right corner
3. Display a table with user details:
   - Name (First Name + Last Name)
   - Email
   - Team Name
   - Role (dropdown with options: Team Member, Team Lead)
   - Delete button
4. Support sorting by first name only (ascending/descending)
5. Implement pagination for the user table
6. The invite feature should support multiple emails at once

## Implementation Structure

### 1. Domain Layer

#### Entities

**`UserRole.ts`** - Define the user role enum

```typescript
// src/features/userManagement/domain/entities/UserRole.ts

export enum UserRole {
  TEAM_MEMBER = 'TEAM_MEMBER',
  TEAM_LEAD = 'TEAM_LEAD',
}
```

**`UserManagementUser.ts`** - Extended User entity with role information

```typescript
// src/features/userManagement/domain/entities/UserManagementUser.ts
import { UserRole } from './UserRole';

export interface UserManagementUserProps {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  teamName?: string;
  role: UserRole;
  isVerified?: boolean;
}

export class UserManagementUser {
  readonly id: string;
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly teamName: string;
  readonly role: UserRole;
  readonly isVerified: boolean;

  constructor(props: UserManagementUserProps) {
    this.id = props.id;
    this.email = props.email;
    this.firstName = props.firstName;
    this.lastName = props.lastName;
    this.teamName = props.teamName || '';
    this.role = props.role;
    this.isVerified = props.isVerified ?? false;
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
```

#### Interfaces

**`IUserManagementRepository.ts`** - Define the repository interface

```typescript
// src/features/userManagement/domain/interfaces/IUserManagementRepository.ts
import { UserManagementUser } from '../entities/UserManagementUser';
import { UserRole } from '../entities/UserRole';

export interface PaginationParams {
  page: number;
  pageSize: number;
  sortDirection?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  items: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

export interface IUserManagementRepository {
  /**
   * Get paginated list of users
   */
  getUsers(params: PaginationParams): Promise<PaginatedResult<UserManagementUser>>;

  /**
   * Update a user's role
   */
  updateUserRole(userId: string, role: UserRole): Promise<UserManagementUser>;

  /**
   * Invite multiple users to the team with default role (Team Member)
   */
  inviteUsers(emails: string[]): Promise<number>;

  /**
   * Delete a user
   */
  deleteUser(userId: string): Promise<boolean>;
}
```

#### Errors

**`UserManagementError.ts`** - Define domain-specific errors

```typescript
// src/features/userManagement/domain/errors/UserManagementError.ts

export class UserManagementError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UserManagementError';
  }
}

export class UserInvitationError extends UserManagementError {
  constructor(message: string = 'Failed to invite users') {
    super(message);
    this.name = 'UserInvitationError';
  }
}

export class UserRoleUpdateError extends UserManagementError {
  constructor(message: string = 'Failed to update user role') {
    super(message);
    this.name = 'UserRoleUpdateError';
  }
}

export class UserDeletionError extends UserManagementError {
  constructor(message: string = 'Failed to delete user') {
    super(message);
    this.name = 'UserDeletionError';
  }
}
```

### 2. Application Layer

#### DTOs

**`UserManagementDtos.ts`** - Define DTOs for user management

```typescript
// src/features/userManagement/application/dtos/UserManagementDtos.ts
import { UserRole } from '../../domain/entities/UserRole';

// Input DTOs
export interface GetUsersInputDto {
  page: number;
  pageSize: number;
  sortDirection?: 'asc' | 'desc';
}

export interface UpdateUserRoleInputDto {
  userId: string;
  role: UserRole;
}

export interface InviteUsersInputDto {
  emails: string[];
}

export interface DeleteUserInputDto {
  userId: string;
}

// Output DTOs
export interface UserManagementUserDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  teamName: string;
  role: UserRole;
  isVerified: boolean;
}

export interface PaginatedUsersDto {
  users: UserManagementUserDto[];
  totalUsers: number;
  totalPages: number;
  currentPage: number;
}

export interface InviteUsersResultDto {
  invitedCount: number;
}

export interface DeleteUserResultDto {
  success: boolean;
  userId: string;
}
```

#### Mappers

**`UserManagementMapper.ts`** - Define mappers for entities and DTOs

```typescript
// src/features/userManagement/application/mappers/UserManagementMapper.ts
import { UserManagementUser } from '../../domain/entities/UserManagementUser';
import { UserManagementUserDto, PaginatedUsersDto } from '../dtos/UserManagementDtos';
import { PaginatedResult } from '../../domain/interfaces/IUserManagementRepository';

export class UserManagementMapper {
  static toUserDto(user: UserManagementUser): UserManagementUserDto {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      teamName: user.teamName,
      role: user.role,
      isVerified: user.isVerified,
    };
  }

  static toPaginatedUsersDto(
    paginatedResult: PaginatedResult<UserManagementUser>
  ): PaginatedUsersDto {
    return {
      users: paginatedResult.items.map(user => this.toUserDto(user)),
      totalUsers: paginatedResult.totalItems,
      totalPages: paginatedResult.totalPages,
      currentPage: paginatedResult.currentPage,
    };
  }
}
```

#### Use Cases

**`GetUsersUseCase.ts`** - Define use case for getting paginated users

```typescript
// src/features/userManagement/application/useCases/GetUsersUseCase.ts
import { IUserManagementRepository } from '../../domain/interfaces/IUserManagementRepository';
import { GetUsersInputDto } from '../dtos/UserManagementDtos';
import { UserManagementMapper } from '../mappers/UserManagementMapper';
import { PaginatedUsersDto } from '../dtos/UserManagementDtos';

export class GetUsersUseCase {
  constructor(private userManagementRepository: IUserManagementRepository) {}

  async execute(inputDto: GetUsersInputDto): Promise<PaginatedUsersDto> {
    const paginatedUsers = await this.userManagementRepository.getUsers({
      page: inputDto.page,
      pageSize: inputDto.pageSize,
      sortDirection: inputDto.sortDirection,
    });

    return UserManagementMapper.toPaginatedUsersDto(paginatedUsers);
  }
}
```

**`UpdateUserRoleUseCase.ts`** - Define use case for updating user role

```typescript
// src/features/userManagement/application/useCases/UpdateUserRoleUseCase.ts
import { IUserManagementRepository } from '../../domain/interfaces/IUserManagementRepository';
import { UpdateUserRoleInputDto } from '../dtos/UserManagementDtos';
import { UserManagementMapper } from '../mappers/UserManagementMapper';
import { UserManagementUserDto } from '../dtos/UserManagementDtos';
import { UserRoleUpdateError } from '../../domain/errors/UserManagementError';

export class UpdateUserRoleUseCase {
  constructor(private userManagementRepository: IUserManagementRepository) {}

  async execute(inputDto: UpdateUserRoleInputDto): Promise<UserManagementUserDto> {
    try {
      const updatedUser = await this.userManagementRepository.updateUserRole(
        inputDto.userId,
        inputDto.role
      );

      return UserManagementMapper.toUserDto(updatedUser);
    } catch (error) {
      throw new UserRoleUpdateError(
        error instanceof Error ? error.message : 'Failed to update user role'
      );
    }
  }
}
```

**`InviteUsersUseCase.ts`** - Define use case for inviting multiple users

```typescript
// src/features/userManagement/application/useCases/InviteUsersUseCase.ts
import { IUserManagementRepository } from '../../domain/interfaces/IUserManagementRepository';
import { InviteUsersInputDto, InviteUsersResultDto } from '../dtos/UserManagementDtos';
import { UserInvitationError } from '../../domain/errors/UserManagementError';

export class InviteUsersUseCase {
  constructor(private userManagementRepository: IUserManagementRepository) {}

  async execute(inputDto: InviteUsersInputDto): Promise<InviteUsersResultDto> {
    // Validate emails
    if (!inputDto.emails || inputDto.emails.length === 0) {
      throw new UserInvitationError('No emails provided');
    }

    // Filter out invalid emails
    const validEmails = inputDto.emails.filter(email => this.isValidEmail(email));

    if (validEmails.length === 0) {
      throw new UserInvitationError('No valid emails provided');
    }

    try {
      const invitedCount = await this.userManagementRepository.inviteUsers(validEmails);

      return {
        invitedCount,
      };
    } catch (error) {
      throw new UserInvitationError(
        error instanceof Error ? error.message : 'Failed to invite users'
      );
    }
  }

  private isValidEmail(email: string): boolean {
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
```

**`DeleteUserUseCase.ts`** - Define use case for deleting a user

```typescript
// src/features/userManagement/application/useCases/DeleteUserUseCase.ts
import { IUserManagementRepository } from '../../domain/interfaces/IUserManagementRepository';
import { DeleteUserInputDto, DeleteUserResultDto } from '../dtos/UserManagementDtos';
import { UserDeletionError } from '../../domain/errors/UserManagementError';

export class DeleteUserUseCase {
  constructor(private userManagementRepository: IUserManagementRepository) {}

  async execute(inputDto: DeleteUserInputDto): Promise<DeleteUserResultDto> {
    try {
      const success = await this.userManagementRepository.deleteUser(inputDto.userId);

      return {
        success,
        userId: inputDto.userId,
      };
    } catch (error) {
      throw new UserDeletionError(error instanceof Error ? error.message : 'Failed to delete user');
    }
  }
}
```
