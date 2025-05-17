import { HttpService } from './HttpService';
import { HttpError } from './HttpError';

describe('HttpService', () => {
  let httpService: HttpService;
  let originalFetch: typeof global.fetch;

  beforeEach(() => {
    // Save original fetch implementation
    originalFetch = global.fetch;

    // Mock fetch API
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: () => Promise.resolve({}),
        text: () => Promise.resolve(''),
        headers: new Map([['content-type', 'application/json']]),
      })
    );

    // Create new instance with base URL
    httpService = new HttpService('https://api.example.com');
  });

  afterEach(() => {
    // Restore original fetch
    global.fetch = originalFetch;
    jest.clearAllMocks();
  });

  it('should correctly handle successful GET requests', async () => {
    const mockResponse = {
      data: 'test data',
    };

    // Mock successful response
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: () => Promise.resolve(mockResponse),
        headers: new Map([['content-type', 'application/json']]),
      })
    );

    const result = await httpService.get('/users');

    // Check fetch was called with correct parameters
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.example.com/users',
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          Accept: 'application/json',
        }),
      })
    );

    // Check response is correctly processed
    expect(result.data).toEqual(mockResponse);
    expect(result.status).toBe(200);
  });

  it('should correctly handle failed requests', async () => {
    const errorData = { message: 'Resource not found' };

    // Mock failed response
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: () => Promise.resolve(errorData),
        headers: new Map([['content-type', 'application/json']]),
      })
    );

    // It should throw HttpError
    await expect(httpService.get('/users/999')).rejects.toThrow(HttpError);

    try {
      await httpService.get('/users/999');
    } catch (error) {
      expect(error).toBeInstanceOf(HttpError);
      if (error instanceof HttpError) {
        expect(error.status).toBe(404);
        expect(error.data).toEqual(errorData);
        expect(error.url).toBe('https://api.example.com/users/999');
      }
    }
  });

  it('should correctly handle POST requests with data', async () => {
    const mockResponse = { id: 123 };

    // Mock successful POST response
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        status: 201,
        statusText: 'Created',
        json: () => Promise.resolve(mockResponse),
        headers: new Map([['content-type', 'application/json']]),
      })
    );

    const postData = { name: 'Test User', email: 'test@example.com' };
    const result = await httpService.post('/users', postData);

    // Check fetch was called with correct parameters including body data
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.example.com/users',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(postData),
      })
    );

    // Check response is correctly processed
    expect(result.status).toBe(201);
    expect(result.data).toEqual(mockResponse);
  });

  it('should handle query parameters correctly', async () => {
    await httpService.get('/users', {
      params: { role: 'admin', active: true },
    });

    // Check that URL contains query parameters
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringMatching(/^https:\/\/api\.example\.com\/users\?role=admin&active=true$/),
      expect.anything()
    );
  });

  it('should apply auth token correctly', async () => {
    // Set auth token
    httpService.setAuthToken('test-token');

    await httpService.get('/protected-resource');

    // Verify Authorization header was set
    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer test-token',
        }),
      })
    );

    // Clear token and make another request
    httpService.clearAuthToken();
    jest.clearAllMocks();

    await httpService.get('/public-resource');

    // Check Authorization header is not present
    const lastCallArgs = (global.fetch as jest.Mock).mock.calls[0];
    const options = lastCallArgs[1];
    expect((options.headers as Record<string, string>).Authorization).toBeUndefined();
  });

  it('should call interceptors on error responses', async () => {
    // Mock error response
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        json: () => Promise.resolve({ message: 'Unauthorized' }),
        headers: new Map([['content-type', 'application/json']]),
      })
    );

    // Setup interceptor
    const mockInterceptor = jest.fn().mockImplementation(error => {
      if (error.status === 401) {
        return Promise.resolve({ data: 'Intercepted', status: 200, statusText: 'OK', headers: {} });
      }
      return Promise.reject(error);
    });

    const interceptorId = httpService.setupInterceptors(mockInterceptor);

    // Make request that will trigger interceptor
    const result = await httpService.get('/secure-resource');

    // Verify interceptor was called
    expect(mockInterceptor).toHaveBeenCalled();
    expect(result.data).toBe('Intercepted');

    // Remove interceptor
    httpService.removeInterceptor(interceptorId);

    // Mock another error response
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        json: () => Promise.resolve({ message: 'Unauthorized' }),
        headers: new Map([['content-type', 'application/json']]),
      })
    );

    // Now it should throw since interceptor was removed
    await expect(httpService.get('/secure-resource')).rejects.toThrow(HttpError);
  });
});
