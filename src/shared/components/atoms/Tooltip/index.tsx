import { ComponentProps, forwardRef } from 'react';

import {
  Tooltip as ShadcnTooltip,
  TooltipContent as ShadcnTooltipContent,
  TooltipProvider as ShadcnTooltipProvider,
  TooltipTrigger as ShadcnTooltipTrigger,
} from '@/components/ui/tooltip';

// Export component types
export type TooltipProps = ComponentProps<typeof ShadcnTooltip>;
export type TooltipTriggerProps = ComponentProps<typeof ShadcnTooltipTrigger>;
export type TooltipContentProps = ComponentProps<typeof ShadcnTooltipContent>;
export type TooltipProviderProps = ComponentProps<typeof ShadcnTooltipProvider>;

// Simple re-exports for components without modifications
export const Tooltip = ShadcnTooltip;
export const TooltipTrigger = ShadcnTooltipTrigger;
export const TooltipProvider = ShadcnTooltipProvider;

// Component with forwardRef for proper ref handling and testability
export const TooltipContent = forwardRef<
  React.ElementRef<typeof ShadcnTooltipContent>,
  TooltipContentProps
>((props, ref) => {
  return <ShadcnTooltipContent ref={ref} {...props} data-testid="tooltip-content" />;
});
TooltipContent.displayName = 'TooltipContent';
