import { AnalyticsFilter, TopRecognizedFilter } from '../../domain/interfaces/AnalyticsRepository';
import { TopRecognizedInputDto } from '../dtos/TopRecognizedDto';
import { TrendingCategoriesInputDto } from '../dtos/TrendingCategoriesDto';
import { TrendingKeywordsInputDto } from '../dtos/TrendingKeywordsDto';

export class AnalyticsFilterMapper {
  static toTopRecognizedFilter(dto: TopRecognizedInputDto): TopRecognizedFilter {
    return {
      periodType: dto.periodType,
      periodValue: dto.periodValue,
      organizationId: dto.organizationId,
      type: dto.type,
      limit: dto.limit || 10,
    };
  }

  static toAnalyticsFilter(
    dto: TrendingCategoriesInputDto | TrendingKeywordsInputDto
  ): AnalyticsFilter {
    return {
      periodType: dto.periodType,
      periodValue: dto.periodValue,
      organizationId: dto.organizationId,
      limit: dto.limit || 10,
    };
  }

  static toApiParams(filter: TopRecognizedFilter | AnalyticsFilter): Record<string, string> {
    const params: Record<string, string> = {
      period_type: filter.periodType,
      period_value: filter.periodValue.toString(),
      organization_id: filter.organizationId,
      limit: (filter.limit || 10).toString(),
    };

    if ('type' in filter) {
      params.type = filter.type;
    }

    return params;
  }
}
