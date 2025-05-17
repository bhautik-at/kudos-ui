export interface TeamMemberOutputDto {
  id: string;
  teamId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface TeamMemberWithUserInfoOutputDto extends TeamMemberOutputDto {
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  role: string;
}
