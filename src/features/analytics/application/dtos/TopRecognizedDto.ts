import { PeriodType } from '../../domain/entities/PeriodEntity';
import { EntityType } from '../../domain/interfaces/AnalyticsRepository';

export interface TopRecognizedItemDto {
  id: string;
  name: string;
  count: number;
  percentage: number;
}

export interface TopRecognizedOutputDto {
  success: boolean;
  period: {
    type: PeriodType;
    value: number | string;
    startDate: string;
    endDate: string;
  };
  data: TopRecognizedItemDto[];
  totalKudos: number;
}

export interface TopRecognizedInputDto {
  periodType: PeriodType;
  periodValue: number | string;
  organizationId: string;
  type: EntityType;
  limit?: number;
}
