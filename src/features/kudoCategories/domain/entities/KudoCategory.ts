import { InvalidKudoCategoryError } from '../errors/InvalidKudoCategoryError';

interface KudoCategoryProps {
  id?: string;
  name: string;
  organizationId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class KudoCategory {
  readonly id?: string;
  readonly name: string;
  readonly organizationId: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(props: KudoCategoryProps) {
    this.id = props.id;
    this.name = props.name;
    this.organizationId = props.organizationId;
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();

    this.validate();
  }

  private validate(): void {
    if (!this.name || this.name.trim().length === 0) {
      throw new InvalidKudoCategoryError('Category name cannot be empty');
    }

    if (this.name.length > 50) {
      throw new InvalidKudoCategoryError('Category name cannot exceed 50 characters');
    }

    if (!this.organizationId) {
      throw new InvalidKudoCategoryError('Organization ID is required');
    }
  }
}
