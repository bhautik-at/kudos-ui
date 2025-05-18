import { AcceptInvitationUseCase } from './AcceptInvitationUseCase';
import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import { User } from '../../domain/entities/User';

// Mock the repository interface
const mockUserRepository: jest.Mocked<IUserRepository> = {
  getCurrentUser: jest.fn(),
  acceptInvitation: jest.fn(),
};

describe('AcceptInvitationUseCase', () => {
  let useCase: AcceptInvitationUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new AcceptInvitationUseCase(mockUserRepository);
  });

  it('should successfully accept an invitation', async () => {
    // Arrange
    const organizationId = 'org-123';
    mockUserRepository.acceptInvitation.mockResolvedValue(organizationId);

    // Act
    const result = await useCase.execute({ organizationId });

    // Assert
    expect(result.success).toBe(true);
    expect(result.message).toBe('Invitation accepted successfully');
    expect(result.organizationId).toBe(organizationId);
    expect(mockUserRepository.acceptInvitation).toHaveBeenCalledWith(organizationId);
  });

  it('should return error when organizationId is empty', async () => {
    // Arrange
    const organizationId = '';

    // Act
    const result = await useCase.execute({ organizationId });

    // Assert
    expect(result.success).toBe(false);
    expect(result.message).toBe('Organization ID is required');
    expect(result.organizationId).toBe('');
    expect(mockUserRepository.acceptInvitation).not.toHaveBeenCalled();
  });

  it('should handle repository errors', async () => {
    // Arrange
    const organizationId = 'org-123';
    const errorMessage = 'Failed to accept invitation';
    mockUserRepository.acceptInvitation.mockRejectedValue(new Error(errorMessage));

    // Act
    const result = await useCase.execute({ organizationId });

    // Assert
    expect(result.success).toBe(false);
    expect(result.message).toBe(errorMessage);
    expect(result.organizationId).toBe(organizationId);
    expect(mockUserRepository.acceptInvitation).toHaveBeenCalledWith(organizationId);
  });
});
