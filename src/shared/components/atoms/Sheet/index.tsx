import { ComponentProps, forwardRef } from 'react';

import {
  Sheet as ShadcnSheet,
  SheetContent as ShadcnSheetContent,
  SheetDescription as ShadcnSheetDescription,
  SheetOverlay as ShadcnSheetOverlay,
  SheetTitle as ShadcnSheetTitle,
  SheetTrigger as ShadcnSheetTrigger,
  SheetPortal,
} from '@/components/ui/sheet';

export type SheetProps = ComponentProps<typeof ShadcnSheet>;
export type SheetContentProps = ComponentProps<typeof ShadcnSheetContent>;
export type SheetDescriptionProps = ComponentProps<typeof ShadcnSheetDescription>;
export type SheetTitleProps = ComponentProps<typeof ShadcnSheetTitle>;
export type SheetTriggerProps = ComponentProps<typeof ShadcnSheetTrigger>;
export type SheetOverlayProps = ComponentProps<typeof ShadcnSheetOverlay>;

export const Sheet = ShadcnSheet;
export const SheetTrigger = ShadcnSheetTrigger;
export const SheetContent = forwardRef<HTMLDivElement, SheetContentProps>((props, ref) => {
  return (
    <SheetPortal>
      <SheetOverlay />
      <ShadcnSheetContent ref={ref} {...props} />
    </SheetPortal>
  );
});
export const SheetDescription = ShadcnSheetDescription;
export const SheetTitle = ShadcnSheetTitle;
export const SheetOverlay = forwardRef<HTMLDivElement, SheetOverlayProps>((props, ref) => {
  return <ShadcnSheetOverlay ref={ref} data-testid="overlay" {...props} />;
});

SheetContent.displayName = 'SheetContent';
SheetOverlay.displayName = 'SheetOverlay';
