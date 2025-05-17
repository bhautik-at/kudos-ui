export interface TeamMemberProps {
  id?: string;
  teamId: string;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class TeamMember {
  readonly id?: string;
  readonly teamId: string;
  readonly userId: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(props: TeamMemberProps) {
    this.id = props.id;
    this.teamId = props.teamId;
    this.userId = props.userId;
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();

    this.validate();
  }

  private validate(): void {
    if (!this.teamId) {
      throw new Error('Team ID is required');
    }

    if (!this.userId) {
      throw new Error('User ID is required');
    }
  }
}
