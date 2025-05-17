import { UserRole } from './UserRole';

export interface UserManagementUserProps {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  teamName?: string;
  role: UserRole;
  isVerified?: boolean;
}

export class UserManagementUser {
  readonly id: string;
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly teamName: string;
  readonly role: UserRole;
  readonly isVerified: boolean;

  constructor(props: UserManagementUserProps) {
    this.id = props.id;
    this.email = props.email;
    this.firstName = props.firstName;
    this.lastName = props.lastName;
    this.teamName = props.teamName || '';
    this.role = props.role;
    this.isVerified = props.isVerified ?? false;
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
