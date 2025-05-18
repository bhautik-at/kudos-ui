import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/atoms/Card';
import { BarChart } from '../molecules/BarChart';
import { EntityTypeSelector } from '../molecules/EntityTypeSelector';
import { LoadingPlaceholder } from '../atoms/LoadingPlaceholder';
import { useTopRecognized } from '../../hooks/useTopRecognized';
import { PeriodType } from '../../../domain/entities/PeriodEntity';
import { EntityType } from '../../../domain/interfaces/AnalyticsRepository';

interface TopRecognizedSectionProps {
  periodType: PeriodType;
  periodValue: number | string;
  organizationId: string; // From query parameter orgId
  entityType: EntityType;
  onEntityTypeChange: (type: EntityType) => void;
  className?: string;
}

export const TopRecognizedSection = ({
  periodType,
  periodValue,
  organizationId,
  entityType,
  onEntityTypeChange,
  className,
}: TopRecognizedSectionProps) => {
  const { data, isLoading, error } = useTopRecognized({
    periodType,
    periodValue,
    organizationId,
    type: entityType,
  });

  return (
    <Card className={`overflow-hidden bg-white dark:bg-gray-800 ${className}`}>
      <CardHeader className="pb-2 border-b border-gray-100 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl text-gray-900 dark:text-gray-100">
              Top Recognized {entityType === 'individuals' ? 'People' : 'Teams'}
            </CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">
              Most recognized {entityType} for the selected period
            </CardDescription>
          </div>
          <EntityTypeSelector entityType={entityType} onChange={onEntityTypeChange} />
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {error?.message?.includes('No data available') ? (
          <div className="flex flex-col items-center justify-center h-[350px] text-gray-500 dark:text-gray-400">
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
                d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
              />
            </svg>
            <p className="text-center">No recognition data available for this period</p>
            <p className="text-center text-sm mt-1">
              Try selecting a different time range or entity type
            </p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-[350px] text-destructive">
            <p>Error loading data: {error.message}</p>
          </div>
        ) : (
          <div className="h-[350px]">
            <BarChart
              data={data?.data || []}
              isLoading={isLoading}
              barColor="bg-gradient-to-r from-blue-500 to-indigo-600"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
