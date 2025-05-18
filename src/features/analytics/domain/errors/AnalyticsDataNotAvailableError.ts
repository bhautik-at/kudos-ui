export class AnalyticsDataNotAvailableError extends Error {
  constructor(message: string = 'Analytics data is not available for the requested period') {
    super(message);
    this.name = 'AnalyticsDataNotAvailableError';
  }
}
