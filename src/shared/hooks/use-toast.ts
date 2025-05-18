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

  const mapVariantToType = (variant: ToastVariant = 'default'): 'default' | 'destructive' => {
    // Always map to shadcn's supported variants
    return variant === 'destructive' || variant === 'error' ? 'destructive' : 'default';
  };

  const toast = ({
    type = 'default',
    title,
    action,
    options,
  }: {
    type?: ToastType;
    title?: string;
    action?: ToastActionElement;
    options?: ToastOptions;
  }) => {
    // We'll pass the original type as a className and extend options
    // but we'll map it to a shadcn-supported variant for the underlying component
    const toastOptions = {
      ...options,
      variant: mapVariantToType(type as ToastVariant),
      className: type ? `toast-${type}` : '',
      // Add our custom type/variant for our Toast component to use
      customVariant: type,
    };

    return shadcnToast({
      title,
      action,
      duration: options?.duration || 5000,
      ...toastOptions,
    });
  };

  const success = (title: string, options?: ToastOptions) => {
    return toast({
      type: 'success',
      title,
      options,
    });
  };

  const error = (title: string, options?: ToastOptions) => {
    return toast({
      type: 'error', // Use 'error' for our component
      title,
      options: { ...options, duration: options?.duration || 7000 }, // Error messages stay longer
    });
  };

  const info = (title: string, options?: ToastOptions) => {
    return toast({
      type: 'info',
      title,
      options,
    });
  };

  const warning = (title: string, options?: ToastOptions) => {
    return toast({
      type: 'warning',
      title,
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
