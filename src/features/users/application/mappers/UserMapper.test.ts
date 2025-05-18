import { UserMapper } from './UserMapper';
import { User } from '../../domain/entities/User';

describe('UserMapper', () => {
  describe('toDto', () => {
    it('should map User entity to UserOutputDto', () => {
      // Arrange
      const user = new User({
        id: 'user-123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'Admin',
        isVerified: true,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02'),
      });

      // Act
      const dto = UserMapper.toDto(user);

      // Assert
      expect(dto).toEqual({
        id: 'user-123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        fullName: 'John Doe',
        role: 'Admin',
        isVerified: true,
      });
    });
  });

  describe('fromApiResponse', () => {
    it('should map API response to User entity', () => {
      // Arrange
      const apiResponse = {
        id: 'user-123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'Admin',
        isVerified: true,
      };

      // Act
      const user = UserMapper.fromApiResponse(apiResponse);

      // Assert
      expect(user).toBeInstanceOf(User);
      expect(user.id).toBe(apiResponse.id);
      expect(user.email).toBe(apiResponse.email);
      expect(user.firstName).toBe(apiResponse.firstName);
      expect(user.lastName).toBe(apiResponse.lastName);
      expect(user.role).toBe(apiResponse.role);
      expect(user.isVerified).toBe(apiResponse.isVerified);
      expect(user.fullName).toBe('John Doe');
    });

    it('should handle missing optional fields', () => {
      // Arrange
      const apiResponse = {
        id: 'user-123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
      };

      // Act
      const user = UserMapper.fromApiResponse(apiResponse);

      // Assert
      expect(user).toBeInstanceOf(User);
      expect(user.role).toBe('Member'); // Default value
      expect(user.isVerified).toBe(false); // Default value
    });
  });
});
