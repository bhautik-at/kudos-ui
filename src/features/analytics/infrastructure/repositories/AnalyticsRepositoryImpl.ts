import { AnalyticsApiClient } from '../api/AnalyticsApiClient';
import { AnalyticsEntity } from '../../domain/entities/AnalyticsEntity';
import { KeywordEntity } from '../../domain/entities/KeywordEntity';
import { PeriodEntity, PeriodType } from '../../domain/entities/PeriodEntity';
import {
  AnalyticsRepository,
  AnalyticsFilter,
  AnalyticsResult,
  TopRecognizedFilter,
  EntityType,
} from '../../domain/interfaces/AnalyticsRepository';
import { AnalyticsDataNotAvailableError } from '../../domain/errors/AnalyticsDataNotAvailableError';
import { AnalyticsFilterMapper } from '../../application/mappers/AnalyticsFilterMapper';

export class AnalyticsRepositoryImpl implements AnalyticsRepository {
  constructor(private apiClient: AnalyticsApiClient) {}

  async getTopRecognized(filter: TopRecognizedFilter): Promise<AnalyticsResult<AnalyticsEntity>> {
    try {
      const apiParams = {
        period_type: filter.periodType,
        period_value: filter.periodValue.toString(),
        organization_id: filter.organizationId,
        type: filter.type,
        limit: filter.limit?.toString(),
      };

      const response = await this.apiClient.getTopRecognized(apiParams);

      if (!response.success) {
        throw new Error('API returned unsuccessful response');
      }

      const periodEntity = new PeriodEntity({
        type: response.period.type,
        value: response.period.value,
        startDate: new Date(response.period.start_date),
        endDate: new Date(response.period.end_date),
      });

      const analyticsEntities = response.data.map(
        item =>
          new AnalyticsEntity({
            id: item.id,
            name: item.name,
            count: item.count,
            percentage: item.percentage,
          })
      );

      return {
        period: periodEntity,
        data: analyticsEntities,
        totalKudos: response.total_kudos,
      };
    } catch (error: unknown) {
      this.handleRepositoryError(error, 'Failed to get top recognized');
      throw error; // TS needs this even though handleRepositoryError will throw
    }
  }

  async getTrendingCategories(filter: AnalyticsFilter): Promise<AnalyticsResult<AnalyticsEntity>> {
    try {
      const apiParams = {
        period_type: filter.periodType,
        period_value: filter.periodValue.toString(),
        organization_id: filter.organizationId,
        limit: filter.limit?.toString(),
      };

      const response = await this.apiClient.getTrendingCategories(apiParams);

      if (!response.success) {
        throw new Error('API returned unsuccessful response');
      }

      const periodEntity = new PeriodEntity({
        type: response.period.type,
        value: response.period.value,
        startDate: new Date(response.period.start_date),
        endDate: new Date(response.period.end_date),
      });

      const analyticsEntities = response.data.map(
        item =>
          new AnalyticsEntity({
            id: item.id,
            name: item.name,
            count: item.count,
            percentage: item.percentage,
          })
      );

      return {
        period: periodEntity,
        data: analyticsEntities,
        totalKudos: response.total_kudos,
      };
    } catch (error: unknown) {
      this.handleRepositoryError(error, 'Failed to get trending categories');
      throw error;
    }
  }

  async getTrendingKeywords(filter: AnalyticsFilter): Promise<AnalyticsResult<KeywordEntity>> {
    try {
      const apiParams = {
        period_type: filter.periodType,
        period_value: filter.periodValue.toString(),
        organization_id: filter.organizationId,
        limit: filter.limit?.toString(),
      };

      console.log('Trending keywords repository sending request with params:', apiParams);

      const response = await this.apiClient.getTrendingKeywords(apiParams);
      console.log('Trending keywords repository received response:', response);

      if (!response.success) {
        throw new Error('API returned unsuccessful response');
      }

      const periodEntity = new PeriodEntity({
        type: response.period.type,
        value: response.period.value,
        startDate: new Date(response.period.start_date),
        endDate: new Date(response.period.end_date),
      });

      const keywordEntities = response.data.map(
        item =>
          new KeywordEntity({
            keyword: item.keyword,
            count: item.count,
            percentage: item.percentage,
          })
      );

      const result = {
        period: periodEntity,
        data: keywordEntities,
        totalKudos: response.total_analyzed_kudos,
      };

      console.log('Trending keywords repository returned entities:', result);
      return result;
    } catch (error: unknown) {
      console.error('Trending keywords repository error:', error);
      this.handleRepositoryError(error, 'Failed to get trending keywords');
      throw error;
    }
  }

  private handleRepositoryError(error: unknown, defaultMessage: string): never {
    // Check if it's a domain error that should be passed through
    if (error instanceof AnalyticsDataNotAvailableError) {
      throw error;
    }

    // Otherwise create a new error with context
    if (error instanceof Error) {
      throw new Error(`${defaultMessage}: ${error.message}`);
    }

    throw new Error(`${defaultMessage}: Unknown error`);
  }
}
