import {
  AuthError,
  OtpExpiredError,
  OtpInvalidError,
  OtpMaxAttemptsError,
  EmailAlreadyExistsError
} from './AuthError';

describe('AuthError', () => {
  it('should create an AuthError with correct name and message', () => {
    const message = 'Test auth error';
    const error = new AuthError(message);
    
    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe('AuthError');
    expect(error.message).toBe(message);
  });
});

describe('OtpExpiredError', () => {
  it('should create an OtpExpiredError with correct name and message', () => {
    const error = new OtpExpiredError();
    
    expect(error).toBeInstanceOf(AuthError);
    expect(error.name).toBe('OtpExpiredError');
    expect(error.message).toBe('OTP has expired');
  });
});

describe('OtpInvalidError', () => {
  it('should create an OtpInvalidError with correct name and message', () => {
    const error = new OtpInvalidError();
    
    expect(error).toBeInstanceOf(AuthError);
    expect(error.name).toBe('OtpInvalidError');
    expect(error.message).toBe('Invalid OTP');
  });
});

describe('OtpMaxAttemptsError', () => {
  it('should create an OtpMaxAttemptsError with correct name and message', () => {
    const error = new OtpMaxAttemptsError();
    
    expect(error).toBeInstanceOf(AuthError);
    expect(error.name).toBe('OtpMaxAttemptsError');
    expect(error.message).toBe('Maximum OTP verification attempts exceeded');
  });
});

describe('EmailAlreadyExistsError', () => {
  it('should create an EmailAlreadyExistsError with correct name and message including email', () => {
    const email = 'test@example.com';
    const error = new EmailAlreadyExistsError(email);
    
    expect(error).toBeInstanceOf(AuthError);
    expect(error.name).toBe('EmailAlreadyExistsError');
    expect(error.message).toBe(`The email ${email} is already registered`);
  });
}); 