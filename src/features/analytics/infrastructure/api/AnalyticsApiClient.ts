import { httpService } from '@/shared/services/http/HttpService';
import { PeriodType } from '../../domain/entities/PeriodEntity';
import { EntityType } from '../../domain/interfaces/AnalyticsRepository';

interface PeriodData {
  type: PeriodType;
  value: number | string;
  start_date: string;
  end_date: string;
}

interface AnalyticsItemData {
  id: string;
  name: string;
  count: number;
  percentage: number;
}

interface KeywordItemData {
  keyword: string;
  count: number;
  percentage: number;
}

interface TopRecognizedApiResponse {
  success: boolean;
  period: PeriodData;
  data: AnalyticsItemData[];
  total_kudos: number;
}

interface TrendingCategoriesApiResponse {
  success: boolean;
  period: PeriodData;
  data: AnalyticsItemData[];
  total_kudos: number;
}

interface TrendingKeywordsApiResponse {
  success: boolean;
  period: PeriodData;
  data: KeywordItemData[];
  total_analyzed_kudos: number;
}

export class AnalyticsApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  async getTopRecognized(params: {
    period_type: PeriodType;
    period_value: string;
    organization_id: string;
    type: EntityType;
    limit?: string;
  }): Promise<TopRecognizedApiResponse> {
    try {
      const response = await httpService.get<TopRecognizedApiResponse>(
        `${this.baseUrl}/analytics/top-recognized`,
        { params }
      );

      return response.data;
    } catch (error: unknown) {
      this.handleApiError(error, 'Failed to fetch top recognized data');
      throw error; // This line won't be reached due to handleApiError throwing, but TS needs it
    }
  }

  async getTrendingCategories(params: {
    period_type: PeriodType;
    period_value: string;
    organization_id: string;
    limit?: string;
  }): Promise<TrendingCategoriesApiResponse> {
    try {
      const response = await httpService.get<TrendingCategoriesApiResponse>(
        `${this.baseUrl}/analytics/trending-categories`,
        { params }
      );

      return response.data;
    } catch (error: unknown) {
      this.handleApiError(error, 'Failed to fetch trending categories data');
      throw error;
    }
  }

  async getTrendingKeywords(params: {
    period_type: PeriodType;
    period_value: string;
    organization_id: string;
    limit?: string;
  }): Promise<TrendingKeywordsApiResponse> {
    try {
      console.log('API client sending getTrendingKeywords request with params:', params);

      const response = await httpService.get<TrendingKeywordsApiResponse>(
        `${this.baseUrl}/analytics/trending-keywords`,
        { params }
      );

      console.log('API client received getTrendingKeywords response:', response);
      return response.data;
    } catch (error: unknown) {
      console.error('API client getTrendingKeywords error:', error);
      this.handleApiError(error, 'Failed to fetch trending keywords data');
      throw error;
    }
  }

  private handleApiError(error: unknown, defaultMessage: string): never {
    // If it's a known API error format
    if (error && typeof error === 'object' && 'response' in error) {
      const responseError = error.response as any;
      if (responseError?.data?.message) {
        throw new Error(responseError.data.message);
      }
      if (responseError?.status) {
        throw new Error(`${defaultMessage} (${responseError.status})`);
      }
    }

    // Otherwise use a generic error
    if (error instanceof Error) {
      throw new Error(`${defaultMessage}: ${error.message}`);
    }

    throw new Error(defaultMessage);
  }
}
