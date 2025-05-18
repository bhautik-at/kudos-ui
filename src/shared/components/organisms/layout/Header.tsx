import React, { useState, useRef, useEffect } from 'react';
import { Search, LogOut, Menu, Check, ChevronDown, Plus } from 'lucide-react';
import { useAuth } from '@/features/auth/presentation/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Button } from '@/shared/components/atoms/Button';
import { Input } from '@/shared/components/atoms/Input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/components/atoms/Tooltip';
import { useUser } from '@/features/users/presentation/contexts/UserContext';
import { toastService } from '@/shared/services/toast';
import { useRouter } from 'next/router';
import { httpService } from '@/shared/services/http/HttpService';
import { useOrganizations } from '@/features/organizations/presentation/hooks/useOrganizations';
import { useCreateOrganization } from '@/features/organizations/presentation/hooks/useCreateOrganization';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/atoms/Dialog';
import { OrganizationForm } from '@/features/organizations/presentation/components/OrganizationForm';

interface HeaderProps {
  className?: string;
  onMenuClick?: () => void;
  showMenuButton?: boolean;
  isMobile?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  className,
  onMenuClick,
  showMenuButton = false,
  isMobile = false,
}) => {
  const { logout } = useAuth();
  const { user, setUserFromAuth } = useUser();
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showOrgDropdown, setShowOrgDropdown] = useState(false);
  const [orgSearchValue, setOrgSearchValue] = useState('');
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showNewOrgModal, setShowNewOrgModal] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const orgDropdownRef = useRef<HTMLDivElement>(null);

  // Get current organization ID from URL query param
  const orgId = router.query.orgId as string;

  // Fetch organizations list
  const { organizations, isLoading, refreshOrganizations } = useOrganizations();

  // Use organization creation hook
  const {
    createOrganization,
    isLoading: isCreatingOrg,
    error: createOrgError,
  } = useCreateOrganization();

  // Find current organization in the list
  const currentOrganization = orgId ? organizations.find(org => org.id === orgId) : null;

  // Get user initial for avatar
  const userInitial = user?.firstName?.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || 'U';

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }

      if (orgDropdownRef.current && !orgDropdownRef.current.contains(event.target as Node)) {
        setShowOrgDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filter organizations based on search and removing duplicates by ID
  const filteredOrganizations = organizations
    .filter(org => org.name.toLowerCase().includes(orgSearchValue.toLowerCase()))
    // Use a Set to track seen IDs and filter out duplicates
    .filter((org, index, self) => {
      const firstIndex = self.findIndex(o => o.id === org.id);
      return firstIndex === index; // Keep only the first occurrence of each ID
    });

  // Handle organization selection
  const selectOrganization = (org: { id: string; name: string }) => {
    const currentPath = router.pathname;

    // Replace the orgId query parameter
    router.push({
      pathname: currentPath,
      query: { ...router.query, orgId: org.id },
    });

    // Close the dropdown
    setShowOrgDropdown(false);
    setOrgSearchValue('');
  };

  // Handle new organization form submission
  const handleCreateOrganization = async (data: { name: string; description?: string }) => {
    const result = await createOrganization(data.name, data.description);

    if (result) {
      // Refresh organizations to include the new one
      await refreshOrganizations();

      // Close the modal
      setShowNewOrgModal(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      setShowUserMenu(false);

      // Clear user data immediately to prevent auto-fetching
      setUserFromAuth(null);

      // Clear userId from localStorage immediately
      if (typeof window !== 'undefined') {
        localStorage.removeItem('kudos_user_id');
      }

      // Clear authentication token to prevent further API calls
      httpService.clearAuthToken();

      // Show logout in progress toast
      toastService.info('Logging out - Please wait');

      // Call the Auth service logout
      await logout();

      // Show success message
      toastService.success('Logged out successfully');

      // Use window.location.href for a full page reload to clear any state
      window.location.href = '/';

      // Prevention: Don't continue executing after redirect
      return;
    } catch (error) {
      console.error('Logout failed:', error);

      // Show error toast
      toastService.error('Logout failed', {
        duration: 3000,
      });

      // Still clear user data and localStorage even if API fails
      if (typeof window !== 'undefined') {
        localStorage.removeItem('kudos_user_id');
      }

      // Force redirect to login page anyway
      window.location.href = '/';
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header
      className={cn(
        'flex items-center justify-between px-6 py-3 bg-white border-b border-slate-200 shadow-sm',
        className
      )}
    >
      {/* Left Section - Mobile menu button and Organization selector */}
      <div className={cn('flex items-center', isMobile ? 'w-auto' : 'flex-1 max-w-xl')}>
        {/* Mobile menu button - only shown on mobile */}
        {showMenuButton && isMobile && (
          <Button
            onClick={onMenuClick}
            variant="ghost"
            size="icon"
            className="mr-3 p-2 rounded-md text-slate-500 hover:text-slate-700 hover:bg-slate-100 md:hidden"
            aria-label="Toggle sidebar"
          >
            <Menu size={24} />
          </Button>
        )}

        {/* Organization Selector */}
        <div className="relative" ref={orgDropdownRef}>
          <Button
            variant="outline"
            className="flex items-center py-1.5 px-3 text-slate-700 rounded-md border border-slate-200 hover:bg-slate-50 transition-colors"
            onClick={() => setShowOrgDropdown(!showOrgDropdown)}
            disabled={isLoading}
          >
            <span className="mr-2 font-medium truncate max-w-[200px]">
              {isLoading ? 'Loading...' : currentOrganization?.name || 'Select Organization'}
            </span>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </Button>

          {/* Organization dropdown */}
          {showOrgDropdown && (
            <div className="absolute left-0 top-full mt-1 w-64 rounded-md shadow-lg bg-white border border-slate-200 z-50">
              {/* Search box */}
              <div className="p-2 border-b border-slate-200">
                <div className="relative">
                  <Input
                    type="text"
                    value={orgSearchValue}
                    onChange={e => setOrgSearchValue(e.target.value)}
                    className="w-full py-1 pl-8 pr-2 text-sm bg-slate-50 border-slate-200 focus:border-blue-300"
                    placeholder="Search organizations..."
                    toggleButton={
                      <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                        <Search className="w-4 h-4 text-slate-400" />
                      </div>
                    }
                  />
                </div>
              </div>

              {/* Organizations list */}
              <div className="max-h-60 overflow-y-auto">
                {isLoading ? (
                  <div className="py-2 px-3 text-sm text-slate-500">Loading organizations...</div>
                ) : filteredOrganizations.length === 0 ? (
                  <div className="py-2 px-3 text-sm text-slate-500">No organizations found</div>
                ) : (
                  <div className="py-1">
                    {filteredOrganizations.map(org => (
                      <button
                        key={org.id}
                        className={cn(
                          'flex items-center w-full px-3 py-2 text-sm text-left hover:bg-slate-50 transition-colors',
                          org.id === orgId && 'bg-blue-50 text-blue-600'
                        )}
                        onClick={() => selectOrganization(org)}
                      >
                        <span className="flex-1 truncate">{org.name}</span>
                        {org.id === orgId && <Check className="h-4 w-4 text-blue-500 ml-2" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Create New Organization option */}
              <div className="border-t border-slate-200 p-2">
                <button
                  className="flex items-center w-full px-3 py-2 text-sm text-left rounded-md hover:bg-blue-50 text-blue-600 font-medium transition-colors"
                  onClick={() => {
                    setShowOrgDropdown(false);
                    setShowNewOrgModal(true);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  <span>New Organization</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Section - User Profile */}
      <div className="relative" ref={userMenuRef}>
        <Button
          className="flex items-center space-x-2 focus:outline-none"
          variant="ghost"
          onClick={() => setShowUserMenu(!showUserMenu)}
        >
          <div className="h-9 w-9 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-white flex items-center justify-center font-medium shadow-sm">
            {userInitial}
          </div>
        </Button>

        {/* User Menu Dropdown */}
        {showUserMenu && (
          <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white border border-slate-200 z-50 overflow-hidden">
            <div className="p-4 space-y-1 bg-gradient-to-r from-blue-600 to-blue-500 text-white">
              <div className="text-sm font-medium">Hi {user?.firstName || 'User'}!</div>
              <div className="text-xs text-white/80 truncate">{user?.email}</div>
            </div>
            <div className="border-t border-slate-200">
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="flex w-full items-center justify-start px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                disabled={isLoggingOut}
              >
                <LogOut className="w-4 h-4 mr-2 text-slate-400" />
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* New Organization Modal */}
      <Dialog open={showNewOrgModal} onOpenChange={setShowNewOrgModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Create New Organization</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <OrganizationForm
              onSubmit={handleCreateOrganization}
              isLoading={isCreatingOrg}
              error={createOrgError}
            />
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
};
