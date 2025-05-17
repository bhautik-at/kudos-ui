export interface UserProps {
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  role?: string;
  isVerified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class User {
  readonly id?: string;
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly role: string;
  readonly isVerified: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(props: UserProps) {
    this.id = props.id;
    this.email = props.email;
    this.firstName = props.firstName;
    this.lastName = props.lastName;
    this.role = props.role || 'Member'; // Default role is Member
    this.isVerified = props.isVerified || false;
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
