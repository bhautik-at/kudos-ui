import * as React from 'react';
import {
  Form as ShadcnForm,
  FormControl as ShadcnFormControl,
  FormDescription as ShadcnFormDescription,
  FormField as ShadcnFormField,
  FormItem as ShadcnFormItem,
  FormLabel as ShadcnFormLabel,
  FormMessage as ShadcnFormMessage,
  useFormField as shadcnUseFormField,
} from '@/components/ui/form';
import { cn } from '@/lib/utils';

// Export all form components with the same interface
export const Form = ShadcnForm;
export const FormControl = ShadcnFormControl;
export const FormDescription = React.forwardRef<
  React.ElementRef<typeof ShadcnFormDescription>,
  React.ComponentPropsWithoutRef<typeof ShadcnFormDescription>
>(({ className, ...props }, ref) => (
  <ShadcnFormDescription ref={ref} className={cn('text-foreground/70', className)} {...props} />
));
FormDescription.displayName = 'FormDescription';

export const FormField = ShadcnFormField;
export const FormItem = ShadcnFormItem;

export const FormLabel = React.forwardRef<
  React.ElementRef<typeof ShadcnFormLabel>,
  React.ComponentPropsWithoutRef<typeof ShadcnFormLabel>
>(({ className, ...props }, ref) => (
  <ShadcnFormLabel ref={ref} className={cn('text-foreground font-medium', className)} {...props} />
));
FormLabel.displayName = 'FormLabel';

export const FormMessage = React.forwardRef<
  React.ElementRef<typeof ShadcnFormMessage>,
  React.ComponentPropsWithoutRef<typeof ShadcnFormMessage>
>(({ className, ...props }, ref) => (
  <ShadcnFormMessage
    ref={ref}
    className={cn('text-destructive font-medium', className)}
    {...props}
  />
));
FormMessage.displayName = 'FormMessage';

export const useFormField = shadcnUseFormField;
