import { UserManagementUser } from './UserManagementUser';
import { UserRole } from './UserRole';

describe('UserManagementUser', () => {
  it('should create a user with required properties', () => {
    // Arrange
    const userProps = {
      id: 'user123',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      role: UserRole.Member,
    };

    // Act
    const user = new UserManagementUser(userProps);

    // Assert
    expect(user.id).toBe('user123');
    expect(user.email).toBe('test@example.com');
    expect(user.firstName).toBe('John');
    expect(user.lastName).toBe('Doe');
    expect(user.role).toBe(UserRole.Member);
  });

  it('should set default values for optional properties', () => {
    // Arrange
    const userProps = {
      id: 'user123',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      role: UserRole.Member,
    };

    // Act
    const user = new UserManagementUser(userProps);

    // Assert
    expect(user.teamName).toBe('');
    expect(user.isVerified).toBe(false);
  });

  it('should use provided values for optional properties', () => {
    // Arrange
    const userProps = {
      id: 'user123',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      teamName: 'Engineering',
      role: UserRole.TechLeader,
      isVerified: true,
    };

    // Act
    const user = new UserManagementUser(userProps);

    // Assert
    expect(user.teamName).toBe('Engineering');
    expect(user.isVerified).toBe(true);
    expect(user.role).toBe(UserRole.TechLeader);
  });

  it('should correctly return the fullName', () => {
    // Arrange
    const userProps = {
      id: 'user123',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      role: UserRole.Member,
    };

    // Act
    const user = new UserManagementUser(userProps);

    // Assert
    expect(user.fullName).toBe('John Doe');
  });
});
