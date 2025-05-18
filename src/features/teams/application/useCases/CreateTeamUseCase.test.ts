import { CreateTeamUseCase } from './CreateTeamUseCase';
import { TeamRepository } from '../../domain/interfaces/TeamRepository';
import { TeamMapper } from '../mappers/TeamMapper';
import { Team } from '../../domain/entities/Team';
import { CreateTeamInputDto } from '../dtos/CreateTeamInputDto';

// Mock the TeamMapper
jest.mock('../mappers/TeamMapper');
const MockedTeamMapper = TeamMapper as jest.Mocked<typeof TeamMapper>;

describe('CreateTeamUseCase', () => {
  // Mock repository
  let mockTeamRepository: jest.Mocked<TeamRepository>;
  let createTeamUseCase: CreateTeamUseCase;

  beforeEach(() => {
    // Create a mock repository
    mockTeamRepository = {
      createTeam: jest.fn(),
      findTeamById: jest.fn(),
      findTeamsByOrganizationId: jest.fn(),
      updateTeam: jest.fn(),
      deleteTeam: jest.fn(),
    } as jest.Mocked<TeamRepository>;

    // Reset mapper mock
    jest.clearAllMocks();

    // Set up the use case with the mock repository
    createTeamUseCase = new CreateTeamUseCase(mockTeamRepository);
  });

  it('should create a team and return mapped DTO', async () => {
    // Arrange
    const mockInputDto: CreateTeamInputDto = {
      name: 'Engineering Team',
      organizationId: 'org-123',
      createdBy: 'user-123',
      members: ['user-123', 'user-456'],
    };

    const mockTeam = new Team({
      name: 'Engineering Team',
      organizationId: 'org-123',
      createdBy: 'user-123',
      members: ['user-123', 'user-456'],
    });

    const mockSavedTeam = new Team({
      id: 'team-123',
      name: 'Engineering Team',
      organizationId: 'org-123',
      createdBy: 'user-123',
      members: ['user-123', 'user-456'],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const mockOutputDto = {
      id: 'team-123',
      name: 'Engineering Team',
      organizationId: 'org-123',
      createdBy: 'user-123',
      members: ['user-123', 'user-456'],
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    };

    // Set up mocks
    (MockedTeamMapper.toEntity as jest.Mock).mockReturnValue(mockTeam);
    mockTeamRepository.createTeam.mockResolvedValue(mockSavedTeam);
    (MockedTeamMapper.toDto as jest.Mock).mockReturnValue(mockOutputDto);

    // Act
    const result = await createTeamUseCase.execute(mockInputDto);

    // Assert
    expect(MockedTeamMapper.toEntity).toHaveBeenCalledWith(mockInputDto);
    expect(mockTeamRepository.createTeam).toHaveBeenCalledWith(mockTeam);
    expect(MockedTeamMapper.toDto).toHaveBeenCalledWith(mockSavedTeam);
    expect(result).toEqual(mockOutputDto);
  });

  it('should propagate repository errors', async () => {
    // Arrange
    const mockInputDto: CreateTeamInputDto = {
      name: 'Engineering Team',
      organizationId: 'org-123',
      createdBy: 'user-123',
    };

    const mockTeam = new Team({
      name: 'Engineering Team',
      organizationId: 'org-123',
      createdBy: 'user-123',
    });

    const mockError = new Error('Repository error');

    // Set up mocks
    (MockedTeamMapper.toEntity as jest.Mock).mockReturnValue(mockTeam);
    mockTeamRepository.createTeam.mockRejectedValue(mockError);

    // Act & Assert
    await expect(createTeamUseCase.execute(mockInputDto)).rejects.toThrow(mockError);
    expect(MockedTeamMapper.toEntity).toHaveBeenCalledWith(mockInputDto);
    expect(mockTeamRepository.createTeam).toHaveBeenCalledWith(mockTeam);
    expect(MockedTeamMapper.toDto).not.toHaveBeenCalled();
  });
});
