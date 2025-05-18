### 3. Infrastructure Layer

#### API Client

**`UserManagementApiClient.ts`** - Define API client for user management

```typescript
// src/features/userManagement/infrastructure/api/UserManagementApiClient.ts
import { httpService } from '@/shared/services';
import { ApiError } from '@/shared/errors/ApiError';
import { UserRole } from '../../domain/entities/UserRole';

interface UserApiResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  teamName: string;
  role: UserRole;
  isVerified: boolean;
}

interface PaginatedApiResponse<T> {
  items: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export class UserManagementApiClient {
  /**
   * Get paginated list of users
   */
  async getUsers(
    page: number,
    pageSize: number,
    sortField: string,
    sortDirection?: 'asc' | 'desc'
  ): Promise<PaginatedApiResponse<UserApiResponse>> {
    try {
      // Build query params
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('pageSize', pageSize.toString());

      if (sortField) {
        params.append('sortField', sortField);
      }

      if (sortDirection) {
        params.append('sortDirection', sortDirection);
      }

      const response = await httpService.get<ApiResponse<PaginatedApiResponse<UserApiResponse>>>(
        `/api/users?${params.toString()}`
      );

      if (!response.data.success || !response.data.data) {
        throw new ApiError(response.data.message || 'Failed to fetch users', response.status);
      }

      return response.data.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      throw new ApiError(
        error instanceof Error ? error.message : 'Unknown error fetching users',
        500
      );
    }
  }

  /**
   * Update a user's role
   */
  async updateUserRole(userId: string, role: UserRole): Promise<UserApiResponse> {
    try {
      const response = await httpService.patch<ApiResponse<UserApiResponse>>(
        `/api/users/${userId}/role`,
        { role }
      );

      if (!response.data.success || !response.data.data) {
        throw new ApiError(response.data.message || 'Failed to update user role', response.status);
      }

      return response.data.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      throw new ApiError(
        error instanceof Error ? error.message : 'Unknown error updating user role',
        500
      );
    }
  }

  /**
   * Invite multiple users with only emails
   */
  async inviteUsers(emails: string[]): Promise<{ invitedCount: number }> {
    try {
      const response = await httpService.post<ApiResponse<{ invitedCount: number }>>(
        '/api/users/invite',
        {
          emails,
        }
      );

      if (!response.data.success || !response.data.data) {
        throw new ApiError(response.data.message || 'Failed to invite users', response.status);
      }

      return response.data.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      throw new ApiError(
        error instanceof Error ? error.message : 'Unknown error inviting users',
        500
      );
    }
  }

  /**
   * Delete a user
   */
  async deleteUser(userId: string): Promise<boolean> {
    try {
      const response = await httpService.delete<ApiResponse<{ success: boolean }>>(
        `/api/users/${userId}`
      );

      if (!response.data.success) {
        throw new ApiError(response.data.message || 'Failed to delete user', response.status);
      }

      return true;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      throw new ApiError(
        error instanceof Error ? error.message : 'Unknown error deleting user',
        500
      );
    }
  }
}
```

#### Repository

**`UserManagementRepository.ts`** - Define repository implementation

