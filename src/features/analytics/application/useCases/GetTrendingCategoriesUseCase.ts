import { AnalyticsRepository } from '../../domain/interfaces/AnalyticsRepository';
import { AnalyticsDataNotAvailableError } from '../../domain/errors/AnalyticsDataNotAvailableError';
import {
  TrendingCategoriesInputDto,
  TrendingCategoriesOutputDto,
} from '../dtos/TrendingCategoriesDto';
import { AnalyticsFilterMapper } from '../mappers/AnalyticsFilterMapper';
import { AnalyticsMapper } from '../mappers/AnalyticsMapper';

export class GetTrendingCategoriesUseCase {
  constructor(private analyticsRepository: AnalyticsRepository) {}

  async execute(inputDto: TrendingCategoriesInputDto): Promise<TrendingCategoriesOutputDto> {
    try {
      // Convert DTO to domain filter
      const filter = AnalyticsFilterMapper.toAnalyticsFilter(inputDto);

      // Call repository
      const result = await this.analyticsRepository.getTrendingCategories(filter);

      if (!result.data.length) {
        throw new AnalyticsDataNotAvailableError(
          `No category data available for ${inputDto.periodType} ${inputDto.periodValue}`
        );
      }

      // Map result to output DTO
      return AnalyticsMapper.toTrendingCategoriesDto(result);
    } catch (error: unknown) {
      if (error instanceof AnalyticsDataNotAvailableError) {
        throw error;
      }

      // Wrap unexpected errors
      throw new Error(
        `Failed to get trending categories: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
}
