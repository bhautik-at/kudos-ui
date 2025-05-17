import React, { useState, useRef, useEffect } from 'react';
import { Search, LogOut, Menu, Check, ChevronDown } from 'lucide-react';
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
  const userMenuRef = useRef<HTMLDivElement>(null);
  const orgDropdownRef = useRef<HTMLDivElement>(null);

  // Get current organization ID from URL query param
  const orgId = router.query.orgId as string;

  // Fetch organizations list
  const { organizations, isLoading } = useOrganizations();

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

  // Filter organizations based on search
  const filteredOrganizations = organizations.filter(org =>
    org.name.toLowerCase().includes(orgSearchValue.toLowerCase())
  );

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
      toastService.info('Logging out...', 'Please wait');

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
      toastService.error(
        'Logout failed',
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );

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
        'flex items-center justify-between px-4 py-2 bg-background border-b border-border',
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
            className="mr-2 p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent md:hidden"
            aria-label="Toggle sidebar"
          >
            <Menu size={24} />
          </Button>
        )}

        {/* Organization Selector - Replace the search */}
        <div className="relative" ref={orgDropdownRef}>
          <Button
            variant="ghost"
            className="flex items-center py-1 px-2 border border-transparent hover:border-gray-200 rounded-md"
            onClick={() => setShowOrgDropdown(!showOrgDropdown)}
            disabled={isLoading}
          >
            <span className="mr-2 font-medium truncate max-w-[200px]">
              {isLoading ? 'Loading...' : currentOrganization?.name || 'Select Organization'}
            </span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </Button>

          {/* Organization dropdown */}
          {showOrgDropdown && (
            <div className="absolute left-0 top-full mt-1 w-64 rounded-md shadow-lg bg-white border border-gray-200 z-50">
              {/* Search box */}
              <div className="p-2 border-b border-gray-200">
                <div className="relative">
                  <Input
                    type="text"
                    value={orgSearchValue}
                    onChange={e => setOrgSearchValue(e.target.value)}
                    className="w-full py-1 pl-8 pr-2 text-sm"
                    placeholder="Search organizations..."
                    toggleButton={
                      <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                        <Search className="w-4 h-4 text-muted-foreground" />
                      </div>
                    }
                  />
                </div>
              </div>

              {/* Organizations list */}
              <div className="max-h-60 overflow-y-auto">
                {isLoading ? (
                  <div className="py-2 px-3 text-sm text-gray-500">Loading organizations...</div>
                ) : filteredOrganizations.length === 0 ? (
                  <div className="py-2 px-3 text-sm text-gray-500">No organizations found</div>
                ) : (
                  <div className="py-1">
                    {filteredOrganizations.map(org => (
                      <button
                        key={org.id}
                        className={cn(
                          'flex items-center w-full px-3 py-2 text-sm text-left hover:bg-gray-100',
                          org.id === orgId && 'bg-gray-50'
                        )}
                        onClick={() => selectOrganization(org)}
                      >
                        <span className="flex-1 truncate">{org.name}</span>
                        {org.id === orgId && <Check className="h-4 w-4 text-primary ml-2" />}
                      </button>
                    ))}
                  </div>
                )}
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
          <div className="h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium">
            {userInitial}
          </div>
        </Button>

        {/* Simple User Menu Dropdown */}
        {showUserMenu && (
          <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white border border-gray-200 z-50">
            <div className="p-4 space-y-1">
              <div className="text-sm font-medium">Hi {user?.firstName || 'User'}!</div>
              <div className="text-xs text-gray-500 truncate">{user?.email}</div>
            </div>
            <div className="border-t border-gray-200">
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="flex w-full items-center justify-start px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
                disabled={isLoggingOut}
              >
                <LogOut className="w-4 h-4 mr-2" />
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
