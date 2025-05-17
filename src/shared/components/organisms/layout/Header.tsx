import React, { useState, useRef, useEffect } from 'react';
import { Search, Plus, LogOut, Menu } from 'lucide-react';
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
  const [searchValue, setSearchValue] = useState('');
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Get user initial for avatar
  const userInitial = user?.firstName?.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || 'U';

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
      {/* Left Section - Mobile menu button and Search for desktop */}
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

        {/* Search Organization - shown at left on desktop, centered on mobile */}
        {!isMobile ? (
          <div className="flex items-center w-full ml-1">
            <div className="relative flex-1 max-w-md">
              <Input
                type="text"
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
                className="w-full py-2 pl-10 pr-4 text-sm"
                placeholder="Search organization..."
                data-testid="search-input"
                toggleButton={
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="w-5 h-5 text-muted-foreground" />
                  </div>
                }
              />
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button className="ml-2 p-2" size="icon" aria-label="Add organization">
                    <Plus className="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Add organization</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        ) : null}
      </div>

      {/* Center Section - Search only for mobile */}
      {isMobile && (
        <div className="flex items-center flex-1 mx-2">
          <div className="relative w-full">
            <Input
              type="text"
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              className="w-full py-2 pl-10 pr-4 text-sm"
              placeholder="Search..."
              data-testid="search-input"
              toggleButton={
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="w-5 h-5 text-muted-foreground" />
                </div>
              }
            />
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button className="ml-1 p-1" size="icon" aria-label="Add organization">
                  <Plus className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Add organization</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}

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
              <div className="text-xs text-gray-500">{user?.email}</div>
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
