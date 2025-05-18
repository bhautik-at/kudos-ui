export interface UpdateKudoInputDto {
  id: string;
  recipientId?: string;
  teamId?: string;
  categoryId?: string;
  message?: string;
  organizationId: string;
}
