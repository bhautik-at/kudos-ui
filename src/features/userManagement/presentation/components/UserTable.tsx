import React, { useEffect, useState } from 'react';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/shared/components/atoms/Table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/atoms/Select';
import { ArrowUpDown, Trash2, Lock } from 'lucide-react';
import { Button } from '@/shared/components/atoms/Button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from '@/shared/components/atoms/Pagination';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/atoms/Dialog';
import { useUserManagement } from '../contexts/UserManagementContext';
import { toastService } from '@/shared/services/toast';
import { UserRole } from '../../domain/entities/UserRole';
import { useUserRole } from '@/shared/hooks/useUserRole';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/components/atoms/Tooltip';

export const UserTable: React.FC = () => {
  const {
    users,
    totalPages,
    currentPage,
    isLoading,
    sortDirection,
    fetchUsers,
    updateUserRole,
    deleteUser,
  } = useUserManagement();

  const { role } = useUserRole();

  // Local state for deletion confirmation
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  // Fetch users on component mount only
  useEffect(() => {
    // Only fetch on initial mount to prevent refetching loops
    const controller = new AbortController();
    fetchUsers().catch(error => {
      if (!controller.signal.aborted) {
        console.error('Error fetching users:', error);
      }
    });

    return () => {
      controller.abort();
    };
  }, []); // Empty dependency array ensures this only runs once on mount

  // Toggle sort direction for firstName
  const handleToggleSortDirection = () => {
    const newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    fetchUsers({ sortDirection: newDirection });
  };

  // Handle role change
  const handleRoleChange = async (userId: string) => {
    if (role !== UserRole.TechLeader) {
      toastService.error('Permission denied - You do not have permission to change user roles');
      return;
    }

    try {
      await updateUserRole(userId, role);
      toastService.success('User role updated successfully');
    } catch (error) {
      toastService.error(
        `Failed to update user role: ${error instanceof Error ? error.message : 'An unexpected error occurred'}`
      );
    }
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    fetchUsers({ page });
  };

  // Handle delete user
  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    if (role !== UserRole.TechLeader) {
      toastService.error('Permission denied - You do not have permission to delete users');
      setUserToDelete(null);
      return;
    }

    try {
      await deleteUser(userToDelete);
      toastService.success('User deleted successfully');
      setUserToDelete(null);
    } catch (error) {
      toastService.error(
        `Failed to delete user: ${error instanceof Error ? error.message : 'An unexpected error occurred'}`
      );
    }
  };

  // Close dialog
  const closeDialog = () => {
    setUserToDelete(null);
  };

  return (
    <div className="space-y-4">
      {/* Table wrapper with horizontal scrolling on mobile */}
      <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="inline-block min-w-full align-middle">
          <Table className="border rounded-md min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px] md:w-[250px]">
                  <Button
                    variant="ghost"
                    onClick={handleToggleSortDirection}
                    className="flex items-center space-x-1"
                  >
                    <span>Name</span>
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="w-[200px]">Email</TableHead>
                <TableHead className="w-[100px]">Team</TableHead>
                <TableHead className="w-[180px]">Role</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    Loading users...
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    No users found
                  </TableCell>
                </TableRow>
              )}
              {users.map(user => (
                <TableRow key={user.id}>
                  <TableCell className="whitespace-nowrap">{user.fullName}</TableCell>
                  <TableCell className="whitespace-nowrap">{user.email}</TableCell>
                  <TableCell className="whitespace-nowrap">{user.teamName || '-'}</TableCell>
                  <TableCell>
                    {role === UserRole.TechLeader ? (
                      <Select
                        value={user.role}
                        onValueChange={value => handleRoleChange(user.id)}
                        disabled={isLoading}
                      >
                        <SelectTrigger className="w-[140px] md:w-[180px]">
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={UserRole.Member}>Member</SelectItem>
                          <SelectItem value={UserRole.TechLeader}>Tech Leader</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <span className="mr-2">
                                {user.role === UserRole.Member ? 'Member' : 'Tech Leader'}
                              </span>
                              <Lock className="h-3.5 w-3.5" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>You don't have permission to change roles</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </TableCell>
                  <TableCell>
                    {role === UserRole.TechLeader ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setUserToDelete(user.id)}
                        disabled={isLoading}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete user</span>
                      </Button>
                    ) : (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="h-9 w-9 flex items-center justify-center text-muted-foreground">
                              <Lock className="h-4 w-4" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>You don't have permission to delete users</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

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

      {/* Delete confirmation dialog */}
      <Dialog open={!!userToDelete} onOpenChange={(isOpen: boolean) => !isOpen && closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteUser}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
