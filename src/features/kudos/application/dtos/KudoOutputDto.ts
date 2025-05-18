export interface KudoOutputDto {
  id: string;
  recipientId: string;
  recipientName: string;
  senderId: string;
  senderName: string;
  teamId: string;
  teamName: string;
  categoryId: string;
  categoryName: string;
  message: string;
  organizationId: string;
  createdAt: string;
  updatedAt?: string;
}
