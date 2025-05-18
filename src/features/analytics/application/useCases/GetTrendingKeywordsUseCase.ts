import { AnalyticsRepository } from '../../domain/interfaces/AnalyticsRepository';
import { AnalyticsDataNotAvailableError } from '../../domain/errors/AnalyticsDataNotAvailableError';
import { TrendingKeywordsInputDto, TrendingKeywordsOutputDto } from '../dtos/TrendingKeywordsDto';
import { AnalyticsFilterMapper } from '../mappers/AnalyticsFilterMapper';
import { AnalyticsMapper } from '../mappers/AnalyticsMapper';

export class GetTrendingKeywordsUseCase {
  constructor(private analyticsRepository: AnalyticsRepository) {}

  async execute(inputDto: TrendingKeywordsInputDto): Promise<TrendingKeywordsOutputDto> {
    try {
      // Convert DTO to domain filter
      const filter = AnalyticsFilterMapper.toAnalyticsFilter(inputDto);

      // Call repository
      const result = await this.analyticsRepository.getTrendingKeywords(filter);

      if (!result.data.length) {
        throw new AnalyticsDataNotAvailableError(
          `No keyword data available for ${inputDto.periodType} ${inputDto.periodValue}`
        );
      }

      // Map result to output DTO
      return AnalyticsMapper.toTrendingKeywordsDto(result);
    } catch (error: unknown) {
      if (error instanceof AnalyticsDataNotAvailableError) {
        throw error;
      }

      // Wrap unexpected errors
      throw new Error(
        `Failed to get trending keywords: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
}
