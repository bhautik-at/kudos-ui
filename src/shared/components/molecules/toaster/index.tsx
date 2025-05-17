'use client';

import { FC } from 'react';
import { useToast } from '@/components/hooks/use-toast';
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  ToastVariant,
} from '@/shared/components/atoms/toast';
import { cn } from '@/lib/utils';
import { ToastActionElement } from '@/components/ui/toast';

interface ToastProps {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
  className?: string;
  [key: string]: any;
}

/**
 * Toaster component for displaying toast notifications
 * Wraps the shadcn/ui toaster component with our own styling
 */
export function Toaster() {
  const { toasts } = useToast();

  // Helper function to extract the toast type from className
  const getToastType = (className = ''): ToastVariant => {
    if (className.includes('toast-success')) return 'success';
    if (className.includes('toast-error')) return 'error';
    if (className.includes('toast-warning')) return 'warning';
    if (className.includes('toast-info')) return 'info';
    if (className.includes('toast-destructive')) return 'destructive';
    return 'default';
  };

  return (
    <ToastProvider>
      {toasts.map(function ({
        id,
        title,
        description,
        action,
        className = '',
        ...props
      }: ToastProps) {
        const toastType = getToastType(className);

        return (
          <Toast
            key={id}
            className={cn(className, 'flex items-center justify-center')}
            variant={toastType}
            {...props}
          >
            <div className="flex-1 grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && <ToastDescription>{description}</ToastDescription>}
            </div>
            {action}
            {/* <ToastClose /> */}
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
