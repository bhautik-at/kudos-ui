import { forwardRef } from 'react';

import {
  Card as ShadcnCard,
  CardContent as ShadcnCardContent,
  CardDescription as ShadcnCardDescription,
  CardFooter as ShadcnCardFooter,
  CardHeader as ShadcnCardHeader,
  CardTitle as ShadcnCardTitle,
} from '@/components/ui/card';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}
export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}
export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const Card = forwardRef<HTMLDivElement, CardProps>((props, ref) => {
  return <ShadcnCard ref={ref} {...props} />;
});

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>((props, ref) => {
  return <ShadcnCardHeader ref={ref} {...props} />;
});

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>((props, ref) => {
  return <ShadcnCardFooter ref={ref} {...props} />;
});

const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>((props, ref) => {
  return <ShadcnCardTitle ref={ref} {...props} />;
});

const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>((props, ref) => {
  return <ShadcnCardDescription ref={ref} {...props} />;
});

const CardContent = forwardRef<HTMLDivElement, CardContentProps>((props, ref) => {
  return <ShadcnCardContent ref={ref} {...props} />;
});

Card.displayName = 'Card';
CardHeader.displayName = 'CardHeader';
CardFooter.displayName = 'CardFooter';
CardTitle.displayName = 'CardTitle';
CardDescription.displayName = 'CardDescription';
CardContent.displayName = 'CardContent';

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle };
