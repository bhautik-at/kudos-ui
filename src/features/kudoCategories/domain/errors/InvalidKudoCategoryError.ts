export class InvalidKudoCategoryError extends Error {
  constructor(message: string = 'Invalid kudo category data') {
    super(message);
    this.name = 'InvalidKudoCategoryError';
  }
}
