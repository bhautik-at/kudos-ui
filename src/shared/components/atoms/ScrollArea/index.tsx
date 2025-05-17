import { forwardRef } from 'react';

import {
  ScrollArea as ShadcnScrollArea,
  ScrollBar as ShadcnScrollBar,
} from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

export interface ScrollAreaProps extends React.ComponentPropsWithRef<typeof ShadcnScrollArea> {}

export const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <ShadcnScrollArea ref={ref} className={cn(className)} {...props}>
        {children}
      </ShadcnScrollArea>
    );
  }
);

ScrollArea.displayName = 'ScrollArea';

export { ShadcnScrollBar as ScrollBar };
