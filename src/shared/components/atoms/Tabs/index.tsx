import { ComponentProps, forwardRef } from 'react';

import {
  Tabs as ShadcnTabs,
  TabsContent as ShadcnTabsContent,
  TabsList as ShadcnTabsList,
  TabsTrigger as ShadcnTabsTrigger,
} from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

// Export component types
export type TabsProps = ComponentProps<typeof ShadcnTabs>;
export type TabsContentProps = ComponentProps<typeof ShadcnTabsContent>;
export type TabsListProps = ComponentProps<typeof ShadcnTabsList>;
export type TabsTriggerProps = ComponentProps<typeof ShadcnTabsTrigger>;

// Simple re-export for component without modifications
export const Tabs = ShadcnTabs;

// Components with forwardRef for proper ref handling and testability
export const TabsList = forwardRef<React.ElementRef<typeof ShadcnTabsList>, TabsListProps>(
  ({ className, ...props }, ref) => {
    return (
      <ShadcnTabsList ref={ref} className={cn(className)} data-testid="tabs-list" {...props} />
    );
  }
);
TabsList.displayName = 'TabsList';

export const TabsTrigger = forwardRef<React.ElementRef<typeof ShadcnTabsTrigger>, TabsTriggerProps>(
  ({ className, ...props }, ref) => {
    return (
      <ShadcnTabsTrigger
        ref={ref}
        className={cn(className)}
        data-testid="tabs-trigger"
        {...props}
      />
    );
  }
);
TabsTrigger.displayName = 'TabsTrigger';

export const TabsContent = forwardRef<React.ElementRef<typeof ShadcnTabsContent>, TabsContentProps>(
  ({ className, ...props }, ref) => {
    return (
      <ShadcnTabsContent
        ref={ref}
        className={cn(className)}
        data-testid="tabs-content"
        {...props}
      />
    );
  }
);
TabsContent.displayName = 'TabsContent';
