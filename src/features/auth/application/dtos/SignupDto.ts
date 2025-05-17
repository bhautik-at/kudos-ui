export interface SignupInputDto {
  email: string;
  firstName: string;
  lastName: string;
}

export interface SignupOutputDto {
  success: boolean;
  email: string;
  message: string;
}
