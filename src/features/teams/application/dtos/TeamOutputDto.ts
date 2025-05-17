export interface TeamOutputDto {
  id: string;
  name: string;
  organizationId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  members?: string[]; // Optional array of member user IDs
}
