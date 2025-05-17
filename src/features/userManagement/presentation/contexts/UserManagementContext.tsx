import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  UserManagementUserDto,
  PaginatedUsersDto,
  GetUsersInputDto,
  UpdateUserRoleInputDto,
  InviteUsersInputDto,
  DeleteUserInputDto,
} from '../../application/dtos/UserManagementDtos';
import { GetUsersUseCase } from '../../application/useCases/GetUsersUseCase';
import { UpdateUserRoleUseCase } from '../../application/useCases/UpdateUserRoleUseCase';
import { InviteUsersUseCase } from '../../application/useCases/InviteUsersUseCase';
import { DeleteUserUseCase } from '../../application/useCases/DeleteUserUseCase';
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
  deleteUser: (userId: string) => Promise<void>;

  // UI state
  isInviteModalOpen: boolean;
  openInviteModal: () => void;
  closeInviteModal: () => void;
}

const UserManagementContext = createContext<UserManagementContextType | undefined>(undefined);

export const UserManagementProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const { orgId } = router.query;
  const organizationId = Array.isArray(orgId) ? orgId[0] : orgId;

  // Create repository and use cases only once using refs
  const repositoryRef = useRef<UserManagementRepository>(new UserManagementRepository());
  const getUsersUseCaseRef = useRef<GetUsersUseCase>(new GetUsersUseCase(repositoryRef.current));
  const updateUserRoleUseCaseRef = useRef<UpdateUserRoleUseCase>(
    new UpdateUserRoleUseCase(repositoryRef.current)
  );
  const inviteUsersUseCaseRef = useRef<InviteUsersUseCase>(
    new InviteUsersUseCase(repositoryRef.current)
  );
  const deleteUserUseCaseRef = useRef<DeleteUserUseCase>(
    new DeleteUserUseCase(repositoryRef.current)
  );

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
  const fetchUsers = useCallback(
    async (params?: Partial<GetUsersInputDto>) => {
      // Ensure we have an organizationId
      if (!organizationId) {
        setError(new Error('Organization ID is required to fetch users'));
        console.error('Missing organization ID');
        return;
      }

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
        const result = await getUsersUseCaseRef.current.execute({
          page,
          pageSize: size,
          sortDirection: direction,
          organizationId: params?.organizationId ?? organizationId,
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
    },
    [currentPage, pageSize, sortDirection, organizationId]
  );

  // Update a user's role
  const updateUserRole = useCallback(
    async (userId: string, role: UserRole) => {
      setIsLoading(true);
      setError(null);

      try {
        await updateUserRoleUseCaseRef.current.execute({ userId, role });

        // Refresh the user list to get updated data
        fetchUsers();
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to update user role'));
        console.error('Error updating user role:', err);
        throw err; // Re-throw to allow handling in UI components
      } finally {
        setIsLoading(false);
      }
    },
    [fetchUsers]
  );

  // Invite users with emails and organization ID
  const inviteUsers = useCallback(
    async (emails: string[]) => {
      setIsLoading(true);
      setError(null);

      try {
        await inviteUsersUseCaseRef.current.execute({
          emails,
          organizationId,
        });

        // Close modal and refresh user list
        setIsInviteModalOpen(false);
        fetchUsers();
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to invite users'));
        console.error('Error inviting users:', err);
        throw err; // Re-throw to allow handling in UI components
      } finally {
        setIsLoading(false);
      }
    },
    [fetchUsers, organizationId]
  );

  // Delete a user
  const deleteUser = useCallback(
    async (userId: string) => {
      setIsLoading(true);
      setError(null);

      try {
        await deleteUserUseCaseRef.current.execute({ userId });

        // Refresh the user list after deletion
        fetchUsers();
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to delete user'));
        console.error('Error deleting user:', err);
        throw err; // Re-throw to allow handling in UI components
      } finally {
        setIsLoading(false);
      }
    },
    [fetchUsers]
  );

  // Modal controls
  const openInviteModal = useCallback(() => {
    setIsInviteModalOpen(true);
  }, []);

  const closeInviteModal = useCallback(() => {
    setIsInviteModalOpen(false);
  }, []);

  // Context value with memoization to prevent unnecessary re-renders
  const value = React.useMemo(
    () => ({
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
      deleteUser,
      isInviteModalOpen,
      openInviteModal,
      closeInviteModal,
    }),
    [
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
      deleteUser,
      isInviteModalOpen,
      openInviteModal,
      closeInviteModal,
    ]
  );

  return <UserManagementContext.Provider value={value}>{children}</UserManagementContext.Provider>;
};

export const useUserManagement = () => {
  const context = useContext(UserManagementContext);

  if (context === undefined) {
    throw new Error('useUserManagement must be used within a UserManagementProvider');
  }

  return context;
};
