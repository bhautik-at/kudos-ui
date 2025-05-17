export class ApiError extends Error {
  status: number;
  data?: any;

  constructor(message: string, status: number = 500, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;

    // This is needed for proper instanceof checks in TypeScript
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}
