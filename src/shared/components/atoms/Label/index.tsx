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
        className={cn('transition-colors', error && 'text-red-500', className)}
        {...props}
      >
        {children}
        {required && <span className="text-red-500 ml-1">*</span>}
      </ShadcnLabel>
    );
  }
);

Label.displayName = 'Label';
