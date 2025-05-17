import type { ToastActionElement } from '@/components/ui/toast';
import type { ReactNode } from 'react';

export type ToastType = 'default' | 'success' | 'error' | 'info' | 'warning' | 'destructive';
export type ToastPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export interface ToastOptions {
  duration?: number;
  position?: ToastPosition;
  action?: ToastActionElement;
  onDismiss?: () => void;
}

export interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  description?: string;
  action?: ToastActionElement;
  position?: ToastPosition;
  duration?: number;
  onDismiss?: () => void;
}

export interface IToastService {
  toast: (options: {
    type?: ToastType;
    title?: string;
    description: string;
    action?: ToastActionElement;
    options?: ToastOptions;
  }) => { id: string; dismiss: () => void; update: (props: any) => void };
  success: (
    title: string,
    description?: string,
    options?: ToastOptions
  ) => { id: string; dismiss: () => void; update: (props: any) => void };
  error: (
    title: string,
    description?: string,
    options?: ToastOptions
  ) => { id: string; dismiss: () => void; update: (props: any) => void };
  info: (
    title: string,
    description?: string,
    options?: ToastOptions
  ) => { id: string; dismiss: () => void; update: (props: any) => void };
  warning: (
    title: string,
    description?: string,
    options?: ToastOptions
  ) => { id: string; dismiss: () => void; update: (props: any) => void };
  dismiss: (id?: string) => void;
}
