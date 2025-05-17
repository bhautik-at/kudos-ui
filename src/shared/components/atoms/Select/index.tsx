import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ElementRef } from 'react';

import {
  Select as ShadcnSelect,
  SelectContent as ShadcnSelectContent,
  SelectGroup as ShadcnSelectGroup,
  SelectItem as ShadcnSelectItem,
  SelectLabel as ShadcnSelectLabel,
  SelectTrigger as ShadcnSelectTrigger,
  SelectValue as ShadcnSelectValue,
  SelectSeparator as ShadcnSelectSeparator,
} from '@/components/ui/select';

// Select Root
export const Select = ShadcnSelect;

// SelectTrigger
export type SelectTriggerProps = ComponentPropsWithoutRef<typeof ShadcnSelectTrigger>;

export const SelectTrigger = forwardRef<ElementRef<typeof ShadcnSelectTrigger>, SelectTriggerProps>(
  (props, ref) => {
    return <ShadcnSelectTrigger ref={ref} {...props} />;
  }
);

SelectTrigger.displayName = 'SelectTrigger';

// SelectValue
export type SelectValueProps = ComponentPropsWithoutRef<typeof ShadcnSelectValue>;

export const SelectValue = forwardRef<ElementRef<typeof ShadcnSelectValue>, SelectValueProps>(
  (props, ref) => {
    return <ShadcnSelectValue ref={ref} {...props} />;
  }
);

SelectValue.displayName = 'SelectValue';

// SelectContent
export type SelectContentProps = ComponentPropsWithoutRef<typeof ShadcnSelectContent>;

export const SelectContent = forwardRef<ElementRef<typeof ShadcnSelectContent>, SelectContentProps>(
  (props, ref) => {
    return <ShadcnSelectContent ref={ref} {...props} />;
  }
);

SelectContent.displayName = 'SelectContent';

// SelectItem
export type SelectItemProps = ComponentPropsWithoutRef<typeof ShadcnSelectItem>;

export const SelectItem = forwardRef<ElementRef<typeof ShadcnSelectItem>, SelectItemProps>(
  (props, ref) => {
    return <ShadcnSelectItem ref={ref} {...props} />;
  }
);

SelectItem.displayName = 'SelectItem';

// SelectGroup
export type SelectGroupProps = ComponentPropsWithoutRef<typeof ShadcnSelectGroup>;

export const SelectGroup = forwardRef<ElementRef<typeof ShadcnSelectGroup>, SelectGroupProps>(
  (props, ref) => {
    return <ShadcnSelectGroup ref={ref} {...props} />;
  }
);

SelectGroup.displayName = 'SelectGroup';

// SelectLabel
export type SelectLabelProps = ComponentPropsWithoutRef<typeof ShadcnSelectLabel>;

export const SelectLabel = forwardRef<ElementRef<typeof ShadcnSelectLabel>, SelectLabelProps>(
  (props, ref) => {
    return <ShadcnSelectLabel ref={ref} {...props} />;
  }
);

SelectLabel.displayName = 'SelectLabel';

// SelectSeparator
export type SelectSeparatorProps = ComponentPropsWithoutRef<typeof ShadcnSelectSeparator>;

export const SelectSeparator = forwardRef<
  ElementRef<typeof ShadcnSelectSeparator>,
  SelectSeparatorProps
>((props, ref) => {
  return <ShadcnSelectSeparator ref={ref} {...props} />;
});

SelectSeparator.displayName = 'SelectSeparator';
