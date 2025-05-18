import React from 'react';
import { Badge } from './Badge';

interface PercentageBadgeProps {
  value: number;
  className?: string;
  showPlus?: boolean;
}

export const PercentageBadge = ({ value, className, showPlus = false }: PercentageBadgeProps) => {
  // Round to 1 decimal place
  const formattedValue = Math.round(value * 10) / 10;

  // Determine color based on value
  let variant: 'default' | 'secondary' | 'outline' | 'destructive' = 'default';

  if (formattedValue >= 25) {
    variant = 'default'; // Primary color for high values
  } else if (formattedValue >= 10) {
    variant = 'secondary'; // Secondary color for medium values
  } else {
    variant = 'outline'; // Outline for low values
  }

  const prefix = showPlus && formattedValue > 0 ? '+' : '';

  return (
    <Badge variant={variant} className={className}>
      {prefix}
      {formattedValue}%
    </Badge>
  );
};
