import React from 'react';
import { PeriodSelector } from '../molecules/PeriodSelector';
import { useAnalyticsPeriod } from '../../hooks/useAnalyticsPeriod';
import { PeriodType } from '../../../domain/entities/PeriodEntity';
import { Calendar, TrendingUp } from 'lucide-react';

interface AnalyticsFiltersProps {
  periodType: PeriodType;
  periodValue: number | string;
  onPeriodTypeChange: (type: PeriodType) => void;
  onPeriodValueChange: (value: number | string) => void;
  className?: string;
}

export const AnalyticsFilters = ({
  periodType,
  periodValue,
  onPeriodTypeChange,
  onPeriodValueChange,
  className,
}: AnalyticsFiltersProps) => {
  const { periodOptions } = useAnalyticsPeriod({
    initialType: periodType,
    initialValue: periodValue,
  });

  return (
    <div className={`p-0 rounded-lg bg-transparent ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg mr-3">
            <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Analytics Period
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Select a time period to view analytics data
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-1 border border-gray-200 dark:border-gray-700">
          <PeriodSelector
            periodType={periodType}
            periodValue={periodValue}
            periodOptions={periodOptions}
            onPeriodTypeChange={onPeriodTypeChange}
            onPeriodValueChange={onPeriodValueChange}
          />
        </div>
      </div>
    </div>
  );
};
