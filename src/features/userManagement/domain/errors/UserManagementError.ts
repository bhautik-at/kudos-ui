export class UserManagementError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UserManagementError';
  }
}

export class UserInvitationError extends UserManagementError {
  constructor(message: string = 'Failed to invite users') {
    super(message);
    this.name = 'UserInvitationError';
  }
}

export class UserRoleUpdateError extends UserManagementError {
  constructor(message: string = 'Failed to update user role') {
    super(message);
    this.name = 'UserRoleUpdateError';
  }
}
