import { PeriodType } from '../../domain/entities/PeriodEntity';

export interface TrendingKeywordItemDto {
  keyword: string;
  count: number;
  percentage: number;
}

export interface TrendingKeywordsOutputDto {
  success: boolean;
  period: {
    type: PeriodType;
    value: number | string;
    startDate: string;
    endDate: string;
  };
  data: TrendingKeywordItemDto[];
  totalAnalyzedKudos: number;
}

export interface TrendingKeywordsInputDto {
  periodType: PeriodType;
  periodValue: number | string;
  organizationId: string;
  limit?: number;
}
