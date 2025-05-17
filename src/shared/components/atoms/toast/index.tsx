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
        customClass = 'bg-emerald-50 border-emerald-500 text-emerald-800';
        break;
      case 'warning':
        customClass = 'bg-amber-50 border-amber-500 text-amber-800';
        break;
      case 'info':
        customClass = 'bg-blue-50 border-blue-500 text-blue-800';
        break;
      case 'error':
      case 'destructive':
        mappedVariant = 'destructive';
        break;
      default:
        mappedVariant = 'default';
    }

    return (
      <ShadcnToast
        ref={ref}
        className={cn(customClass, className)}
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
  <ShadcnToastAction ref={ref} className={cn(className)} {...props} />
));

ToastAction.displayName = 'ToastAction';

export const ToastClose = forwardRef<
  ElementRef<typeof ShadcnToastClose>,
  ComponentPropsWithoutRef<typeof ShadcnToastClose>
>(({ className, ...props }, ref) => (
  <ShadcnToastClose ref={ref} className={cn(className)} {...props} />
));

ToastClose.displayName = 'ToastClose';

export const ToastTitle = forwardRef<
  ElementRef<typeof ShadcnToastTitle>,
  ComponentPropsWithoutRef<typeof ShadcnToastTitle>
>(({ className, ...props }, ref) => (
  <ShadcnToastTitle ref={ref} className={cn(className)} {...props} />
));

ToastTitle.displayName = 'ToastTitle';

export const ToastDescription = forwardRef<
  ElementRef<typeof ShadcnToastDescription>,
  ComponentPropsWithoutRef<typeof ShadcnToastDescription>
>(({ className, ...props }, ref) => (
  <ShadcnToastDescription ref={ref} className={cn(className)} {...props} />
));

ToastDescription.displayName = 'ToastDescription';

export const ToastProvider = ShadcnToastProvider;
export const ToastViewport = ShadcnToastViewport;

export type { ShadcnToastActionElement as ToastActionElement };
