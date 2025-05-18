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
import {
  ArrowUpDown,
  Trash2,
  Lock,
  Users,
  ChevronDown,
  CheckCircle,
  Shield,
  UserCircle,
} from 'lucide-react';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    if (role !== UserRole.TechLeader) {
      toastService.error('Permission denied - You do not have permission to change user roles');
      return;
    }

    try {
      await updateUserRole(userId, newRole);
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

  // Render role badge
  const renderRoleBadge = (userRole: UserRole) => (
    <div
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
        userRole === UserRole.TechLeader
          ? 'bg-purple-50 text-purple-700 ring-1 ring-inset ring-purple-700/10'
          : 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-700/10'
      }`}
    >
      {userRole === UserRole.TechLeader ? (
        <>
          <Shield className="h-3 w-3 mr-1" /> Tech Leader
        </>
      ) : (
        <>
          <UserCircle className="h-3 w-3 mr-1" /> Member
        </>
      )}
    </div>
  );

  const renderSkeletonRows = () => {
    return [...Array(5)].map((_, index) => (
      <TableRow key={`skeleton-${index}`} className="animate-pulse">
        <TableCell>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        </TableCell>
        <TableCell>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        </TableCell>
        <TableCell>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </TableCell>
        <TableCell>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        </TableCell>
        <TableCell>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-850 overflow-hidden rounded-xl border shadow-sm">
        {/* Table wrapper with horizontal scrolling on mobile */}
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <Table className="min-w-full">
              <TableHeader className="bg-gray-50 dark:bg-gray-800/40">
                <TableRow>
                  <TableHead className="w-[180px] md:w-[250px]">
                    <Button
                      variant="ghost"
                      onClick={handleToggleSortDirection}
                      className="flex items-center space-x-1 font-medium"
                    >
                      <span>Name</span>
                      <ArrowUpDown className="h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="w-[200px] font-medium">Email</TableHead>
                  <TableHead className="w-[100px] font-medium">Team</TableHead>
                  <TableHead className="w-[180px] font-medium">Role</TableHead>
                  <TableHead className="w-[80px] font-medium text-right pr-4">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  renderSkeletonRows()
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <Users className="h-12 w-12 mb-2 opacity-30" />
                        <p className="text-lg">No users found</p>
                        <p className="text-sm">Invite team members to get started</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map(user => (
                    <TableRow
                      key={user.id}
                      className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                      <TableCell className="font-medium whitespace-nowrap">
                        {user.fullName}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">{user.email}</TableCell>
                      <TableCell className="whitespace-nowrap">
                        {user.teamName ? (
                          <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                            {user.teamName}
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                            No team
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {role === UserRole.TechLeader ? (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-[160px] justify-between items-center rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                              >
                                <span className="flex items-center">
                                  {user.role === UserRole.TechLeader ? (
                                    <>
                                      <Shield className="h-4 w-4 mr-2 text-purple-600" />
                                      <span>Tech Leader</span>
                                    </>
                                  ) : (
                                    <>
                                      <UserCircle className="h-4 w-4 mr-2 text-green-600" />
                                      <span>Member</span>
                                    </>
                                  )}
                                </span>
                                <ChevronDown className="h-4 w-4 opacity-50" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-[160px]">
                              <DropdownMenuItem
                                onClick={() => handleRoleChange(user.id, UserRole.TechLeader)}
                                className="flex items-center"
                              >
                                <Shield className="h-4 w-4 mr-2 text-purple-600" />
                                <span>Tech Leader</span>
                                {user.role === UserRole.TechLeader && (
                                  <CheckCircle className="h-4 w-4 ml-auto text-green-500" />
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleRoleChange(user.id, UserRole.Member)}
                                className="flex items-center"
                              >
                                <UserCircle className="h-4 w-4 mr-2 text-green-600" />
                                <span>Member</span>
                                {user.role === UserRole.Member && (
                                  <CheckCircle className="h-4 w-4 ml-auto text-green-500" />
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        ) : (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex items-center">
                                  {renderRoleBadge(user.role)}
                                  <Lock className="h-3.5 w-3.5 ml-2 text-muted-foreground" />
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Only Tech Leaders can change roles</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {role === UserRole.TechLeader ? (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 rounded-full text-red-500 hover:bg-red-50 hover:text-red-600"
                                  onClick={() => setUserToDelete(user.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Delete User</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ) : (
                          <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            {[...Array(totalPages)].map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  onClick={() => handlePageChange(index + 1)}
                  isActive={currentPage === index + 1}
                  className={
                    currentPage === index + 1
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : ''
                  }
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
          </PaginationContent>
        </Pagination>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={userToDelete !== null} onOpenChange={closeDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Confirm Deletion</DialogTitle>
            <DialogDescription className="text-muted-foreground pt-2">
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 flex space-x-2 justify-end">
            <Button variant="outline" onClick={closeDialog}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800"
              onClick={handleDeleteUser}
            >
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