```typescript
// src/features/userManagement/infrastructure/repositories/UserManagementRepository.ts
import {
  IUserManagementRepository,
  PaginationParams,
  PaginatedResult,
} from '../../domain/interfaces/IUserManagementRepository';
import { UserManagementUser } from '../../domain/entities/UserManagementUser';
import { UserRole } from '../../domain/entities/UserRole';
import { UserManagementApiClient } from '../api/UserManagementApiClient';

export class UserManagementRepository implements IUserManagementRepository {
  private apiClient: UserManagementApiClient;

  constructor(apiClient?: UserManagementApiClient) {
    this.apiClient = apiClient || new UserManagementApiClient();
  }

  async getUsers(params: PaginationParams): Promise<PaginatedResult<UserManagementUser>> {
    const result = await this.apiClient.getUsers(
      params.page,
      params.pageSize,
      'firstName', // Always sort by firstName
      params.sortDirection
    );

    // Map API response to domain entities
    const users = result.items.map(
      item =>
        new UserManagementUser({
          id: item.id,
          email: item.email,
          firstName: item.firstName,
          lastName: item.lastName,
          teamName: item.teamName,
          role: item.role,
          isVerified: item.isVerified,
        })
    );

    return {
      items: users,
      totalItems: result.totalItems,
      totalPages: result.totalPages,
      currentPage: result.currentPage,
    };
  }

  async updateUserRole(userId: string, role: UserRole): Promise<UserManagementUser> {
    const updatedUser = await this.apiClient.updateUserRole(userId, role);

    return new UserManagementUser({
      id: updatedUser.id,
      email: updatedUser.email,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      teamName: updatedUser.teamName,
      role: updatedUser.role,
      isVerified: updatedUser.isVerified,
    });
  }

  async inviteUsers(emails: string[]): Promise<number> {
    const result = await this.apiClient.inviteUsers(emails);
    return result.invitedCount;
  }

  async deleteUser(userId: string): Promise<boolean> {
    return await this.apiClient.deleteUser(userId);
  }
}
```

### 4. Presentation Layer

#### Context

**`UserManagementContext.tsx`** - Define context for user management state

```typescript
// src/features/userManagement/presentation/contexts/UserManagementContext.tsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  UserManagementUserDto,
  PaginatedUsersDto,
  GetUsersInputDto,
  UpdateUserRoleInputDto,
  InviteUsersInputDto
} from '../../application/dtos/UserManagementDtos';
import { GetUsersUseCase } from '../../application/useCases/GetUsersUseCase';
import { UpdateUserRoleUseCase } from '../../application/useCases/UpdateUserRoleUseCase';
import { InviteUsersUseCase } from '../../application/useCases/InviteUsersUseCase';
import { UserManagementRepository } from '../../infrastructure/repositories/UserManagementRepository';
import { UserRole } from '../../domain/entities/UserRole';

interface UserManagementContextType {
  // State
  users: UserManagementUserDto[];
  totalUsers: number;
  totalPages: number;
  currentPage: number;
  isLoading: boolean;
  sortDirection: 'asc' | 'desc';
  pageSize: number;
  error: Error | null;

  // Actions
  fetchUsers: (params?: Partial<GetUsersInputDto>) => Promise<void>;
  updateUserRole: (userId: string, role: UserRole) => Promise<void>;
  inviteUsers: (emails: string[]) => Promise<void>;

  // UI state
  isInviteModalOpen: boolean;
  openInviteModal: () => void;
  closeInviteModal: () => void;
}

const UserManagementContext = createContext<UserManagementContextType | undefined>(undefined);

export const UserManagementProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Create repository and use cases
  const repository = new UserManagementRepository();
  const getUsersUseCase = new GetUsersUseCase(repository);
  const updateUserRoleUseCase = new UpdateUserRoleUseCase(repository);
  const inviteUsersUseCase = new InviteUsersUseCase(repository);

  // State
  const [users, setUsers] = useState<UserManagementUserDto[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // Fetch users with pagination and sorting
  const fetchUsers = useCallback(async (params?: Partial<GetUsersInputDto>) => {
    setIsLoading(true);
    setError(null);

    try {
      // Apply new params or use existing state
      const page = params?.page ?? currentPage;
      const size = params?.pageSize ?? pageSize;
      const direction = params?.sortDirection ?? sortDirection;

      // Update state with new params if provided
      if (params?.page) setCurrentPage(params.page);
      if (params?.pageSize) setPageSize(params.pageSize);
      if (params?.sortDirection) setSortDirection(params.sortDirection);

      // Execute use case
      const result = await getUsersUseCase.execute({
        page,
        pageSize: size,
        sortDirection: direction
      });

      // Update state with results
      setUsers(result.users);
      setTotalUsers(result.totalUsers);
      setTotalPages(result.totalPages);
      setCurrentPage(result.currentPage);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch users'));
      console.error('Error fetching users:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, sortDirection, getUsersUseCase]);

  // Update a user's role
  const updateUserRole = useCallback(async (userId: string, role: UserRole) => {
    setIsLoading(true);
    setError(null);

    try {
      await updateUserRoleUseCase.execute({ userId, role });

      // Refresh the user list to get updated data
      await fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update user role'));
      console.error('Error updating user role:', err);
      throw err; // Re-throw to allow handling in UI components
    } finally {
      setIsLoading(false);
    }
  }, [updateUserRoleUseCase, fetchUsers]);

  // Invite users with just emails
  const inviteUsers = useCallback(async (emails: string[]) => {
    setIsLoading(true);
    setError(null);

    try {
      await inviteUsersUseCase.execute({ emails });

      // Close modal and refresh user list
      setIsInviteModalOpen(false);
      await fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to invite users'));
      console.error('Error inviting users:', err);
      throw err; // Re-throw to allow handling in UI components
    } finally {
      setIsLoading(false);
    }
  }, [inviteUsersUseCase, fetchUsers]);

  // Modal controls
  const openInviteModal = useCallback(() => {
    setIsInviteModalOpen(true);
  }, []);

  const closeInviteModal = useCallback(() => {
    setIsInviteModalOpen(false);
  }, []);

  // Context value
  const value: UserManagementContextType = {
    users,
    totalUsers,
    totalPages,
    currentPage,
    isLoading,
    sortDirection,
    pageSize,
    error,
    fetchUsers,
    updateUserRole,
    inviteUsers,
    isInviteModalOpen,
    openInviteModal,
    closeInviteModal
  };

  return (
    <UserManagementContext.Provider value={value}>
      {children}
    </UserManagementContext.Provider>
  );
};

export const useUserManagement = () => {
  const context = useContext(UserManagementContext);

  if (context === undefined) {
    throw new Error('useUserManagement must be used within a UserManagementProvider');
  }

  return context;
};
```

