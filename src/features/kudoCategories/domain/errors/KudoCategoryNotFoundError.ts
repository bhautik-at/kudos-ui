export class KudoCategoryNotFoundError extends Error {
  constructor(id?: string) {
    super(id ? `Kudo category with ID ${id} not found` : 'Kudo category not found');
    this.name = 'KudoCategoryNotFoundError';
  }
}
