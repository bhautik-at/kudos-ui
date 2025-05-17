import { forwardRef } from 'react';

import { Button as ShadcnButton, ButtonProps as ShadcnButtonProps } from '@/components/ui/button';

export interface ButtonProps extends ShadcnButtonProps {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  return <ShadcnButton ref={ref} {...props} />;
});

Button.displayName = 'Button';