#### Components

**`UserTable.tsx`** - Define the user table component

```typescript
// src/features/userManagement/presentation/components/UserTable.tsx
import React, { useEffect } from 'react';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from '@/shared/components/atoms/Table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/atoms/Select';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/shared/components/atoms/Button';
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from '@/shared/components/atoms/Pagination';
import { useUserManagement } from '../contexts/UserManagementContext';
import { toastService } from '@/shared/services/toast';
import { UserRole } from '../../../domain/entities/UserRole';

export const UserTable: React.FC = () => {
  const {
    users,
    totalPages,
    currentPage,
    isLoading,
    sortDirection,
    fetchUsers,
    updateUserRole
  } = useUserManagement();

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Toggle sort direction for firstName
  const handleToggleSortDirection = () => {
    const newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    fetchUsers({ sortDirection: newDirection });
  };

  // Handle role change
  const handleRoleChange = async (userId: string, role: UserRole) => {
    try {
      await updateUserRole(userId, role);
      toastService.success('User role updated successfully');
    } catch (error) {
      toastService.error(
        'Failed to update user role',
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
    }
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    fetchUsers({ page });
  };

  return (
    <div className="space-y-4">
      <Table className="border rounded-md">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">
              <Button
                variant="ghost"
                onClick={handleToggleSortDirection}
                className="flex items-center space-x-1"
              >
                <span>Name</span>
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-8">
                Loading users...
              </TableCell>
            </TableRow>
          )}
          {!isLoading && users.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-8">
                No users found
              </TableCell>
            </TableRow>
          )}
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.fullName}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Select
                  value={user.role}
                  onValueChange={(value) => handleRoleChange(user.id, value as UserRole)}
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={UserRole.TEAM_MEMBER}>Team Member</SelectItem>
                    <SelectItem value={UserRole.TEAM_LEAD}>Team Lead</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <Pagination>
            <PaginationContent>
              {[...Array(totalPages)].map((_, index) => {
                const page = index + 1;
                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => handlePageChange(page)}
                      isActive={currentPage === page}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};
```
