export interface TeamProps {
  id?: string;
  name: string;
  organizationId: string;
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
  members?: string[]; // Array of user IDs as team members
}

export class Team {
  readonly id?: string;
  readonly name: string;
  readonly organizationId: string;
  readonly createdBy: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly members?: string[];

  constructor(props: TeamProps) {
    this.id = props.id;
    this.name = props.name;
    this.organizationId = props.organizationId;
    this.createdBy = props.createdBy;
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
    this.members = props.members || [];

    this.validate();
  }

  private validate(): void {
    if (!this.name || this.name.trim().length === 0) {
      throw new Error('Team name is required');
    }

    if (this.name.trim().length < 2) {
      throw new Error('Team name must be at least 2 characters long');
    }

    if (!this.organizationId) {
      throw new Error('Organization ID is required');
    }

    if (!this.createdBy) {
      throw new Error('Creator ID is required');
    }
  }
}
