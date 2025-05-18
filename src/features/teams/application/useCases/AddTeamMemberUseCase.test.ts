import { TeamMember } from '../../domain/entities/TeamMember';
import { TeamMemberAlreadyExistsError } from '../../domain/errors/TeamMemberAlreadyExistsError';
import { TeamNotFoundError } from '../../domain/errors/TeamNotFoundError';
import { TeamMemberRepository } from '../../domain/interfaces/TeamMemberRepository';
import { TeamRepository } from '../../domain/interfaces/TeamRepository';
import { TeamMemberInputDto } from '../dtos/TeamMemberInputDto';
import { TeamMemberMapper } from '../mappers/TeamMemberMapper';
import { AddTeamMemberUseCase } from './AddTeamMemberUseCase';

// Mock the repositories
const mockTeamRepository: jest.Mocked<TeamRepository> = {
  createTeam: jest.fn(),
  findTeamById: jest.fn(),
  findTeamsByOrganizationId: jest.fn(),
  updateTeam: jest.fn(),
  deleteTeam: jest.fn(),
};

const mockTeamMemberRepository: jest.Mocked<TeamMemberRepository> = {
  addTeamMember: jest.fn(),
  findTeamMembers: jest.fn(),
  removeTeamMember: jest.fn(),
  isUserInTeam: jest.fn(),
};

// Mock the mapper
jest.mock('../mappers/TeamMemberMapper', () => ({
  TeamMemberMapper: {
    toEntity: jest.fn(),
    toDto: jest.fn(),
  },
}));

describe('AddTeamMemberUseCase', () => {
  let useCase: AddTeamMemberUseCase;
  const mockMapper = TeamMemberMapper as jest.Mocked<typeof TeamMemberMapper>;
  
  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new AddTeamMemberUseCase(mockTeamRepository, mockTeamMemberRepository);
  });
  
  it('should add a team member successfully', async () => {
    // Arrange
    const inputDto: TeamMemberInputDto = {
      teamId: 'team-123',
      memberUserId: 'user-456',
    };
    
    const mockEntity = new TeamMember({
      teamId: 'team-123',
      userId: 'user-456',
    });
    
    const savedEntity = new TeamMember({
      id: 'member-123',
      teamId: 'team-123',
      userId: 'user-456',
      createdAt: new Date('2023-01-01T00:00:00.000Z'),
      updatedAt: new Date('2023-01-01T00:00:00.000Z'),
    });
    
    const expectedOutputDto = {
      id: 'member-123',
      teamId: 'team-123',
      userId: 'user-456',
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
    };
    
    // Mock repository responses
    mockTeamRepository.findTeamById.mockResolvedValue({ id: 'team-123', name: 'Test Team' } as any);
    mockTeamMemberRepository.isUserInTeam.mockResolvedValue(false);
    mockMapper.toEntity.mockReturnValue(mockEntity);
    mockTeamMemberRepository.addTeamMember.mockResolvedValue(savedEntity);
    mockMapper.toDto.mockReturnValue(expectedOutputDto);
    
    // Act
    const result = await useCase.execute(inputDto);
    
    // Assert
    expect(mockTeamRepository.findTeamById).toHaveBeenCalledWith('team-123');
    expect(mockTeamMemberRepository.isUserInTeam).toHaveBeenCalledWith('team-123', 'user-456');
    expect(mockMapper.toEntity).toHaveBeenCalledWith(inputDto);
    expect(mockTeamMemberRepository.addTeamMember).toHaveBeenCalledWith(mockEntity);
    expect(mockMapper.toDto).toHaveBeenCalledWith(savedEntity);
    expect(result).toEqual(expectedOutputDto);
  });
  
  it('should throw TeamNotFoundError when team does not exist', async () => {
    // Arrange
    const inputDto: TeamMemberInputDto = {
      teamId: 'non-existent-team',
      memberUserId: 'user-456',
    };
    
    mockTeamRepository.findTeamById.mockResolvedValue(null);
    
    // Act & Assert
    await expect(useCase.execute(inputDto)).rejects.toThrow(TeamNotFoundError);
    expect(mockTeamRepository.findTeamById).toHaveBeenCalledWith('non-existent-team');
    expect(mockTeamMemberRepository.isUserInTeam).not.toHaveBeenCalled();
    expect(mockTeamMemberRepository.addTeamMember).not.toHaveBeenCalled();
  });
  
  it('should throw TeamMemberAlreadyExistsError when user is already a member', async () => {
    // Arrange
    const inputDto: TeamMemberInputDto = {
      teamId: 'team-123',
      memberUserId: 'existing-user',
    };
    
    mockTeamRepository.findTeamById.mockResolvedValue({ id: 'team-123', name: 'Test Team' } as any);
    mockTeamMemberRepository.isUserInTeam.mockResolvedValue(true);
    
    // Act & Assert
    await expect(useCase.execute(inputDto)).rejects.toThrow(TeamMemberAlreadyExistsError);
    expect(mockTeamRepository.findTeamById).toHaveBeenCalledWith('team-123');
    expect(mockTeamMemberRepository.isUserInTeam).toHaveBeenCalledWith('team-123', 'existing-user');
    expect(mockTeamMemberRepository.addTeamMember).not.toHaveBeenCalled();
  });
  
  it('should handle repository errors', async () => {
    // Arrange
    const inputDto: TeamMemberInputDto = {
      teamId: 'team-123',
      memberUserId: 'user-456',
    };
    
    const mockEntity = new TeamMember({
      teamId: 'team-123',
      userId: 'user-456',
    });
    
    mockTeamRepository.findTeamById.mockResolvedValue({ id: 'team-123', name: 'Test Team' } as any);
    mockTeamMemberRepository.isUserInTeam.mockResolvedValue(false);
    mockMapper.toEntity.mockReturnValue(mockEntity);
    mockTeamMemberRepository.addTeamMember.mockRejectedValue(new Error('Database error'));
    
    // Act & Assert
    await expect(useCase.execute(inputDto)).rejects.toThrow('Database error');
    expect(mockTeamRepository.findTeamById).toHaveBeenCalledWith('team-123');
    expect(mockTeamMemberRepository.isUserInTeam).toHaveBeenCalledWith('team-123', 'user-456');
    expect(mockMapper.toEntity).toHaveBeenCalledWith(inputDto);
    expect(mockTeamMemberRepository.addTeamMember).toHaveBeenCalledWith(mockEntity);
  });
}); 