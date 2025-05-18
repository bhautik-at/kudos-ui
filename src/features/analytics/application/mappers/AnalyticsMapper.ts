import { AnalyticsEntity } from '../../domain/entities/AnalyticsEntity';
import { KeywordEntity } from '../../domain/entities/KeywordEntity';
import { PeriodEntity } from '../../domain/entities/PeriodEntity';
import { AnalyticsResult } from '../../domain/interfaces/AnalyticsRepository';
import { TopRecognizedItemDto, TopRecognizedOutputDto } from '../dtos/TopRecognizedDto';
import {
  TrendingCategoryItemDto,
  TrendingCategoriesOutputDto,
} from '../dtos/TrendingCategoriesDto';
import { TrendingKeywordItemDto, TrendingKeywordsOutputDto } from '../dtos/TrendingKeywordsDto';

export class AnalyticsMapper {
  static toAnalyticsEntity(item: TopRecognizedItemDto | TrendingCategoryItemDto): AnalyticsEntity {
    return new AnalyticsEntity({
      id: item.id,
      name: item.name,
      count: item.count,
      percentage: item.percentage,
    });
  }

  static toAnalyticsEntityList(
    items: (TopRecognizedItemDto | TrendingCategoryItemDto)[]
  ): AnalyticsEntity[] {
    return items.map(item => this.toAnalyticsEntity(item));
  }

  static toKeywordEntity(item: TrendingKeywordItemDto): KeywordEntity {
    return new KeywordEntity({
      keyword: item.keyword,
      count: item.count,
      percentage: item.percentage,
    });
  }

  static toKeywordEntityList(items: TrendingKeywordItemDto[]): KeywordEntity[] {
    return items.map(item => this.toKeywordEntity(item));
  }

  static toPeriodEntity(period: {
    type: string;
    value: number | string;
    start_date: string;
    end_date: string;
  }): PeriodEntity {
    return new PeriodEntity({
      type: period.type as any,
      value: period.value,
      startDate: new Date(period.start_date),
      endDate: new Date(period.end_date),
    });
  }

  static toTopRecognizedDto(result: AnalyticsResult<AnalyticsEntity>): TopRecognizedOutputDto {
    return {
      success: true,
      period: {
        type: result.period.type,
        value: result.period.value,
        startDate: result.period.startDate.toISOString(),
        endDate: result.period.endDate.toISOString(),
      },
      data: result.data.map(entity => ({
        id: entity.id || '',
        name: entity.name,
        count: entity.count,
        percentage: entity.percentage,
      })),
      totalKudos: result.totalKudos,
    };
  }

  static toTrendingCategoriesDto(
    result: AnalyticsResult<AnalyticsEntity>
  ): TrendingCategoriesOutputDto {
    return {
      success: true,
      period: {
        type: result.period.type,
        value: result.period.value,
        startDate: result.period.startDate.toISOString(),
        endDate: result.period.endDate.toISOString(),
      },
      data: result.data.map(entity => ({
        id: entity.id || '',
        name: entity.name,
        count: entity.count,
        percentage: entity.percentage,
      })),
      totalKudos: result.totalKudos,
    };
  }

  static toTrendingKeywordsDto(result: AnalyticsResult<KeywordEntity>): TrendingKeywordsOutputDto {
    return {
      success: true,
      period: {
        type: result.period.type,
        value: result.period.value,
        startDate: result.period.startDate.toISOString(),
        endDate: result.period.endDate.toISOString(),
      },
      data: result.data.map(entity => ({
        keyword: entity.keyword,
        count: entity.count,
        percentage: entity.percentage,
      })),
      totalAnalyzedKudos: result.totalKudos,
    };
  }
}
