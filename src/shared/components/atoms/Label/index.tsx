import { forwardRef } from 'react';

import { Label as ShadcnLabel } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  error?: boolean;
  required?: boolean;
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, error, required, ...props }, ref) => {
    return (
      <ShadcnLabel
        ref={ref}
        className={cn(
          'text-foreground font-medium transition-colors',
          error && 'text-destructive',
          className
        )}
        {...props}
      >
        {children}
        {required && <span className="text-destructive ml-1">*</span>}
      </ShadcnLabel>
    );
  }
);

Label.displayName = 'Label';
