export class DuplicateKudoCategoryError extends Error {
  constructor(name?: string) {
    super(
      name
        ? `A kudo category with the name '${name}' already exists in this organization`
        : 'A kudo category with this name already exists in this organization'
    );
    this.name = 'DuplicateKudoCategoryError';
  }
}
