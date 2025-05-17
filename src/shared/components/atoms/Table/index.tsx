import * as React from 'react';

import {
  Table as ShadcnTable,
  TableBody as ShadcnTableBody,
  TableCaption as ShadcnTableCaption,
  TableCell as ShadcnTableCell,
  TableFooter as ShadcnTableFooter,
  TableHead as ShadcnTableHead,
  TableHeader as ShadcnTableHeader,
  TableRow as ShadcnTableRow,
} from '@/components/ui/table';

// Table component
export const Table = React.forwardRef<
  React.ElementRef<typeof ShadcnTable>,
  React.ComponentPropsWithoutRef<typeof ShadcnTable>
>(({ className, ...props }, ref) => <ShadcnTable ref={ref} className={className} {...props} />);
Table.displayName = 'Table';

// TableHeader component
export const TableHeader = React.forwardRef<
  React.ElementRef<typeof ShadcnTableHeader>,
  React.ComponentPropsWithoutRef<typeof ShadcnTableHeader>
>(({ className, ...props }, ref) => (
  <ShadcnTableHeader ref={ref} className={className} {...props} />
));
TableHeader.displayName = 'TableHeader';

// TableBody component
export const TableBody = React.forwardRef<
  React.ElementRef<typeof ShadcnTableBody>,
  React.ComponentPropsWithoutRef<typeof ShadcnTableBody>
>(({ className, ...props }, ref) => <ShadcnTableBody ref={ref} className={className} {...props} />);
TableBody.displayName = 'TableBody';

// TableFooter component
export const TableFooter = React.forwardRef<
  React.ElementRef<typeof ShadcnTableFooter>,
  React.ComponentPropsWithoutRef<typeof ShadcnTableFooter>
>(({ className, ...props }, ref) => (
  <ShadcnTableFooter ref={ref} className={className} {...props} />
));
TableFooter.displayName = 'TableFooter';

// TableRow component
export const TableRow = React.forwardRef<
  React.ElementRef<typeof ShadcnTableRow>,
  React.ComponentPropsWithoutRef<typeof ShadcnTableRow>
>(({ className, ...props }, ref) => <ShadcnTableRow ref={ref} className={className} {...props} />);
TableRow.displayName = 'TableRow';

// TableHead component
export const TableHead = React.forwardRef<
  React.ElementRef<typeof ShadcnTableHead>,
  React.ComponentPropsWithoutRef<typeof ShadcnTableHead>
>(({ className, ...props }, ref) => <ShadcnTableHead ref={ref} className={className} {...props} />);
TableHead.displayName = 'TableHead';

// TableCell component
export const TableCell = React.forwardRef<
  React.ElementRef<typeof ShadcnTableCell>,
  React.ComponentPropsWithoutRef<typeof ShadcnTableCell>
>(({ className, ...props }, ref) => <ShadcnTableCell ref={ref} className={className} {...props} />);
TableCell.displayName = 'TableCell';

// TableCaption component
export const TableCaption = React.forwardRef<
  React.ElementRef<typeof ShadcnTableCaption>,
  React.ComponentPropsWithoutRef<typeof ShadcnTableCaption>
>(({ className, ...props }, ref) => (
  <ShadcnTableCaption ref={ref} className={className} {...props} />
));
TableCaption.displayName = 'TableCaption';
