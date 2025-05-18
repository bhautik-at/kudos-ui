import React, { useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/atoms/Card';
import { WordCloud } from '../molecules/WordCloud';
import { useTrendingKeywords } from '../../hooks/useTrendingKeywords';
import { PeriodType } from '../../../domain/entities/PeriodEntity';

interface TrendingKeywordsSectionProps {
  periodType: PeriodType;
  periodValue: number | string;
  organizationId: string; // From query parameter orgId
  className?: string;
}

export const TrendingKeywordsSection = ({
  periodType,
  periodValue,
  organizationId,
  className,
}: TrendingKeywordsSectionProps) => {
  const { data, isLoading, error } = useTrendingKeywords({
    periodType,
    periodValue,
    organizationId,
  });

  useEffect(() => {
    console.log('TrendingKeywordsSection received data:', data);
    console.log('TrendingKeywordsSection isLoading:', isLoading);
    console.log('TrendingKeywordsSection error:', error);
  }, [data, isLoading, error]);

  // Ensure data is properly formatted for the WordCloud component
  const formattedData = React.useMemo(() => {
    if (!data?.data || !Array.isArray(data.data)) {
      console.log('No valid data available for the WordCloud');
      return [];
    }

    // Ensure each item has the required properties
    return data.data.map(item => ({
      keyword: String(item.keyword || ''),
      count: Number(item.count || 0),
      percentage: Number(item.percentage || 0),
    }));
  }, [data]);

  useEffect(() => {
    console.log('Formatted data for WordCloud:', formattedData);
  }, [formattedData]);

  return (
    <Card className={`overflow-hidden bg-white dark:bg-gray-800 ${className}`}>
      <CardHeader className="pb-2 border-b border-gray-100 dark:border-gray-700">
        <CardTitle className="text-xl text-gray-900 dark:text-gray-100">
          Trending Keywords
        </CardTitle>
        <CardDescription className="text-gray-500 dark:text-gray-400">
          Most mentioned keywords in kudos messages
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
                d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
              />
            </svg>
            <p className="text-center">No keywords data available for this period</p>
            <p className="text-center text-sm mt-1">Try selecting a different time range</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-[300px] text-destructive">
            <p>Error loading data: {error.message}</p>
          </div>
        ) : (
          <div className="h-[300px]">
            <WordCloud data={formattedData} isLoading={isLoading} />
            {formattedData.length === 0 && !isLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-center text-gray-500 dark:text-gray-400">
                  No keyword data available
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
