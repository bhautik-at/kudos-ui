export class HttpError extends Error {
  public readonly status: number;
  public readonly statusText: string;
  public readonly data: any;
  public readonly url: string;

  constructor(status: number, statusText: string, url: string, data?: any) {
    super(statusText);
    this.name = 'HttpError';
    this.status = status;
    this.statusText = statusText;
    this.url = url;
    this.data = data;
  }

  // Helper methods for error categorization
  isClientError(): boolean {
    return this.status >= 400 && this.status < 500;
  }

  isServerError(): boolean {
    return this.status >= 500;
  }

  isUnauthorized(): boolean {
    return this.status === 401;
  }

  isForbidden(): boolean {
    return this.status === 403;
  }

  isNotFound(): boolean {
    return this.status === 404;
  }
}
