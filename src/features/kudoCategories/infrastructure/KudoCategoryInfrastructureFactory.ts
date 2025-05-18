import { HttpService } from '@/shared/services/http/HttpService';
import { KudoCategoryRepository } from './repositories/KudoCategoryRepository';
import { KudoCategoryValidator } from './repositories/KudoCategoryValidator';
import { KudoCategoryApiClient } from './api/KudoCategoryApiClient';

/**
 * Factory class for creating infrastructure components for the Kudo Categories feature
 */
export class KudoCategoryInfrastructureFactory {
  /**
   * Create a new instance of the KudoCategoryRepository
   */
  static createRepository(httpService: HttpService): KudoCategoryRepository {
    const apiClient = new KudoCategoryApiClient(httpService);
    return new KudoCategoryRepository(apiClient);
  }

  /**
   * Create a new instance of the KudoCategoryValidator
   */
  static createValidator(httpService: HttpService): KudoCategoryValidator {
    const apiClient = new KudoCategoryApiClient(httpService);
    return new KudoCategoryValidator(apiClient);
  }

  /**
   * Create a new instance of the KudoCategoryApiClient
   */
  static createApiClient(httpService: HttpService): KudoCategoryApiClient {
    return new KudoCategoryApiClient(httpService);
  }
}
