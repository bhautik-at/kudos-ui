import { InputDtoToKudoMapper } from './InputDtoToKudoMapper';
import { CreateKudoInputDto } from '../dtos/CreateKudoInputDto';
import { UpdateKudoInputDto } from '../dtos/UpdateKudoInputDto';
import { Kudo } from '../../domain/entities/Kudo';

describe('InputDtoToKudoMapper', () => {
  const mockDate = new Date('2023-01-01T00:00:00.000Z');
  
  beforeAll(() => {
    // Mock the Date constructor to return a consistent date
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe('toEntity', () => {
    it('should correctly map CreateKudoInputDto to Kudo entity', () => {
      // Arrange
      const inputDto: CreateKudoInputDto = {
        recipientId: 'user-123',
        teamId: 'team-456',
        categoryId: 'cat-789',
        message: 'Great job on the project!',
        organizationId: 'org-123',
      };
      const senderId = 'user-456';

      // Act
      const result = InputDtoToKudoMapper.toEntity(inputDto, senderId);

      // Assert
      expect(result).toBeInstanceOf(Kudo);
      expect(result.id).toBeUndefined();
      expect(result.recipientId).toBe(inputDto.recipientId);
      expect(result.senderId).toBe(senderId);
      expect(result.teamId).toBe(inputDto.teamId);
      expect(result.categoryId).toBe(inputDto.categoryId);
      expect(result.message).toBe(inputDto.message);
      expect(result.organizationId).toBe(inputDto.organizationId);
      expect(result.createdAt).toEqual(mockDate);
    });
  });

  describe('toEntityForUpdate', () => {
    it('should correctly map UpdateKudoInputDto to Kudo entity with all fields provided', () => {
      // Arrange
      const existingKudo = new Kudo({
        id: 'kudo-123',
        recipientId: 'user-123',
        senderId: 'user-456',
        teamId: 'team-456',
        categoryId: 'cat-789',
        message: 'Original message',
        organizationId: 'org-123',
        createdAt: new Date('2022-12-31T00:00:00.000Z'),
      });

      const updateDto: UpdateKudoInputDto = {
        id: 'kudo-123',
        recipientId: 'user-789',
        teamId: 'team-999',
        categoryId: 'cat-111',
        message: 'Updated message',
        organizationId: 'org-123'
      };

      // Act
      const result = InputDtoToKudoMapper.toEntityForUpdate(updateDto, existingKudo);

      // Assert
      expect(result).toBeInstanceOf(Kudo);
      expect(result.id).toBe(existingKudo.id);
      expect(result.recipientId).toBe(updateDto.recipientId);
      expect(result.senderId).toBe(existingKudo.senderId);
      expect(result.teamId).toBe(updateDto.teamId);
      expect(result.categoryId).toBe(updateDto.categoryId);
      expect(result.message).toBe(updateDto.message);
      expect(result.organizationId).toBe(existingKudo.organizationId);
      expect(result.createdAt).toEqual(existingKudo.createdAt);
    });

    it('should keep existing values for fields not included in the update DTO', () => {
      // Arrange
      const existingKudo = new Kudo({
        id: 'kudo-123',
        recipientId: 'user-123',
        senderId: 'user-456',
        teamId: 'team-456',
        categoryId: 'cat-789',
        message: 'Original message',
        organizationId: 'org-123',
        createdAt: new Date('2022-12-31T00:00:00.000Z'),
      });

      const updateDto: UpdateKudoInputDto = {
        id: 'kudo-123',
        message: 'Updated message',
        organizationId: 'org-123'
      };

      // Act
      const result = InputDtoToKudoMapper.toEntityForUpdate(updateDto, existingKudo);

      // Assert
      expect(result).toBeInstanceOf(Kudo);
      expect(result.id).toBe(existingKudo.id);
      expect(result.recipientId).toBe(existingKudo.recipientId);
      expect(result.senderId).toBe(existingKudo.senderId);
      expect(result.teamId).toBe(existingKudo.teamId);
      expect(result.categoryId).toBe(existingKudo.categoryId);
      expect(result.message).toBe(updateDto.message);
      expect(result.organizationId).toBe(existingKudo.organizationId);
      expect(result.createdAt).toEqual(existingKudo.createdAt);
    });
  });
}); 