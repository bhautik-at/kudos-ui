import { forwardRef } from 'react';

import { Switch as ShadcnSwitch } from '@/components/ui/switch';

export interface SwitchProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  ({ checked, onCheckedChange, ...props }, ref) => {
    return (
      <ShadcnSwitch ref={ref} checked={checked} onCheckedChange={onCheckedChange} {...props} />
    );
  }
);

Switch.displayName = 'Switch';
