import { AICategoryService, KudoCategory } from './aiCategoryService';

// Create a manual mock for the service without relying on OpenAI
class MockAICategoryService extends AICategoryService {
  private mockResponse: KudoCategory = 'Team Player';
  private shouldThrowError: boolean = false;
  
  constructor() {
    // Call parent with dummy key
    super('test-api-key');
    
    // Override the OpenAI instance
    (this as any).openai = null;
  }
  
  setMockResponse(category: KudoCategory) {
    this.mockResponse = category;
  }
  
  setShouldThrowError(shouldThrow: boolean) {
    this.shouldThrowError = shouldThrow;
  }
  
  async suggestCategory(message: string): Promise<KudoCategory> {
    if (this.shouldThrowError) {
      throw new Error('Simulated API error');
    }
    return this.mockResponse;
  }
  
  // Use the parent's implementation for getAllCategories
}

describe('AICategoryService', () => {
  let mockService: MockAICategoryService;
  let consoleErrorSpy: jest.SpyInstance;
  
  beforeEach(() => {
    mockService = new MockAICategoryService();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
  });
  
  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });
  
  describe('suggestCategory', () => {
    it('should return the suggested category for a message', async () => {
      // Arrange
      const message = 'Thanks for helping me solve that complex bug!';
      const expectedCategory: KudoCategory = 'Problem Solving';
      mockService.setMockResponse(expectedCategory);
      
      // Act
      const result = await mockService.suggestCategory(message);
      
      // Assert
      expect(result).toBe(expectedCategory);
    });
    
    it('should handle errors gracefully', async () => {
      // Arrange
      const message = 'Thanks for your help!';
      mockService.setShouldThrowError(true);
      
      // Act
      const result = await AICategoryService.prototype.suggestCategory.call(mockService, message);
      
      // Assert
      expect(result).toBe('Team Player'); // Default fallback
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });
  
  describe('getAllCategories', () => {
    it('should return all predefined categories', () => {
      // Act
      const categories = mockService.getAllCategories();
      
      // Assert
      expect(categories).toEqual(expect.arrayContaining([
        'Technical Excellence',
        'Team Player',
        'Innovation',
        'Leadership',
        'Problem Solving',
        'Customer Focus',
        'Quality Focus',
        'Mentorship',
        'Initiative',
        'Collaboration',
      ]));
      expect(categories.length).toBe(10);
    });
  });
}); 