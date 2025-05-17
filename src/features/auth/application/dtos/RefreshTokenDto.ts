export interface RefreshTokenInputDto {}

export interface RefreshTokenOutputDto {
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
