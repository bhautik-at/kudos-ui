import { OtpRequest } from './OtpRequest';

describe('OtpRequest', () => {
  describe('constructor', () => {
    it('should create an OtpRequest with default values', () => {
      const email = 'test@example.com';
      const expiresAt = new Date(Date.now() + 300000); // 5 minutes from now
      
      const otpRequest = new OtpRequest(email, expiresAt);
      
      expect(otpRequest.email).toBe(email);
      expect(otpRequest.expiresAt).toBe(expiresAt);
      expect(otpRequest.attempts).toBe(0);
      expect(otpRequest.maxAttempts).toBe(3);
      expect(otpRequest.cooldownSeconds).toBe(60);
    });
    
    it('should create an OtpRequest with custom values', () => {
      const email = 'test@example.com';
      const expiresAt = new Date(Date.now() + 300000);
      const attempts = 2;
      const maxAttempts = 5;
      const cooldownSeconds = 120;
      
      const otpRequest = new OtpRequest(
        email,
        expiresAt,
        attempts,
        maxAttempts,
        cooldownSeconds
      );
      
      expect(otpRequest.email).toBe(email);
      expect(otpRequest.expiresAt).toBe(expiresAt);
      expect(otpRequest.attempts).toBe(attempts);
      expect(otpRequest.maxAttempts).toBe(maxAttempts);
      expect(otpRequest.cooldownSeconds).toBe(cooldownSeconds);
    });
  });
  
  describe('isExpired', () => {
    it('should return true when OTP is expired', () => {
      const pastDate = new Date(Date.now() - 10000); // 10 seconds in the past
      const otpRequest = new OtpRequest('test@example.com', pastDate);
      
      expect(otpRequest.isExpired()).toBe(true);
    });
    
    it('should return false when OTP is not expired', () => {
      const futureDate = new Date(Date.now() + 300000); // 5 minutes in the future
      const otpRequest = new OtpRequest('test@example.com', futureDate);
      
      expect(otpRequest.isExpired()).toBe(false);
    });
  });
  
  describe('hasExceededMaxAttempts', () => {
    it('should return true when attempts equals maxAttempts', () => {
      const otpRequest = new OtpRequest(
        'test@example.com',
        new Date(),
        3, // attempts
        3  // maxAttempts
      );
      
      expect(otpRequest.hasExceededMaxAttempts()).toBe(true);
    });
    
    it('should return true when attempts exceeds maxAttempts', () => {
      const otpRequest = new OtpRequest(
        'test@example.com',
        new Date(),
        4, // attempts
        3  // maxAttempts
      );
      
      expect(otpRequest.hasExceededMaxAttempts()).toBe(true);
    });
    
    it('should return false when attempts is less than maxAttempts', () => {
      const otpRequest = new OtpRequest(
        'test@example.com',
        new Date(),
        2, // attempts
        3  // maxAttempts
      );
      
      expect(otpRequest.hasExceededMaxAttempts()).toBe(false);
    });
  });
  
  describe('remainingCooldownSeconds', () => {
    it('should return a value close to the cooldown seconds when just started', () => {
      const cooldownSeconds = 60;
      const otpRequest = new OtpRequest(
        'test@example.com',
        new Date(),
        0,
        3,
        cooldownSeconds
      );
      
      const remaining = otpRequest.remainingCooldownSeconds();
      
      // We allow some small tolerance for test execution time
      expect(remaining).toBeGreaterThanOrEqual(cooldownSeconds - 2);
      expect(remaining).toBeLessThanOrEqual(cooldownSeconds);
    });
    
    it('should use custom cooldown value', () => {
      const cooldownSeconds = 120;
      const otpRequest = new OtpRequest(
        'test@example.com',
        new Date(),
        0,
        3,
        cooldownSeconds
      );
      
      const remaining = otpRequest.remainingCooldownSeconds();
      
      // We allow some small tolerance for test execution time
      expect(remaining).toBeGreaterThanOrEqual(cooldownSeconds - 2);
      expect(remaining).toBeLessThanOrEqual(cooldownSeconds);
    });
  });
}); 