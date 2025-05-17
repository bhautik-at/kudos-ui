import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Users,
  Home,
  Award,
  Settings,
  ChevronLeft,
  ChevronRight,
  BarChart,
  MessageCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/shared/components/atoms/Button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/components/atoms/Tooltip';
import { ScrollArea } from '@/shared/components/atoms/ScrollArea';

interface SidebarProps {
  className?: string;
  isMobile?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ className, isMobile = false, onClose }) => {
  const [collapsed, setCollapsed] = useState(true);
  const router = useRouter();

  // Extract query parameters to preserve them across routes
  const { query } = router;
  const queryParams = { ...query };
  // Remove pathname-specific parameters if needed
  delete queryParams.slug;

  const toggleSidebar = () => {
    if (isMobile && onClose) {
      // Call the onClose prop when in mobile mode
      onClose();
    } else {
      // Toggle collapse state in desktop mode
      setCollapsed(!collapsed);
    }
  };

  const sidebarItems = [
    { icon: Home, label: 'User Management', href: '/user-management' },
    { icon: Award, label: 'Kudos', href: '/dashboard/kudos' },
    { icon: MessageCircle, label: 'Messages', href: '/dashboard/messages' },
    { icon: Users, label: 'Team', href: '/dashboard/team' },
    { icon: BarChart, label: 'Analytics', href: '/dashboard/analytics' },
    { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
  ];

  // On mobile, we don't collapse - we just show the full sidebar
  const effectiveCollapsed = isMobile ? false : collapsed;

  // Helper function to build href with query parameters
  const buildHref = (baseHref: string) => {
    // If there are no query parameters, return the base URL
    if (Object.keys(queryParams).length === 0) {
      return baseHref;
    }

    // Build the query string
    const queryString = new URLSearchParams();
    Object.entries(queryParams).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(val => queryString.append(key, val));
      } else if (value !== undefined) {
        queryString.append(key, value as string);
      }
    });

    return `${baseHref}?${queryString.toString()}`;
  };

  return (
    <aside
      className={cn(
        'bg-white text-gray-800 flex flex-col h-full',
        effectiveCollapsed ? 'w-[72px]' : 'w-64',
        'transition-all duration-200 ease-in-out',
        isMobile ? 'max-h-screen' : 'h-screen border-r',
        className
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between py-5 px-4 border-b">
        <div className="flex-shrink-0 flex items-center">
          {/* App Logo */}
          <div className="h-8 w-8 rounded-md bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
            K
          </div>

          {/* App Name - Only show when not collapsed */}
          {!effectiveCollapsed && <span className="ml-3 font-semibold text-xl">Kudos</span>}
        </div>

        {/* Only show close button on mobile */}
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            aria-label="Close sidebar"
            onClick={toggleSidebar}
          >
            <ChevronLeft size={16} />
          </Button>
        )}
      </div>

      {/* Toggle Button - Now positioned at the right edge when expanded but only on desktop */}
      {!isMobile && (
        <div
          className={cn(
            'relative py-2',
            effectiveCollapsed ? 'flex justify-center' : 'flex justify-end pr-3'
          )}
        >
          <Button
            onClick={toggleSidebar}
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            aria-label={effectiveCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {effectiveCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </Button>
        </div>
      )}

      {/* Navigation Menu */}
      <ScrollArea className="flex-1">
        <nav className="py-4 px-2 space-y-1">
          {sidebarItems.map(item => {
            const hrefWithQuery = buildHref(item.href);
            const isActive =
              router.pathname === item.href || router.pathname.startsWith(`${item.href}/`);

            return (
              <TooltipProvider key={item.href} delayDuration={effectiveCollapsed ? 100 : 800}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={hrefWithQuery}
                      className={cn(
                        'flex items-center rounded-md transition-colors my-1',
                        effectiveCollapsed ? 'justify-center h-10 w-10 mx-auto' : 'py-2 px-3',
                        isActive
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      )}
                    >
                      <item.icon className={cn('h-5 w-5', effectiveCollapsed ? '' : 'mr-3')} />
                      {!effectiveCollapsed && (
                        <span className="text-sm font-medium">{item.label}</span>
                      )}
                    </Link>
                  </TooltipTrigger>
                  {effectiveCollapsed && !isMobile && (
                    <TooltipContent side="right" className="bg-white text-gray-800">
                      {item.label}
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </nav>
      </ScrollArea>
    </aside>
  );
};
