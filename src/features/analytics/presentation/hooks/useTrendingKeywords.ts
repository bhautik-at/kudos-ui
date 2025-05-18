import { useState, useEffect } from 'react';
import { AnalyticsApiClient } from '../../infrastructure/api/AnalyticsApiClient';
import { AnalyticsRepositoryImpl } from '../../infrastructure/repositories/AnalyticsRepositoryImpl';
import { GetTrendingKeywordsUseCase } from '../../application/useCases/GetTrendingKeywordsUseCase';
import {
  TrendingKeywordsInputDto,
  TrendingKeywordsOutputDto,
} from '../../application/dtos/TrendingKeywordsDto';
import { PeriodType } from '../../domain/entities/PeriodEntity';
import { AnalyticsDataNotAvailableError } from '../../domain/errors/AnalyticsDataNotAvailableError';

interface UseTrendingKeywordsProps {
  periodType: PeriodType;
  periodValue: number | string;
  organizationId: string;
  limit?: number;
}

interface UseTrendingKeywordsResult {
  data: TrendingKeywordsOutputDto | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const useTrendingKeywords = ({
  periodType,
  periodValue,
  organizationId,
  limit = 10,
}: UseTrendingKeywordsProps): UseTrendingKeywordsResult => {
  const [data, setData] = useState<TrendingKeywordsOutputDto | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    console.log('Fetching trending keywords with params:', {
      periodType,
      periodValue,
      organizationId,
      limit,
    });

    setIsLoading(true);
    setError(null);

    try {
      // Create infrastructure and application dependencies
      const apiClient = new AnalyticsApiClient();
      const repository = new AnalyticsRepositoryImpl(apiClient);
      const useCase = new GetTrendingKeywordsUseCase(repository);

      // Create input DTO
      const inputDto: TrendingKeywordsInputDto = {
        periodType,
        periodValue,
        organizationId,
        limit,
      };

      console.log('Calling trending keywords use case with:', inputDto);

      // Execute use case
      const result = await useCase.execute(inputDto);
      console.log('Trending keywords result:', result);
      setData(result);
    } catch (error: unknown) {
      console.error('Error fetching trending keywords:', error);
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
    console.log('useTrendingKeywords effect triggered with:', {
      periodType,
      periodValue,
      organizationId,
    });
    fetchData();
  }, [periodType, periodValue, organizationId, limit]);

  const refetch = async () => {
    await fetchData();
  };

  return { data, isLoading, error, refetch };
};
