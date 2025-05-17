import { ComponentProps, forwardRef } from 'react';

import { Textarea as ShadcnTextarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

export type TextareaProps = ComponentProps<typeof ShadcnTextarea>;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return <ShadcnTextarea ref={ref} className={cn(className)} data-testid="textarea" {...props} />;
  }
);

Textarea.displayName = 'Textarea';
