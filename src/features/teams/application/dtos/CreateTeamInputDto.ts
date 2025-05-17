export interface CreateTeamInputDto {
  name: string;
  organizationId: string;
  createdBy: string;
  members?: string[]; // Array of user IDs to add as team members
}
