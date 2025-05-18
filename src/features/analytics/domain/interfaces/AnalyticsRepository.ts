import { AnalyticsEntity } from '../entities/AnalyticsEntity';
import { KeywordEntity } from '../entities/KeywordEntity';
import { PeriodEntity, PeriodType } from '../entities/PeriodEntity';

export type EntityType = 'individuals' | 'teams';

export interface AnalyticsFilter {
  periodType: PeriodType;
  periodValue: number | string;
  organizationId: string;
  limit?: number;
}

export interface TopRecognizedFilter extends AnalyticsFilter {
  type: EntityType;
}

export interface AnalyticsResult<T> {
  period: PeriodEntity;
  data: T[];
  totalKudos: number;
}

export interface AnalyticsRepository {
  getTopRecognized(filter: TopRecognizedFilter): Promise<AnalyticsResult<AnalyticsEntity>>;
  getTrendingCategories(filter: AnalyticsFilter): Promise<AnalyticsResult<AnalyticsEntity>>;
  getTrendingKeywords(filter: AnalyticsFilter): Promise<AnalyticsResult<KeywordEntity>>;
}
