export class UnauthorizedKudoCategoryAccessError extends Error {
  constructor(organizationId?: string) {
    super(
      organizationId
        ? `Unauthorized access to kudo categories for organization ${organizationId}`
        : 'Unauthorized access to kudo categories'
    );
    this.name = 'UnauthorizedKudoCategoryAccessError';
  }
}
