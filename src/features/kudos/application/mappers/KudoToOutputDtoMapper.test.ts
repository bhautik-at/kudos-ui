import { KudoToOutputDtoMapper } from './KudoToOutputDtoMapper';
import { Kudo } from '../../domain/entities/Kudo';
import { KudoOutputDto } from '../dtos/KudoOutputDto';

describe('KudoToOutputDtoMapper', () => {
  describe('toDto', () => {
    it('should correctly map a Kudo entity to KudoOutputDto', () => {
      // Arrange
      const createdAt = new Date('2023-01-01T00:00:00.000Z');
      const updatedAt = new Date('2023-01-02T00:00:00.000Z');
      
      const kudo = new Kudo({
        id: 'kudo-123',
        recipientId: 'user-123',
        senderId: 'user-456',
        teamId: 'team-789',
        categoryId: 'cat-101',
        message: 'Great collaboration!',
        organizationId: 'org-123',
        createdAt,
      });
      
      const recipientName = 'John Doe';
      const senderName = 'Jane Smith';
      const teamName = 'Engineering';
      const categoryName = 'Teamwork';
      
      // Act
      const result = KudoToOutputDtoMapper.toDto(
        kudo,
        recipientName,
        senderName,
        teamName,
        categoryName,
        updatedAt
      );
      
      // Assert
      expect(result).toEqual({
        id: 'kudo-123',
        recipientId: 'user-123',
        recipientName: 'John Doe',
        senderId: 'user-456',
        senderName: 'Jane Smith',
        teamId: 'team-789',
        teamName: 'Engineering',
        categoryId: 'cat-101',
        categoryName: 'Teamwork',
        message: 'Great collaboration!',
        organizationId: 'org-123',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-02T00:00:00.000Z'
      });
    });
    
    it('should handle undefined id and updatedAt', () => {
      // Arrange
      const createdAt = new Date('2023-01-01T00:00:00.000Z');
      
      const kudo = new Kudo({
        recipientId: 'user-123',
        senderId: 'user-456',
        teamId: 'team-789',
        categoryId: 'cat-101',
        message: 'Great collaboration!',
        organizationId: 'org-123',
        createdAt,
      });
      
      const recipientName = 'John Doe';
      const senderName = 'Jane Smith';
      const teamName = 'Engineering';
      const categoryName = 'Teamwork';
      
      // Act
      const result = KudoToOutputDtoMapper.toDto(
        kudo,
        recipientName,
        senderName,
        teamName,
        categoryName
      );
      
      // Assert
      expect(result.id).toBe('');
      expect(result.updatedAt).toBeUndefined();
    });
  });
  
  describe('toDtoList', () => {
    it('should correctly map a list of Kudo entities to KudoOutputDto list', () => {
      // Arrange
      const createdAt1 = new Date('2023-01-01T00:00:00.000Z');
      const createdAt2 = new Date('2023-01-02T00:00:00.000Z');
      
      const kudos = [
        new Kudo({
          id: 'kudo-123',
          recipientId: 'user-123',
          senderId: 'user-456',
          teamId: 'team-789',
          categoryId: 'cat-101',
          message: 'Great collaboration!',
          organizationId: 'org-123',
          createdAt: createdAt1,
        }),
        new Kudo({
          id: 'kudo-456',
          recipientId: 'user-789',
          senderId: 'user-123',
          teamId: 'team-456',
          categoryId: 'cat-202',
          message: 'Excellent work!',
          organizationId: 'org-123',
          createdAt: createdAt2,
        })
      ];
      
      const recipientNames = {
        'user-123': 'John Doe',
        'user-789': 'Alice Johnson'
      };
      
      const senderNames = {
        'user-123': 'John Doe',
        'user-456': 'Jane Smith'
      };
      
      const teamNames = {
        'team-456': 'Product',
        'team-789': 'Engineering'
      };
      
      const categoryNames = {
        'cat-101': 'Teamwork',
        'cat-202': 'Innovation'
      };
      
      // Act
      const result = KudoToOutputDtoMapper.toDtoList(
        kudos,
        recipientNames,
        senderNames,
        teamNames,
        categoryNames
      );
      
      // Assert
      expect(result).toHaveLength(2);
      
      expect(result[0]).toEqual({
        id: 'kudo-123',
        recipientId: 'user-123',
        recipientName: 'John Doe',
        senderId: 'user-456',
        senderName: 'Jane Smith',
        teamId: 'team-789',
        teamName: 'Engineering',
        categoryId: 'cat-101',
        categoryName: 'Teamwork',
        message: 'Great collaboration!',
        organizationId: 'org-123',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: undefined
      });
      
      expect(result[1]).toEqual({
        id: 'kudo-456',
        recipientId: 'user-789',
        recipientName: 'Alice Johnson',
        senderId: 'user-123',
        senderName: 'John Doe',
        teamId: 'team-456',
        teamName: 'Product',
        categoryId: 'cat-202',
        categoryName: 'Innovation',
        message: 'Excellent work!',
        organizationId: 'org-123',
        createdAt: '2023-01-02T00:00:00.000Z',
        updatedAt: undefined
      });
    });
    
    it('should fallback to "Unknown" for missing names', () => {
      // Arrange
      const createdAt = new Date('2023-01-01T00:00:00.000Z');
      
      const kudos = [
        new Kudo({
          id: 'kudo-123',
          recipientId: 'user-123',
          senderId: 'user-456',
          teamId: 'team-789',
          categoryId: 'cat-101',
          message: 'Great collaboration!',
          organizationId: 'org-123',
          createdAt,
        })
      ];
      
      // Empty records to trigger fallback values
      const recipientNames = {};
      const senderNames = {};
      const teamNames = {};
      const categoryNames = {};
      
      // Act
      const result = KudoToOutputDtoMapper.toDtoList(
        kudos,
        recipientNames,
        senderNames,
        teamNames,
        categoryNames
      );
      
      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].recipientName).toBe('Unknown');
      expect(result[0].senderName).toBe('Unknown');
      expect(result[0].teamName).toBe('Unknown');
      expect(result[0].categoryName).toBe('Unknown');
    });
  });
}); 