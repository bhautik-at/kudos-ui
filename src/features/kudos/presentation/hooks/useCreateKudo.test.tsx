import { renderHook, act } from '@testing-library/react';
import { useCreateKudo } from './useCreateKudo';
import { CreateKudoUseCase } from '../../application/useCases/CreateKudoUseCase';
import { KudoRepository } from '../../infrastructure/repositories/KudoRepository';
import { CategoryRepository } from '../../infrastructure/repositories/CategoryRepository';
import { KudoApiClient } from '../../infrastructure/api/KudoApiClient';
import { CategoryApiClient } from '../../infrastructure/api/CategoryApiClient';
import { useAuth } from '@/features/auth/presentation/hooks/useAuth';
import { ReactNode } from 'react';

// Mock dependencies
jest.mock('../../application/useCases/CreateKudoUseCase');
jest.mock('../../infrastructure/repositories/KudoRepository');
jest.mock('../../infrastructure/repositories/CategoryRepository');
jest.mock('../../infrastructure/api/KudoApiClient');
jest.mock('../../infrastructure/api/CategoryApiClient');
jest.mock('@/features/auth/presentation/hooks/useAuth');

// Test wrapper to provide any necessary context
const wrapper = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

describe('useCreateKudo', () => {
  const mockAuthUser = {
    id: 'user-123',
    name: 'Test User',
    email: 'test@example.com'
  };
  
  // Set up mocks
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock auth hook
    (useAuth as jest.Mock).mockReturnValue({
      user: mockAuthUser
    });
    
    // Mock CreateKudoUseCase.execute
    (CreateKudoUseCase.prototype.execute as jest.Mock).mockResolvedValue({
      id: 'kudo-123',
      recipientId: 'user-456',
      recipientName: 'John Doe',
      senderId: 'user-123',
      senderName: 'Test User',
      teamId: 'team-789',
      teamName: 'Engineering',
      categoryId: 'cat-101',
      categoryName: 'Team Player',
      message: 'Great job!',
      organizationId: 'org-123',
      createdAt: '2023-01-01T00:00:00.000Z'
    });
  });
  
  it('should create a kudo successfully', async () => {
    // Arrange
    const { result } = renderHook(() => useCreateKudo(), { wrapper });
    const kudoData = {
      recipientId: 'user-456',
      teamId: 'team-789',
      categoryId: 'cat-101',
      message: 'Great job!',
      organizationId: 'org-123'
    };
    
    // Act
    let kudoResult;
    await act(async () => {
      kudoResult = await result.current.createKudo(kudoData);
    });
    
    // Assert
    expect(KudoApiClient).toHaveBeenCalled();
    expect(KudoRepository).toHaveBeenCalled();
    expect(CategoryApiClient).toHaveBeenCalled();
    expect(CategoryRepository).toHaveBeenCalled();
    expect(CreateKudoUseCase).toHaveBeenCalled();
    expect(CreateKudoUseCase.prototype.execute).toHaveBeenCalledWith(kudoData, mockAuthUser.id);
    
    expect(kudoResult).toEqual(expect.objectContaining({
      id: 'kudo-123',
      recipientId: 'user-456',
      senderId: 'user-123'
    }));
    
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });
  
  it('should set loading state during kudo creation', async () => {
    // Arrange
    const { result } = renderHook(() => useCreateKudo(), { wrapper });
    const kudoData = {
      recipientId: 'user-456',
      teamId: 'team-789',
      categoryId: 'cat-101',
      message: 'Great job!',
      organizationId: 'org-123'
    };
    
    // Create a promise that we can resolve later
    let resolvePromise: (value: any) => void;
    const delayedPromise = new Promise(resolve => {
      resolvePromise = resolve;
    });
    
    (CreateKudoUseCase.prototype.execute as jest.Mock).mockReturnValue(delayedPromise);
    
    // Act - Start the creation process
    let createPromise: Promise<any>;
    act(() => {
      createPromise = result.current.createKudo(kudoData);
    });
    
    // Assert - Should be in loading state
    expect(result.current.isLoading).toBe(true);
    
    // Resolve the promise
    await act(async () => {
      resolvePromise!({
        id: 'kudo-123',
        recipientId: 'user-456'
      });
      await createPromise;
    });
    
    // Should no longer be in loading state
    expect(result.current.isLoading).toBe(false);
  });
  
  it('should handle errors during kudo creation', async () => {
    // Arrange
    const { result } = renderHook(() => useCreateKudo(), { wrapper });
    const kudoData = {
      recipientId: 'user-456',
      teamId: 'team-789',
      categoryId: 'cat-101',
      message: 'Great job!',
      organizationId: 'org-123'
    };
    
    const testError = new Error('Failed to create kudo');
    (CreateKudoUseCase.prototype.execute as jest.Mock).mockRejectedValue(testError);
    
    // Act & Assert
    await act(async () => {
      await expect(result.current.createKudo(kudoData)).rejects.toThrow('Failed to create kudo');
    });
    
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toEqual(testError);
  });
  
  it('should throw error when user is not authenticated', async () => {
    // Arrange - Mock unauthenticated user
    (useAuth as jest.Mock).mockReturnValue({
      user: null
    });
    
    const { result } = renderHook(() => useCreateKudo(), { wrapper });
    const kudoData = {
      recipientId: 'user-456',
      teamId: 'team-789',
      categoryId: 'cat-101',
      message: 'Great job!',
      organizationId: 'org-123'
    };
    
    // Act & Assert
    await act(async () => {
      await expect(result.current.createKudo(kudoData)).rejects.toThrow('User not authenticated');
    });
    
    expect(result.current.isLoading).toBe(false);
  });
  
  it('should wrap unknown errors', async () => {
    // Arrange
    const { result } = renderHook(() => useCreateKudo(), { wrapper });
    const kudoData = {
      recipientId: 'user-456',
      teamId: 'team-789',
      categoryId: 'cat-101',
      message: 'Great job!',
      organizationId: 'org-123'
    };
    
    // Mock a non-Error rejection
    (CreateKudoUseCase.prototype.execute as jest.Mock).mockRejectedValue('String error');
    
    // Act & Assert
    await act(async () => {
      await expect(result.current.createKudo(kudoData)).rejects.toThrow('An unknown error occurred');
    });
    
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe('An unknown error occurred');
  });
}); 