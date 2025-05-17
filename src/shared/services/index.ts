// Re-export storage service
export { localStorageService, LocalStorageService } from './storage/LocalStorageService';
export type { IStorageService } from './storage/interfaces/IStorageService';

// Re-export HTTP service
export { httpService, HttpService } from './http/HttpService';
export { HttpError } from './http/HttpError';
export type { IHttpService, IHttpOptions } from './http/interfaces/IHttpService';
export type { IHttpResponse } from './http/interfaces/IHttpResponse';
