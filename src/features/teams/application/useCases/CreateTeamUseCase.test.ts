import { Team } from '../../domain/entities/Team';
import { TeamRepository } from '../../domain/interfaces/TeamRepository';
import { CreateTeamInputDto } from '../dtos/CreateTeamInputDto';
import { TeamMapper } from '../mappers/TeamMapper';
import { CreateTeamUseCase } from './CreateTeamUseCase';

// Mock the repository
const mockTeamRepository: jest.Mocked<TeamRepository> = {
  createTeam: jest.fn(),
  findTeamById: jest.fn(),
  findTeamsByOrganizationId: jest.fn(),
  updateTeam: jest.fn(),
  deleteTeam: jest.fn(),
};

// Mock the mapper
jest.mock('../mappers/TeamMapper', () => ({
  TeamMapper: {
    toEntity: jest.fn(),
    toDto: jest.fn(),
  },
}));

describe('CreateTeamUseCase', () => {
  let useCase: CreateTeamUseCase;
  const mockMapper = TeamMapper as jest.Mocked<typeof TeamMapper>;
  
  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new CreateTeamUseCase(mockTeamRepository);
  });
  
  it('should create a team successfully', async () => {
    // Arrange
    const inputDto: CreateTeamInputDto = {
      name: 'Test Team',
      organizationId: 'org-123',
      createdBy: 'user-123',
      members: ['user-123', 'user-456'],
    };
    
    const mockEntity = new Team({
      name: 'Test Team',
      organizationId: 'org-123',
      createdBy: 'user-123',
      members: ['user-123', 'user-456'],
    });
    
    const savedEntity = new Team({
      id: 'team-123',
      name: 'Test Team',
      organizationId: 'org-123',
      createdBy: 'user-123',
      createdAt: new Date('2023-01-01T00:00:00.000Z'),
      updatedAt: new Date('2023-01-01T00:00:00.000Z'),
      members: ['user-123', 'user-456'],
    });
    
    const expectedOutputDto = {
      id: 'team-123',
      name: 'Test Team',
      organizationId: 'org-123',
      createdBy: 'user-123',
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
      members: ['user-123', 'user-456'],
    };
    
    mockMapper.toEntity.mockReturnValue(mockEntity);
    mockTeamRepository.createTeam.mockResolvedValue(savedEntity);
    mockMapper.toDto.mockReturnValue(expectedOutputDto);
    
    // Act
    const result = await useCase.execute(inputDto);
    
    // Assert
    expect(mockMapper.toEntity).toHaveBeenCalledWith(inputDto);
    expect(mockTeamRepository.createTeam).toHaveBeenCalledWith(mockEntity);
    expect(mockMapper.toDto).toHaveBeenCalledWith(savedEntity);
    expect(result).toEqual(expectedOutputDto);
  });
  
  it('should handle repository errors', async () => {
    // Arrange
    const inputDto: CreateTeamInputDto = {
      name: 'Test Team',
      organizationId: 'org-123',
      createdBy: 'user-123',
    };
    
    const mockEntity = new Team({
      name: 'Test Team',
      organizationId: 'org-123',
      createdBy: 'user-123',
    });
    
    mockMapper.toEntity.mockReturnValue(mockEntity);
    mockTeamRepository.createTeam.mockRejectedValue(new Error('Database error'));
    
    // Act & Assert
    await expect(useCase.execute(inputDto)).rejects.toThrow('Database error');
    expect(mockMapper.toEntity).toHaveBeenCalledWith(inputDto);
    expect(mockTeamRepository.createTeam).toHaveBeenCalledWith(mockEntity);
  });
}); 