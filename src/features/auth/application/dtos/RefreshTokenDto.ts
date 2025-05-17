export interface RefreshTokenInputDto {}

export interface RefreshTokenOutputDto {
  success: boolean;
  message: string;
  token?: string;
  user?: any;
}
