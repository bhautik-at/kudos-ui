import { LocalStorageService } from './LocalStorageService';

// We need to mock the localStorage for the tests
const mockLocalStorage = () => {
  const store: Record<string, string> = {};

  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      Object.keys(store).forEach(key => {
        delete store[key];
      });
    }),
    key: jest.fn((index: number) => {
      return Object.keys(store)[index] || null;
    }),
    length: Object.keys(store).length,
  };
};

describe('LocalStorageService', () => {
  let storageService: LocalStorageService;
  let mockStorage: ReturnType<typeof mockLocalStorage>;

  beforeEach(() => {
    mockStorage = mockLocalStorage();

    // Mock window.localStorage
    Object.defineProperty(window, 'localStorage', {
      value: mockStorage,
      writable: true,
    });

    storageService = new LocalStorageService('test_');
  });

  it('should store and retrieve items correctly', () => {
    const testObj = { name: 'Test', value: 123 };

    // Set the value
    storageService.set('testKey', testObj);

    // Verify localStorage was called with correct params
    expect(mockStorage.setItem).toHaveBeenCalledWith('test_testKey', JSON.stringify(testObj));

    // Mock the value retrieval
    mockStorage.getItem.mockReturnValueOnce(JSON.stringify(testObj));

    // Get the value
    const result = storageService.get<typeof testObj>('testKey');

    // Verify the result
    expect(result).toEqual(testObj);
    expect(mockStorage.getItem).toHaveBeenCalledWith('test_testKey');
  });

  it('should remove items correctly', () => {
    storageService.remove('testKey');
    expect(mockStorage.removeItem).toHaveBeenCalledWith('test_testKey');
  });

  it('should check if item exists correctly', () => {
    // Mock existing key
    mockStorage.getItem.mockImplementation((key: string) => {
      return key === 'test_existingKey' ? 'value' : null;
    });

    expect(storageService.has('existingKey')).toBe(true);
    expect(storageService.has('nonExistingKey')).toBe(false);
  });

  it('should clear only items with the prefix', () => {
    // Setup mock keys
    const mockKeys = ['test_key1', 'otherPrefix_key', 'test_key2'];
    Object.defineProperty(mockStorage, 'length', {
      get: () => mockKeys.length,
    });

    mockStorage.key.mockImplementation((index: number) => {
      return mockKeys[index] || null;
    });

    storageService.clear();

    expect(mockStorage.removeItem).toHaveBeenCalledWith('test_key1');
    expect(mockStorage.removeItem).toHaveBeenCalledWith('test_key2');
    expect(mockStorage.removeItem).not.toHaveBeenCalledWith('otherPrefix_key');
  });
});
