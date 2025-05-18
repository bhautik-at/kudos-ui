import { User } from './User';

describe('User Entity', () => {
  it('should create a User instance with required properties', () => {
    // Arrange
    const props = {
      id: 'user-123',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
    };

    // Act
    const user = new User(props);

    // Assert
    expect(user.id).toBe(props.id);
    expect(user.email).toBe(props.email);
    expect(user.firstName).toBe(props.firstName);
    expect(user.lastName).toBe(props.lastName);
  });

  it('should set default values for optional properties', () => {
    // Arrange
    const props = {
      id: 'user-123',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
    };

    // Act
    const user = new User(props);

    // Assert
    expect(user.role).toBe('Member');
    expect(user.isVerified).toBe(false);
    expect(user.createdAt).toBeInstanceOf(Date);
    expect(user.updatedAt).toBeInstanceOf(Date);
  });

  it('should use provided values for optional properties when given', () => {
    // Arrange
    const createdAt = new Date('2023-01-01');
    const updatedAt = new Date('2023-01-02');
    const props = {
      id: 'user-123',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      role: 'Admin',
      isVerified: true,
      createdAt,
      updatedAt,
    };

    // Act
    const user = new User(props);

    // Assert
    expect(user.role).toBe('Admin');
    expect(user.isVerified).toBe(true);
    expect(user.createdAt).toBe(createdAt);
    expect(user.updatedAt).toBe(updatedAt);
  });

  it('should generate correct fullName', () => {
    // Arrange
    const props = {
      id: 'user-123',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
    };

    // Act
    const user = new User(props);

    // Assert
    expect(user.fullName).toBe('John Doe');
  });
});
