export interface KudoProps {
  id?: string;
  recipientId: string;
  senderId: string;
  teamId: string;
  categoryId: string;
  message: string;
  organizationId: string;
  createdAt?: Date;
}

export class Kudo {
  readonly id?: string;
  readonly recipientId: string;
  readonly senderId: string;
  readonly teamId: string;
  readonly categoryId: string;
  readonly message: string;
  readonly organizationId: string;
  readonly createdAt: Date;

  constructor(props: KudoProps) {
    this.id = props.id;
    this.recipientId = props.recipientId;
    this.senderId = props.senderId;
    this.teamId = props.teamId;
    this.categoryId = props.categoryId;
    this.message = props.message;
    this.organizationId = props.organizationId;
    this.createdAt = props.createdAt || new Date();

    this.validate();
  }

  private validate(): void {
    if (!this.recipientId) {
      throw new Error('Recipient is required');
    }
    if (!this.senderId) {
      throw new Error('Sender is required');
    }
    if (!this.teamId) {
      throw new Error('Team is required');
    }
    if (!this.categoryId) {
      throw new Error('Category is required');
    }
    if (!this.message || this.message.trim().length === 0) {
      throw new Error('Message is required');
    }
    if (!this.organizationId) {
      throw new Error('Organization is required');
    }
  }
}
