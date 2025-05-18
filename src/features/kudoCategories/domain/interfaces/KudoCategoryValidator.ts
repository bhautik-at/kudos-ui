export interface KudoCategoryValidator {
  isCategoryNameUnique(
    name: string,
    organizationId: string,
    excludeCategoryId?: string
  ): Promise<boolean>;
}
