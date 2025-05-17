export class OtpRequest {
  constructor(
    public readonly email: string,
    public readonly expiresAt: Date,
    public readonly attempts: number = 0,
    public readonly maxAttempts: number = 3,
    public readonly cooldownSeconds: number = 60
  ) {}

  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  hasExceededMaxAttempts(): boolean {
    return this.attempts >= this.maxAttempts;
  }

  remainingCooldownSeconds(): number {
    const now = new Date();
    const cooldownEnd = new Date(now.getTime() + this.cooldownSeconds * 1000);
    const diff = cooldownEnd.getTime() - now.getTime();
    return Math.max(0, Math.floor(diff / 1000));
  }
}
