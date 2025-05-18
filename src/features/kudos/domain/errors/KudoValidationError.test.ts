import { KudoValidationError } from './KudoValidationError';

describe('KudoValidationError', () => {
  it('should create an error with the correct message', () => {
    // Arrange
    const errorMessage = 'Recipient not found';
    
    // Act
    const error = new KudoValidationError(errorMessage);
    
    // Assert
    expect(error.message).toBe(errorMessage);
  });
  
  it('should have the correct error name', () => {
    // Arrange & Act
    const error = new KudoValidationError('Category not found');
    
    // Assert
    expect(error.name).toBe('KudoValidationError');
  });
  
  it('should extend Error class', () => {
    // Arrange & Act
    const error = new KudoValidationError('Invalid kudo data');
    
    // Assert
    expect(error).toBeInstanceOf(Error);
  });
  
  it('should be catchable as a standard error', () => {
    // Arrange
    const errorMessage = 'Team not found';
    let caughtError: Error | null = null;
    
    // Act
    try {
      throw new KudoValidationError(errorMessage);
    } catch (error) {
      caughtError = error as Error;
    }
    
    // Assert
    expect(caughtError).not.toBeNull();
    expect(caughtError?.message).toBe(errorMessage);
    expect(caughtError).toBeInstanceOf(KudoValidationError);
  });
}); 