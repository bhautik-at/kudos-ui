import { ReactNode, forwardRef } from 'react';

import { Input as ShadcnInput } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  helperText?: string;
  'data-testid'?: string;
  toggleButton?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, helperText, toggleButton, 'data-testid': dataTestId, ...props }, ref) => {
    return (
      <div className="w-full">
        <div className="relative">
          <ShadcnInput
            className={cn(
              'transition-colors',
              toggleButton && 'pr-10',
              error && 'border-red-500 focus-visible:ring-red-500',
              className
            )}
            data-testid={dataTestId}
            ref={ref}
            {...props}
          />
          {toggleButton}
        </div>
        {helperText && (
          <div className="min-h-[20px]">
            <p className={cn('mt-1 text-sm', error ? 'text-red-500' : 'text-gray-500')}>
              {helperText}
            </p>
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
