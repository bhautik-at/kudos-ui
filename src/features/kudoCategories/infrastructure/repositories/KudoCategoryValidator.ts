import { KudoCategoryValidator as IKudoCategoryValidator } from '../../domain/interfaces/KudoCategoryValidator';
import { KudoCategoryApiClient, KudoCategoryResponse } from '../api/KudoCategoryApiClient';

export class KudoCategoryValidator implements IKudoCategoryValidator {
  constructor(private apiClient: KudoCategoryApiClient) {}

  async isCategoryNameUnique(
    name: string,
    organizationId: string,
    excludeCategoryId?: string
  ): Promise<boolean> {
    try {
      // Fetch all categories for the organization
      const response = await this.apiClient.getAllKudoCategories(organizationId);

      // Check if any category (except the one being updated) has the same name
      return !response.categories.some(
        (category: KudoCategoryResponse) =>
          category.name.toLowerCase() === name.toLowerCase() && category.id !== excludeCategoryId
      );
    } catch (error) {
      // If we can't validate, it's safer to assume it's not unique
      return false;
    }
  }
}
