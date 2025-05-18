import { AnalyticsRepository } from '../../domain/interfaces/AnalyticsRepository';
import { AnalyticsDataNotAvailableError } from '../../domain/errors/AnalyticsDataNotAvailableError';
import { TopRecognizedInputDto, TopRecognizedOutputDto } from '../dtos/TopRecognizedDto';
import { AnalyticsFilterMapper } from '../mappers/AnalyticsFilterMapper';
import { AnalyticsMapper } from '../mappers/AnalyticsMapper';

export class GetTopRecognizedUseCase {
  constructor(private analyticsRepository: AnalyticsRepository) {}

  async execute(inputDto: TopRecognizedInputDto): Promise<TopRecognizedOutputDto> {
    try {
      // Convert DTO to domain filter
      const filter = AnalyticsFilterMapper.toTopRecognizedFilter(inputDto);

      // Call repository
      const result = await this.analyticsRepository.getTopRecognized(filter);

      if (!result.data.length) {
        throw new AnalyticsDataNotAvailableError(
          `No data available for ${inputDto.periodType} ${inputDto.periodValue}`
        );
      }

      // Map result to output DTO
      return AnalyticsMapper.toTopRecognizedDto(result);
    } catch (error: unknown) {
      if (error instanceof AnalyticsDataNotAvailableError) {
        throw error;
      }

      // Wrap unexpected errors
      throw new Error(
        `Failed to get top recognized: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
}
