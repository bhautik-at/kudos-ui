'use client';

import { useToast as useShadcnToast, toast as shadcnToast } from '@/components/hooks/use-toast';
import type { ToastActionElement } from '@/components/ui/toast';
import { ToastVariant } from '@/shared/components/atoms/toast';
import {
  IToastService,
  ToastOptions,
  ToastType,
} from '@/shared/services/toast/interfaces/IToastService';

/**
 * Custom hook that provides toast functionality
 * Wraps the shadcn/ui toast implementation with our own API
 */
export function useToast(): IToastService {
  const { toasts, dismiss } = useShadcnToast();

  const mapVariantToShadcn = (variant: ToastVariant = 'default') => {
    switch (variant) {
      case 'success':
      case 'info':
      case 'warning':
        return 'default';
      case 'destructive':
      case 'error':
        return 'destructive';
      default:
        return 'default';
    }
  };

  const toast = ({
    type = 'default',
    title,
    description,
    action,
    options,
  }: {
    type?: ToastType;
    title?: string;
    description: string;
    action?: ToastActionElement;
    options?: ToastOptions;
  }) => {
    return shadcnToast({
      variant: mapVariantToShadcn(type as ToastVariant),
      title,
      description,
      action,
      duration: options?.duration,
      className: type !== 'default' && type !== 'destructive' ? `toast-${type}` : '',
      ...options,
    });
  };

  const success = (title: string, description?: string, options?: ToastOptions) => {
    return toast({
      type: 'success',
      title,
      description: description || '',
      options,
    });
  };

  const error = (title: string, description?: string, options?: ToastOptions) => {
    return toast({
      type: 'destructive',
      title,
      description: description || '',
      options,
    });
  };

  const info = (title: string, description?: string, options?: ToastOptions) => {
    return toast({
      type: 'info',
      title,
      description: description || '',
      options,
    });
  };

  const warning = (title: string, description?: string, options?: ToastOptions) => {
    return toast({
      type: 'warning',
      title,
      description: description || '',
      options,
    });
  };

  return {
    toast,
    success,
    error,
    info,
    warning,
    dismiss,
  };
}
