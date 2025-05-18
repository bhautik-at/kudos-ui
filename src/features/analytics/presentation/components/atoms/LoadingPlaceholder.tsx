import React from 'react';
import { Skeleton } from '@/shared/components/atoms/Skeleton';

interface LoadingPlaceholderProps {
  height?: number | string;
  width?: number | string;
  className?: string;
  variant?: 'rectangle' | 'rounded' | 'circular';
}

export const LoadingPlaceholder = ({
  height = 200,
  width = '100%',
  className = '',
  variant = 'rectangle',
}: LoadingPlaceholderProps) => {
  const variantClass = {
    rectangle: 'rounded',
    rounded: 'rounded-lg',
    circular: 'rounded-full',
  }[variant];

  return (
    <Skeleton
      className={`${variantClass} ${className}`}
      style={{
        height: typeof height === 'number' ? `${height}px` : height,
        width: typeof width === 'number' ? `${width}px` : width,
      }}
    />
  );
};
