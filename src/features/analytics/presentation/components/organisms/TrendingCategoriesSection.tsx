import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/atoms/Card';
import { PieChart } from '../molecules/PieChart';
import { useTrendingCategories } from '../../hooks/useTrendingCategories';
import { PeriodType } from '../../../domain/entities/PeriodEntity';

interface TrendingCategoriesSectionProps {
  periodType: PeriodType;
  periodValue: number | string;
  organizationId: string; // From query parameter orgId
  className?: string;
}

export const TrendingCategoriesSection = ({
  periodType,
  periodValue,
  organizationId,
  className,
}: TrendingCategoriesSectionProps) => {
  const { data, isLoading, error } = useTrendingCategories({
    periodType,
    periodValue,
    organizationId,
  });

  return (
    <Card className={`overflow-hidden bg-white dark:bg-gray-800 ${className}`}>
      <CardHeader className="pb-2 border-b border-gray-100 dark:border-gray-700">
        <CardTitle className="text-xl text-gray-900 dark:text-gray-100">
          Trending Categories
        </CardTitle>
        <CardDescription className="text-gray-500 dark:text-gray-400">
          Most used kudos categories for the selected period
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        {error?.message?.includes('No data available') ? (
          <div className="flex flex-col items-center justify-center h-[300px] text-gray-500 dark:text-gray-400">
            <svg
              className="w-12 h-12 mb-4 text-gray-300 dark:text-gray-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
              />
            </svg>
            <p className="text-center">No categories data available for this period</p>
            <p className="text-center text-sm mt-1">Try selecting a different time range</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-[300px] text-destructive">
            <p>Error loading data: {error.message}</p>
          </div>
        ) : (
          <div className="h-[300px]">
            <PieChart data={data?.data || []} isLoading={isLoading} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
