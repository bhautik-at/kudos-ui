import { toast as shadcnToast } from '@/components/hooks/use-toast';
import type { IToastService, ToastOptions, ToastType } from './interfaces/IToastService';
import type { ToastActionElement } from '@/components/ui/toast';

/**
 * Service implementation for handling toast notifications
 * This is a singleton service that can be used outside of React components
 */
export class ToastService implements IToastService {
  private static instance: ToastService;
  private defaultDuration = 3000; // 3 seconds

  private constructor() {}

  /**
   * Get the singleton instance of the toast service
   */
  public static getInstance(): ToastService {
    if (!ToastService.instance) {
      ToastService.instance = new ToastService();
    }
    return ToastService.instance;
  }

  /**
   * Show a toast notification with custom options
   */
  toast({
    type = 'default',
    title,
    action,
    options,
  }: {
    type?: ToastType;
    title?: string;
    action?: ToastActionElement;
    options?: ToastOptions;
  }) {
    // Map to shadcn variant
    const variant = type === 'destructive' || type === 'error' ? 'destructive' : 'default';

    // For error type, map to destructive
    const actualType = type === 'error' ? 'destructive' : type;

    return shadcnToast({
      variant,
      title,
      action,
      duration: options?.duration || this.defaultDuration,
      className:
        actualType !== 'default' && actualType !== 'destructive' ? `toast-${actualType}` : '',
      ...options,
    });
  }

  /**
   * Show a success toast notification
   */
  success(title: string, options?: ToastOptions) {
    return this.toast({
      type: 'success',
      title,
      options,
    });
  }

  /**
   * Show an error toast notification
   */
  error(title: string, options?: ToastOptions) {
    return this.toast({
      type: 'destructive',
      title,
      options,
    });
  }

  /**
   * Show an info toast notification
   */
  info(title: string, options?: ToastOptions) {
    return this.toast({
      type: 'info',
      title,
      options,
    });
  }

  /**
   * Show a warning toast notification
   */
  warning(title: string, options?: ToastOptions) {
    return this.toast({
      type: 'warning',
      title,
      options,
    });
  }

  /**
   * Dismiss a toast notification by id
   * If no id is provided, dismisses all toasts
   * Note: This method only works in React components. For non-React code,
   * use the dismiss method from a toast instance return value.
   */
  dismiss(id?: string) {
    // This won't work outside React components
    // For non-React code, use the dismiss method returned by toast method
    const toast = shadcnToast({});
    toast.dismiss();

    // When used via useToast hook, this will dismiss all toasts
    if (id) {
      // Can only dismiss specific toast if we have the toast object
      const toasts = this.getActiveToasts();
      const targetToast = toasts.find(t => t.id === id);
      if (targetToast && targetToast.dismiss) {
        targetToast.dismiss();
      }
    }
  }

  /**
   * Helper method to get active toasts
   * Note: This is not actually implemented as it requires React hooks
   */
  private getActiveToasts() {
    // This is a stub that would require React hooks
    // In practice, this would need to be handled by the component using useToast
    return [] as any[];
  }
}

// Export a singleton instance
export const toastService = ToastService.getInstance();
