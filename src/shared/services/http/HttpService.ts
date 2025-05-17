import { IHttpService, IHttpOptions } from './interfaces/IHttpService';
import { IHttpResponse } from './interfaces/IHttpResponse';
import { HttpError } from './HttpError';
import config from '@/lib/config';

type InterceptorFunction = (error: any) => Promise<any>;

export class HttpService implements IHttpService {
  private baseUrl: string = '';
  private defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  private interceptors: Map<number, InterceptorFunction> = new Map();
  private interceptorId: number = 0;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl || config.api.baseUrl;
  }

  /**
   * Set the base URL for all requests
   */
  setBaseUrl(url: string): void {
    this.baseUrl = url;
  }

  /**
   * Set default headers for all requests
   */
  setDefaultHeaders(headers: Record<string, string>): void {
    this.defaultHeaders = { ...this.defaultHeaders, ...headers };
  }

  /**
   * Add auth header for authenticated requests
   */
  setAuthToken(token: string): void {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  /**
   * Remove auth header when logging out
   */
  clearAuthToken(): void {
    delete this.defaultHeaders['Authorization'];
  }

  /**
   * Setup response error interceptors
   * @returns interceptor id that can be used to remove the interceptor
   */
  setupInterceptors(onResponseError: InterceptorFunction): number {
    const id = this.interceptorId++;
    this.interceptors.set(id, onResponseError);
    return id;
  }

  /**
   * Remove an interceptor by id
   */
  removeInterceptor(id: number): void {
    this.interceptors.delete(id);
  }

  /**
   * Get default request options that should be applied to all requests
   */
  private getDefaultOptions(): IHttpOptions {
    return {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }

  /**
   * Perform a GET request
   */
  async get<T = any>(url: string, options?: IHttpOptions): Promise<IHttpResponse<T>> {
    return this.request<T>({
      method: 'GET',
      url,
      ...this.getDefaultOptions(),
      ...options,
    });
  }

  /**
   * Perform a POST request
   */
  async post<T = any, D = any>(
    url: string,
    data: D,
    options?: IHttpOptions
  ): Promise<IHttpResponse<T>> {
    return this.request<T>({
      method: 'POST',
      url,
      data,
      ...this.getDefaultOptions(),
      ...options,
    });
  }

  /**
   * Perform a PUT request
   */
  async put<T = any, D = any>(
    url: string,
    data: D,
    options?: IHttpOptions
  ): Promise<IHttpResponse<T>> {
    return this.request<T>({
      method: 'PUT',
      url,
      data,
      ...this.getDefaultOptions(),
      ...options,
    });
  }

  /**
   * Perform a PATCH request
   */
  async patch<T = any, D = any>(
    url: string,
    data: D,
    options?: IHttpOptions
  ): Promise<IHttpResponse<T>> {
    return this.request<T>({
      method: 'PATCH',
      url,
      data,
      ...this.getDefaultOptions(),
      ...options,
    });
  }

  /**
   * Perform a DELETE request
   */
  async delete<T = any>(url: string, options?: IHttpOptions): Promise<IHttpResponse<T>> {
    return this.request<T>({
      method: 'DELETE',
      url,
      ...this.getDefaultOptions(),
      ...options,
    });
  }

  /**
   * Core request method that all other methods use
   */
  async request<T = any>(config: any): Promise<IHttpResponse<T>> {
    const {
      method = 'GET',
      url,
      data,
      headers = {},
      params,
      timeout,
      withCredentials = true,
    } = config;

    // Build URL with any query parameters
    const fullUrl = this.buildUrl(url, params);

    // Prepare request options
    const requestOptions: RequestInit = {
      method,
      headers: { ...this.defaultHeaders, ...headers },
      credentials: withCredentials ? 'include' : 'same-origin',
    };

    // Add body for non-GET requests
    if (data && ['POST', 'PUT', 'PATCH'].includes(method)) {
      requestOptions.body = JSON.stringify(data);
    }

    try {
      // Handle request timeout if specified
      let response: Response;
      if (timeout) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        requestOptions.signal = controller.signal;

        try {
          response = await fetch(fullUrl, requestOptions);
          clearTimeout(timeoutId);
        } catch (error: any) {
          clearTimeout(timeoutId);
          if (error.name === 'AbortError') {
            throw new Error('Request timeout');
          }
          throw error;
        }
      } else {
        response = await fetch(fullUrl, requestOptions);
      }

      // Get response data based on content type
      const responseData = await this.parseResponseBody(response);

      // Create formatted response object
      const formattedResponse = this.formatResponse<T>(response, responseData);

      // Handle non-success responses
      if (!response.ok) {
        const error = new HttpError(
          response.status,
          response.statusText || 'Unknown error',
          fullUrl,
          responseData
        );
        return this.runInterceptors(error, config);
      }

      return formattedResponse;
    } catch (error) {
      // Handle network or other errors
      const httpError = new HttpError(
        0,
        error instanceof Error ? error.message : 'Unknown error',
        fullUrl
      );
      return this.runInterceptors(httpError, config);
    }
  }

  /**
   * Format the response into a consistent structure
   */
  private formatResponse<T>(response: Response, data: any): IHttpResponse<T> {
    const headers: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });

    return {
      data: data as T,
      status: response.status,
      statusText: response.statusText,
      headers,
    };
  }

  /**
   * Run error through registered interceptors
   */
  private async runInterceptors(error: HttpError, originalConfig: any): Promise<any> {
    for (const interceptor of this.interceptors.values()) {
      try {
        return await interceptor(error);
      } catch (interceptorError) {
        // Continue to next interceptor
      }
    }
    throw error;
  }

  /**
   * Build URL with query parameters
   */
  private buildUrl(path: string, params?: Record<string, string | number | boolean>): string {
    // Use absolute URL if provided, otherwise combine with base URL
    const url = path.startsWith('http')
      ? path
      : `${this.baseUrl}${path.startsWith('/') ? path : `/${path}`}`;

    if (!params || Object.keys(params).length === 0) {
      return url;
    }

    // Add query parameters
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, String(value));
    });

    return `${url}${url.includes('?') ? '&' : '?'}${searchParams.toString()}`;
  }

  /**
   * Parse response body based on content type
   */
  private async parseResponseBody(response: Response): Promise<any> {
    const contentType = response.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      return response.json().catch(() => null);
    } else if (contentType.includes('text/')) {
      return response.text();
    } else if (contentType.includes('form')) {
      return response.formData();
    }

    return response.blob();
  }
}

// Create a singleton instance for consistent usage
export const httpService = new HttpService();
