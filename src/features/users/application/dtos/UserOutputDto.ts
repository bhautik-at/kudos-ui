export interface UserOutputDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  isVerified: boolean;
  role?: string;
}
