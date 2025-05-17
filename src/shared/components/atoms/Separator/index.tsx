import { cn } from '@/lib/utils';

export interface SeparatorProps {
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  decorative?: boolean;
  children?: React.ReactNode;
}

export function Separator({
  className,
  orientation = 'horizontal',
  decorative = true,
  children,
}: SeparatorProps) {
  if (!children) {
    return (
      <div
        role="separator"
        aria-orientation={orientation}
        data-orientation={orientation}
        {...(decorative && { 'aria-hidden': true })}
        className={cn(
          'bg-border shrink-0',
          orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
          className
        )}
      />
    );
  }

  return (
    <div
      role="separator"
      aria-orientation={orientation}
      data-orientation={orientation}
      {...(decorative && { 'aria-hidden': true })}
      className={cn(
        'relative text-center w-full',
        orientation === 'horizontal' ? 'w-full' : 'h-full',
        className
      )}
    >
      <div
        className={cn(
          'absolute inset-0 flex items-center',
          orientation === 'horizontal' ? '' : 'flex-col'
        )}
      >
        <div
          className={cn(
            'bg-border shrink-0',
            orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]'
          )}
        />
      </div>
      <div className="relative z-10">
        <span className="bg-background px-2 text-sm text-muted-foreground">{children}</span>
      </div>
    </div>
  );
}
