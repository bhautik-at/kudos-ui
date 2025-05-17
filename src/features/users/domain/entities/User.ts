export interface UserProps {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isVerified?: boolean;
}

export class User {
  readonly id: string;
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly isVerified: boolean;

  constructor(props: UserProps) {
    this.id = props.id;
    this.email = props.email;
    this.firstName = props.firstName;
    this.lastName = props.lastName;
    this.isVerified = props.isVerified ?? false;
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
