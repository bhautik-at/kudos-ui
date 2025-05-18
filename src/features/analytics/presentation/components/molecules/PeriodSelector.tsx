import React from 'react';
import { PeriodType } from '../../../domain/entities/PeriodEntity';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/shared/components/atoms/Select';
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/atoms/Tabs';
import { Calendar } from 'lucide-react';

interface Period {
  type: PeriodType;
  value: number | string;
  label: string;
  startDate: Date;
  endDate: Date;
}

interface PeriodSelectorProps {
  periodType: PeriodType;
  periodValue: number | string;
  periodOptions: Period[];
  onPeriodTypeChange: (type: PeriodType) => void;
  onPeriodValueChange: (value: number | string) => void;
  className?: string;
}

export const PeriodSelector = ({
  periodType,
  periodValue,
  periodOptions,
  onPeriodTypeChange,
  onPeriodValueChange,
  className,
}: PeriodSelectorProps) => {
  const handlePeriodTypeChange = (value: string) => {
    onPeriodTypeChange(value as PeriodType);
  };

  const handlePeriodValueChange = (value: string) => {
    onPeriodValueChange(value);
  };

  const filteredOptions = periodOptions.filter(option => option.type === periodType);

  // Format the period range into a readable format
  const formatDateRange = (option: Period) => {
    if (!option.startDate || !option.endDate) return option.label;

    const formatDate = (date: Date) => {
      return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    };

    return `${formatDate(option.startDate)} - ${formatDate(option.endDate)}`;
  };

  return (
    <div className={`flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3 ${className}`}>
      <div className="w-full sm:w-auto">
        <Tabs value={periodType} onValueChange={handlePeriodTypeChange} className="w-full">
          <TabsList className="grid grid-cols-4 w-full bg-gray-100 dark:bg-gray-700/50 p-1.5 rounded-md">
            <TabsTrigger
              value="weekly"
              className="py-1.5 font-medium rounded-md data-[state=active]:bg-blue-500 data-[state=active]:text-white dark:data-[state=active]:bg-blue-600 data-[state=active]:shadow-sm"
            >
              Weekly
            </TabsTrigger>
            <TabsTrigger
              value="monthly"
              className="py-1.5 font-medium rounded-md data-[state=active]:bg-blue-500 data-[state=active]:text-white dark:data-[state=active]:bg-blue-600 data-[state=active]:shadow-sm"
            >
              Monthly
            </TabsTrigger>
            <TabsTrigger
              value="quarterly"
              className="py-1.5 font-medium rounded-md data-[state=active]:bg-blue-500 data-[state=active]:text-white dark:data-[state=active]:bg-blue-600 data-[state=active]:shadow-sm"
            >
              Quarterly
            </TabsTrigger>
            <TabsTrigger
              value="yearly"
              className="py-1.5 font-medium rounded-md data-[state=active]:bg-blue-500 data-[state=active]:text-white dark:data-[state=active]:bg-blue-600 data-[state=active]:shadow-sm"
            >
              Yearly
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="w-full sm:w-64">
        <Select value={periodValue.toString()} onValueChange={handlePeriodValueChange}>
          <SelectTrigger className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-40 h-10">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
              <SelectValue placeholder="Select period" />
            </div>
          </SelectTrigger>
          <SelectContent className="max-h-[300px] overflow-y-auto">
            {filteredOptions.map(option => (
              <SelectItem
                key={option.value.toString()}
                value={option.value.toString()}
                className="py-2 px-2"
              >
                <div className="flex flex-col">
                  <span className="font-medium">{option.label}</span>
                  {option.startDate && option.endDate && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {formatDateRange(option)}
                    </span>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
