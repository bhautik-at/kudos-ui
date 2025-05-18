export class KudoValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'KudoValidationError';
  }
}
