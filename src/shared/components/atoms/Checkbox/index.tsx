import { forwardRef } from 'react';
import * as React from 'react';

import { Checkbox as ShadcnCheckbox } from '@/components/ui/checkbox';

/**
 * Props for Checkbox component
 */
export interface CheckboxProps extends React.ComponentPropsWithoutRef<typeof ShadcnCheckbox> {
  id?: string;
}

/**
 * Checkbox component wrapper
 */
export const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(({ id, ...props }, ref) => {
  return <ShadcnCheckbox ref={ref} id={id} {...props} />;
});

Checkbox.displayName = 'Checkbox';
