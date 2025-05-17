import { IHttpResponse } from './IHttpResponse';

export interface IHttpOptions {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
  timeout?: number;
  withCredentials?: boolean;
}

export interface IHttpService {
  setBaseUrl(url: string): void;
  setDefaultHeaders(headers: Record<string, string>): void;
  setAuthToken(token: string): void;
  clearAuthToken(): void;
  get<T = any>(url: string, options?: IHttpOptions): Promise<IHttpResponse<T>>;
  post<T = any, D = any>(url: string, data: D, options?: IHttpOptions): Promise<IHttpResponse<T>>;
  put<T = any, D = any>(url: string, data: D, options?: IHttpOptions): Promise<IHttpResponse<T>>;
  patch<T = any, D = any>(url: string, data: D, options?: IHttpOptions): Promise<IHttpResponse<T>>;
  delete<T = any>(url: string, options?: IHttpOptions): Promise<IHttpResponse<T>>;
  request<T = any>(config: any): Promise<IHttpResponse<T>>;
}
