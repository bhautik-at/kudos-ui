import { PeriodType } from '../../domain/entities/PeriodEntity';

export interface TrendingCategoryItemDto {
  id: string;
  name: string;
  count: number;
  percentage: number;
}

export interface TrendingCategoriesOutputDto {
  success: boolean;
  period: {
    type: PeriodType;
    value: number | string;
    startDate: string;
    endDate: string;
  };
  data: TrendingCategoryItemDto[];
  totalKudos: number;
}

export interface TrendingCategoriesInputDto {
  periodType: PeriodType;
  periodValue: number | string;
  organizationId: string;
  limit?: number;
}
