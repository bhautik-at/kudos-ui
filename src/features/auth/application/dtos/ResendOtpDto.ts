export interface ResendOtpInputDto {
  email: string;
}

export interface ResendOtpOutputDto {
  success: boolean;
  message: string;
  attemptsRemaining?: number;
  cooldownSeconds?: number;
}
