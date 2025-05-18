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
  Tag,
  UserPlus,
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
    { icon: Tag, label: 'Kudo Categories', href: '/kudo-categories' },
    { icon: Users, label: 'Teams', href: '/teams' },
    { icon: BarChart, label: 'Analytics', href: '/analytics' },
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
        'bg-white flex flex-col h-full shadow-sm',
        effectiveCollapsed ? 'w-[72px]' : 'w-64',
        'transition-all duration-300 ease-in-out',
        isMobile ? 'max-h-screen' : 'h-screen border-r border-slate-200',
        className
      )}
    >
      {/* Logo with Gradient Background */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white py-5 px-4">
        <div className="flex items-center justify-between">
          <Link
            href={buildHref('/dashboard')}
            className="flex-shrink-0 flex items-center cursor-pointer"
          >
            {/* App Logo */}
            <div className="h-9 w-9 rounded-md bg-white/20 backdrop-blur-sm text-white flex items-center justify-center font-bold text-lg shadow-sm">
              K
            </div>

            {/* App Name - Only show when not collapsed */}
            {!effectiveCollapsed && (
              <span className="ml-3 font-semibold text-xl tracking-tight">Kudos</span>
            )}
          </Link>

          {/* Only show close button on mobile */}
          {isMobile ? (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10"
              aria-label="Close sidebar"
              onClick={toggleSidebar}
            >
              <ChevronLeft size={16} />
            </Button>
          ) : (
            <Button
              onClick={toggleSidebar}
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10"
              aria-label={effectiveCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {effectiveCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </Button>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <ScrollArea className="flex-1 py-2">
        <nav className="py-2 px-2 space-y-1">
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
                        'flex items-center rounded-md transition-all duration-200 my-1',
                        effectiveCollapsed ? 'justify-center h-10 w-10 mx-auto' : 'py-2.5 px-3',
                        isActive
                          ? 'bg-blue-50 text-blue-600 font-medium'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      )}
                    >
                      <item.icon
                        className={cn(
                          'flex-shrink-0',
                          effectiveCollapsed ? 'h-5 w-5' : 'h-5 w-5 mr-3',
                          isActive ? 'text-blue-600' : 'text-slate-500'
                        )}
                      />
                      {!effectiveCollapsed && <span className="text-sm">{item.label}</span>}
                    </Link>
                  </TooltipTrigger>
                  {effectiveCollapsed && !isMobile && (
                    <TooltipContent side="right" className="bg-white text-slate-800 shadow-md">
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
