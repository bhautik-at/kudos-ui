import { ComponentProps, forwardRef } from 'react';

import {
  Collapsible as ShadcnCollapsible,
  CollapsibleContent as ShadcnCollapsibleContent,
  CollapsibleTrigger as ShadcnCollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

// Export component types
export type CollapsibleProps = ComponentProps<typeof ShadcnCollapsible>;
export type CollapsibleTriggerProps = ComponentProps<typeof ShadcnCollapsibleTrigger>;
export type CollapsibleContentProps = ComponentProps<typeof ShadcnCollapsibleContent>;

// Simple re-export for component without modifications
export const Collapsible = ShadcnCollapsible;
export const CollapsibleTrigger = ShadcnCollapsibleTrigger;

// Component with forwardRef for proper ref handling and testability
export const CollapsibleContent = forwardRef<
  React.ElementRef<typeof ShadcnCollapsibleContent>,
  CollapsibleContentProps
>(({ className, ...props }, ref) => {
  return (
    <ShadcnCollapsibleContent
      ref={ref}
      className={cn(className)}
      data-testid="collapsible-content"
      {...props}
    />
  );
});
CollapsibleContent.displayName = 'CollapsibleContent';
