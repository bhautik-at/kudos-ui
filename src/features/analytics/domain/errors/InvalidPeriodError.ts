export class InvalidPeriodError extends Error {
  constructor(message: string = 'Invalid period specified for analytics') {
    super(message);
    this.name = 'InvalidPeriodError';
  }
}
