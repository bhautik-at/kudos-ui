import { Kudo, KudoProps } from './Kudo';

describe('Kudo Entity', () => {
  const validKudoProps: KudoProps = {
    recipientId: 'user-123',
    senderId: 'user-456',
    teamId: 'team-789',
    categoryId: 'cat-101',
    message: 'Great job on the project!',
    organizationId: 'org-123',
  };

  it('should create a valid Kudo entity with required properties', () => {
    // Act
    const kudo = new Kudo(validKudoProps);

    // Assert
    expect(kudo.recipientId).toBe(validKudoProps.recipientId);
    expect(kudo.senderId).toBe(validKudoProps.senderId);
    expect(kudo.teamId).toBe(validKudoProps.teamId);
    expect(kudo.categoryId).toBe(validKudoProps.categoryId);
    expect(kudo.message).toBe(validKudoProps.message);
    expect(kudo.organizationId).toBe(validKudoProps.organizationId);
    expect(kudo.createdAt).toBeInstanceOf(Date);
  });

  it('should create a Kudo with provided id', () => {
    // Arrange
    const propsWithId: KudoProps = {
      ...validKudoProps,
      id: 'kudo-123',
    };

    // Act
    const kudo = new Kudo(propsWithId);

    // Assert
    expect(kudo.id).toBe('kudo-123');
  });

  it('should create a Kudo with provided createdAt date', () => {
    // Arrange
    const customDate = new Date('2023-01-01T00:00:00.000Z');
    const propsWithDate: KudoProps = {
      ...validKudoProps,
      createdAt: customDate,
    };

    // Act
    const kudo = new Kudo(propsWithDate);

    // Assert
    expect(kudo.createdAt).toBe(customDate);
  });

  it('should throw error when recipientId is empty', () => {
    // Arrange
    const invalidProps: KudoProps = {
      ...validKudoProps,
      recipientId: '',
    };

    // Act & Assert
    expect(() => new Kudo(invalidProps)).toThrow('Recipient is required');
  });

  it('should throw error when senderId is empty', () => {
    // Arrange
    const invalidProps: KudoProps = {
      ...validKudoProps,
      senderId: '',
    };

    // Act & Assert
    expect(() => new Kudo(invalidProps)).toThrow('Sender is required');
  });

  it('should throw error when teamId is empty', () => {
    // Arrange
    const invalidProps: KudoProps = {
      ...validKudoProps,
      teamId: '',
    };

    // Act & Assert
    expect(() => new Kudo(invalidProps)).toThrow('Team is required');
  });

  it('should throw error when categoryId is empty', () => {
    // Arrange
    const invalidProps: KudoProps = {
      ...validKudoProps,
      categoryId: '',
    };

    // Act & Assert
    expect(() => new Kudo(invalidProps)).toThrow('Category is required');
  });

  it('should throw error when message is empty', () => {
    // Arrange
    const invalidProps: KudoProps = {
      ...validKudoProps,
      message: '',
    };

    // Act & Assert
    expect(() => new Kudo(invalidProps)).toThrow('Message is required');
  });

  it('should throw error when message contains only whitespace', () => {
    // Arrange
    const invalidProps: KudoProps = {
      ...validKudoProps,
      message: '   ',
    };

    // Act & Assert
    expect(() => new Kudo(invalidProps)).toThrow('Message is required');
  });

  it('should throw error when organizationId is empty', () => {
    // Arrange
    const invalidProps: KudoProps = {
      ...validKudoProps,
      organizationId: '',
    };

    // Act & Assert
    expect(() => new Kudo(invalidProps)).toThrow('Organization is required');
  });
}); 