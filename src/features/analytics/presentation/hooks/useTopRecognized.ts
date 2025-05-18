import { useState, useEffect } from 'react';
import { AnalyticsApiClient } from '../../infrastructure/api/AnalyticsApiClient';
import { AnalyticsRepositoryImpl } from '../../infrastructure/repositories/AnalyticsRepositoryImpl';
import { GetTopRecognizedUseCase } from '../../application/useCases/GetTopRecognizedUseCase';
import {
  TopRecognizedInputDto,
  TopRecognizedOutputDto,
} from '../../application/dtos/TopRecognizedDto';
import { EntityType } from '../../domain/interfaces/AnalyticsRepository';
import { PeriodType } from '../../domain/entities/PeriodEntity';
import { AnalyticsDataNotAvailableError } from '../../domain/errors/AnalyticsDataNotAvailableError';

interface UseTopRecognizedProps {
  periodType: PeriodType;
  periodValue: number | string;
  organizationId: string;
  type: EntityType;
  limit?: number;
}

interface UseTopRecognizedResult {
  data: TopRecognizedOutputDto | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const useTopRecognized = ({
  periodType,
  periodValue,
  organizationId,
  type,
  limit = 10,
}: UseTopRecognizedProps): UseTopRecognizedResult => {
  const [data, setData] = useState<TopRecognizedOutputDto | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Create infrastructure and application dependencies
      const apiClient = new AnalyticsApiClient();
      const repository = new AnalyticsRepositoryImpl(apiClient);
      const useCase = new GetTopRecognizedUseCase(repository);

      // Create input DTO
      const inputDto: TopRecognizedInputDto = {
        periodType,
        periodValue,
        organizationId,
        type,
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
  }, [periodType, periodValue, organizationId, type, limit]);

  const refetch = async () => {
    await fetchData();
  };

  return { data, isLoading, error, refetch };
};
