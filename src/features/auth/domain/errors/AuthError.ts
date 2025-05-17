export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export class OtpExpiredError extends AuthError {
  constructor() {
    super('OTP has expired');
    this.name = 'OtpExpiredError';
  }
}

export class OtpInvalidError extends AuthError {
  constructor() {
    super('Invalid OTP');
    this.name = 'OtpInvalidError';
  }
}

export class OtpMaxAttemptsError extends AuthError {
  constructor() {
    super('Maximum OTP verification attempts exceeded');
    this.name = 'OtpMaxAttemptsError';
  }
}

export class EmailAlreadyExistsError extends AuthError {
  constructor(email: string) {
    super(`The email ${email} is already registered`);
    this.name = 'EmailAlreadyExistsError';
  }
}
