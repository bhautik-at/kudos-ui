import * as React from 'react';

import {
  Pagination as ShadcnPagination,
  PaginationContent as ShadcnPaginationContent,
  PaginationEllipsis as ShadcnPaginationEllipsis,
  PaginationItem as ShadcnPaginationItem,
  PaginationLink as ShadcnPaginationLink,
  PaginationNext as ShadcnPaginationNext,
  PaginationPrevious as ShadcnPaginationPrevious,
} from '@/components/ui/pagination';

// Pagination component
export const Pagination = React.forwardRef<
  React.ElementRef<typeof ShadcnPagination>,
  React.ComponentPropsWithoutRef<typeof ShadcnPagination>
>(({ className, ...props }, ref) => (
  <ShadcnPagination ref={ref} className={className} {...props} />
));
Pagination.displayName = 'Pagination';

// PaginationContent component
export const PaginationContent = React.forwardRef<
  React.ElementRef<typeof ShadcnPaginationContent>,
  React.ComponentPropsWithoutRef<typeof ShadcnPaginationContent>
>(({ className, ...props }, ref) => (
  <ShadcnPaginationContent ref={ref} className={className} {...props} />
));
PaginationContent.displayName = 'PaginationContent';

// PaginationItem component
export const PaginationItem = React.forwardRef<
  React.ElementRef<typeof ShadcnPaginationItem>,
  React.ComponentPropsWithoutRef<typeof ShadcnPaginationItem>
>(({ className, ...props }, ref) => (
  <ShadcnPaginationItem ref={ref} className={className} {...props} />
));
PaginationItem.displayName = 'PaginationItem';

// PaginationLink component
export const PaginationLink = React.forwardRef<
  React.ElementRef<typeof ShadcnPaginationLink>,
  React.ComponentPropsWithoutRef<typeof ShadcnPaginationLink>
>(({ className, ...props }, ref) => (
  <ShadcnPaginationLink ref={ref} className={className} {...props} />
));
PaginationLink.displayName = 'PaginationLink';

// PaginationPrevious component
export const PaginationPrevious = React.forwardRef<
  React.ElementRef<typeof ShadcnPaginationPrevious>,
  React.ComponentPropsWithoutRef<typeof ShadcnPaginationPrevious>
>(({ className, ...props }, ref) => (
  <ShadcnPaginationPrevious ref={ref} className={className} {...props} />
));
PaginationPrevious.displayName = 'PaginationPrevious';

// PaginationNext component
export const PaginationNext = React.forwardRef<
  React.ElementRef<typeof ShadcnPaginationNext>,
  React.ComponentPropsWithoutRef<typeof ShadcnPaginationNext>
>(({ className, ...props }, ref) => (
  <ShadcnPaginationNext ref={ref} className={className} {...props} />
));
PaginationNext.displayName = 'PaginationNext';

// PaginationEllipsis component
export const PaginationEllipsis = React.forwardRef<
  React.ElementRef<typeof ShadcnPaginationEllipsis>,
  React.ComponentPropsWithoutRef<typeof ShadcnPaginationEllipsis>
>(({ className, ...props }, ref) => (
  <ShadcnPaginationEllipsis ref={ref} className={className} {...props} />
));
PaginationEllipsis.displayName = 'PaginationEllipsis';
