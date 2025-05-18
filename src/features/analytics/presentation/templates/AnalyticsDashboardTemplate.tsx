import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/shared/components/templates/DashboardLayout';
import { AnalyticsFilters } from '../components/organisms/AnalyticsFilters';
import { TopRecognizedSection } from '../components/organisms/TopRecognizedSection';
import { TrendingCategoriesSection } from '../components/organisms/TrendingCategoriesSection';
import { TrendingKeywordsSection } from '../components/organisms/TrendingKeywordsSection';
import { useAnalyticsPeriod } from '../hooks/useAnalyticsPeriod';
import { PeriodType } from '../../domain/entities/PeriodEntity';
import { EntityType } from '../../domain/interfaces/AnalyticsRepository';

interface AnalyticsDashboardTemplateProps {
  organizationId: string; // From query parameter orgId
}

export const AnalyticsDashboardTemplate = ({ organizationId }: AnalyticsDashboardTemplateProps) => {
  // Initialize with hooks
  const { currentPeriod, setPeriodType, setPeriodValue } = useAnalyticsPeriod();

  // Track entity type for top recognized section
  const [entityType, setEntityType] = useState<EntityType>('individuals');

  useEffect(() => {
    console.log('AnalyticsDashboardTemplate initialized with:', {
      organizationId,
      currentPeriod,
      entityType,
    });
  }, []);

  // Handlers
  const handlePeriodTypeChange = (type: PeriodType) => {
    setPeriodType(type);
  };

  const handlePeriodValueChange = (value: number | string) => {
    setPeriodValue(value);
  };

  const handleEntityTypeChange = (type: EntityType) => {
    setEntityType(type);
  };

  // Check if organizationId is valid
  if (!organizationId) {
    console.error('Invalid organizationId provided:', organizationId);
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Analytics Dashboard
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Visualize kudos data and track recognition metrics across your organization
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
          <AnalyticsFilters
            periodType={currentPeriod.type}
            periodValue={currentPeriod.value}
            onPeriodTypeChange={handlePeriodTypeChange}
            onPeriodValueChange={handlePeriodValueChange}
          />
        </div>

        <div className="space-y-8">
          <TopRecognizedSection
            periodType={currentPeriod.type}
            periodValue={currentPeriod.value}
            organizationId={organizationId}
            entityType={entityType}
            onEntityTypeChange={handleEntityTypeChange}
            className="shadow-sm"
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <TrendingCategoriesSection
              periodType={currentPeriod.type}
              periodValue={currentPeriod.value}
              organizationId={organizationId}
              className="shadow-sm"
            />

            <TrendingKeywordsSection
              periodType={currentPeriod.type}
              periodValue={currentPeriod.value}
              organizationId={organizationId}
              className="shadow-sm"
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
