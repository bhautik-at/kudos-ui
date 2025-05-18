export interface UpdateTeamInputDto {
  id: string;
  name: string;
  members?: string[]; // Optional array of member user IDs
}
