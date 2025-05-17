export interface LoginInputDto {
  email: string;
}

export interface LoginOutputDto {
  success: boolean;
  email: string;
  message: string;
}
