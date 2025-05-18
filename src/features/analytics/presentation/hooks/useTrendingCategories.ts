import { useState, useEffect } from 'react';
import { AnalyticsApiClient } from '../../infrastructure/api/AnalyticsApiClient';
import { AnalyticsRepositoryImpl } from '../../infrastructure/repositories/AnalyticsRepositoryImpl';
import { GetTrendingCategoriesUseCase } from '../../application/useCases/GetTrendingCategoriesUseCase';
import {
  TrendingCategoriesInputDto,
  TrendingCategoriesOutputDto,
} from '../../application/dtos/TrendingCategoriesDto';
import { PeriodType } from '../../domain/entities/PeriodEntity';
import { AnalyticsDataNotAvailableError } from '../../domain/errors/AnalyticsDataNotAvailableError';

interface UseTrendingCategoriesProps {
  periodType: PeriodType;
  periodValue: number | string;
  organizationId: string;
  limit?: number;
}

interface UseTrendingCategoriesResult {
  data: TrendingCategoriesOutputDto | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const useTrendingCategories = ({
  periodType,
  periodValue,
  organizationId,
  limit = 5,
}: UseTrendingCategoriesProps): UseTrendingCategoriesResult => {
  const [data, setData] = useState<TrendingCategoriesOutputDto | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Create infrastructure and application dependencies
      const apiClient = new AnalyticsApiClient();
      const repository = new AnalyticsRepositoryImpl(apiClient);
      const useCase = new GetTrendingCategoriesUseCase(repository);

      // Create input DTO
      const inputDto: TrendingCategoriesInputDto = {
        periodType,
        periodValue,
        organizationId,
        limit,
      };

      // Execute use case
      const result = await useCase.execute(inputDto);
      setData(result);
    } catch (error: unknown) {
      if (error instanceof AnalyticsDataNotAvailableError) {
        setError(error);
      } else if (error instanceof Error) {
        setError(error);
      } else {
        setError(new Error('An unknown error occurred'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [periodType, periodValue, organizationId, limit]);

  const refetch = async () => {
    await fetchData();
  };

  return { data, isLoading, error, refetch };
};
