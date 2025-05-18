export interface VerifyOtpInputDto {
  email: string;
  otp: string;
}

export interface VerifyOtpOutputDto {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}
