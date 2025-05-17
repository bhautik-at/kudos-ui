import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ElementRef } from 'react';
import {
  Toast as ShadcnToast,
  ToastAction as ShadcnToastAction,
  ToastClose as ShadcnToastClose,
  ToastDescription as ShadcnToastDescription,
  ToastProvider as ShadcnToastProvider,
  ToastTitle as ShadcnToastTitle,
  ToastViewport as ShadcnToastViewport,
  type ToastProps as ShadcnToastProps,
  type ToastActionElement as ShadcnToastActionElement,
} from '@/components/ui/toast';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

export type ToastVariant = 'default' | 'destructive' | 'success' | 'warning' | 'info' | 'error';

export interface ToastProps extends Omit<ComponentPropsWithoutRef<typeof ShadcnToast>, 'variant'> {
  variant?: ToastVariant;
}

export const Toast = forwardRef<ElementRef<typeof ShadcnToast>, ToastProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    // Map our custom variants to the shadcn ones
    let mappedVariant: 'default' | 'destructive' = 'default';
    let customClass = '';

    switch (variant) {
      case 'success':
        customClass = 'bg-emerald-100 border border-emerald-500 text-emerald-800 shadow-lg';
        break;
      case 'warning':
        customClass = 'bg-amber-100 border border-amber-500 text-amber-800 shadow-lg';
        break;
      case 'info':
        customClass = 'bg-blue-100 border border-blue-500 text-blue-800 shadow-lg';
        break;
      case 'error':
      case 'destructive':
        mappedVariant = 'destructive';
        customClass = 'bg-red-100 border-2 border-red-500 text-red-800 shadow-lg';
        break;
      default:
        mappedVariant = 'default';
        customClass = 'bg-white border border-gray-200 text-gray-800 shadow-lg';
    }

    return (
      <ShadcnToast
        ref={ref}
        className={cn('p-4 rounded-md min-w-[300px] font-medium relative', customClass, className)}
        variant={mappedVariant}
        {...props}
      />
    );
  }
);

Toast.displayName = 'Toast';

export const ToastAction = forwardRef<
  ElementRef<typeof ShadcnToastAction>,
  ComponentPropsWithoutRef<typeof ShadcnToastAction>
>(({ className, ...props }, ref) => (
  <ShadcnToastAction
    ref={ref}
    className={cn('px-3 py-1.5 text-xs font-medium rounded-md ml-2', className)}
    {...props}
  />
));

ToastAction.displayName = 'ToastAction';

export const ToastClose = forwardRef<
  ElementRef<typeof ShadcnToastClose>,
  ComponentPropsWithoutRef<typeof ShadcnToastClose>
>(({ className, ...props }, ref) => (
  <ShadcnToastClose
    ref={ref}
    className={cn(
      'rounded-full p-1 opacity-100 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2',
      className
    )}
    {...props}
  >
    <X className="h-4 w-4" />
  </ShadcnToastClose>
));

ToastClose.displayName = 'ToastClose';

export const ToastTitle = forwardRef<
  ElementRef<typeof ShadcnToastTitle>,
  ComponentPropsWithoutRef<typeof ShadcnToastTitle>
>(({ className, ...props }, ref) => (
  <ShadcnToastTitle ref={ref} className={cn('text-sm font-bold mb-1', className)} {...props} />
));

ToastTitle.displayName = 'ToastTitle';

export const ToastDescription = forwardRef<
  ElementRef<typeof ShadcnToastDescription>,
  ComponentPropsWithoutRef<typeof ShadcnToastDescription>
>(({ className, ...props }, ref) => (
  <ShadcnToastDescription ref={ref} className={cn('text-sm', className)} {...props} />
));

ToastDescription.displayName = 'ToastDescription';

export const ToastProvider = ShadcnToastProvider;

export const ToastViewport = forwardRef<
  ElementRef<typeof ShadcnToastViewport>,
  ComponentPropsWithoutRef<typeof ShadcnToastViewport>
>(({ className, ...props }, ref) => (
  <ShadcnToastViewport
    ref={ref}
    className={cn(
      'fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-full max-w-[380px]',
      className
    )}
    {...props}
  />
));

ToastViewport.displayName = 'ToastViewport';

export type { ShadcnToastActionElement as ToastActionElement };
