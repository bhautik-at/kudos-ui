# Backend API Requirements for User Management Feature

This document outlines the backend API endpoints required to support the User Management feature in the frontend application.

## API Endpoints

### 1. Get Paginated Users

**Endpoint:** `GET /api/users`

**Description:** Retrieves a paginated list of users with sorting options.

**Query Parameters:**

- `page` (number, required): Current page number (1-based)
- `pageSize` (number, required): Number of users per page
- `sortDirection` (string, optional): Direction of sorting, either 'asc' or 'desc', defaults to 'asc'

**Response:**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "user-id-1",
        "email": "user1@example.com",
        "firstName": "John",
        "lastName": "Doe",
        "teamName": "Engineering",
        "role": "TEAM_MEMBER",
        "isVerified": true
      }
      // More users...
    ],
    "totalItems": 50,
    "totalPages": 5,
    "currentPage": 1
  }
}
```

**Error Response:**

```json
{
  "success": false,
  "message": "Error message"
}
```

### 2. Update User Role

**Endpoint:** `PATCH /api/users/{userId}/role`

**Description:** Updates a user's role.

**Path Parameters:**

- `userId` (string, required): The ID of the user to update

**Request Body:**

```json
{
  "role": "TechLeader"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "user-id-1",
    "email": "user1@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "teamName": "Engineering",
    "role": "TechLeader",
    "isVerified": true
  }
}
```

**Error Response:**

```json
{
  "success": false,
  "message": "Error message"
}
```

### 3. Invite Users

**Endpoint:** `POST /api/users/invite`

**Description:** Invites multiple users to join the team by sending them invitation emails. Each user will be assigned the default "TEAM_MEMBER" role automatically.

**Request Body:**

```json
{
  "emails": ["user1@example.com", "user2@example.com", "user3@example.com"]
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "invitedCount": 3
  }
}
```

**Error Response:**

```json
{
  "success": false,
  "message": "Error message"
}
```

### 4. Delete User

**Endpoint:** `DELETE /api/users/{userId}`

**Description:** Removes a user from the system.

**Path Parameters:**

- `userId` (string, required): The ID of the user to delete

**Response:**

```json
{
  "success": true,
  "data": {
    "message": "User successfully deleted"
  }
}
```

**Error Response:**

```json
{
  "success": false,
  "message": "Error message"
}
```

## Implementation Guidelines

### Data Models

#### User Model

```typescript
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  teamName: string; // New field for team name
  role: UserRole;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

enum UserRole {
  TEAM_MEMBER = 'TEAM_MEMBER',
  TEAM_LEAD = 'TechLeader',
}
```

### Business Rules

1. **User Invitations**:

   - When users are invited, the system should send an email invitation
   - Users are assigned the "TEAM_MEMBER" role by default
   - The system should validate email addresses before sending invitations
   - Duplicate emails should be handled gracefully (either skip or return appropriate error)

2. **Role Management**:

   - Users can have one of two roles: "TEAM_MEMBER" or "TEAM_LEAD"
   - Only users with appropriate permissions can change other users' roles

3. **Sorting**:

   - The API should support sorting by firstName (ascending/descending)
   - Default sorting is by firstName in ascending order

4. **Pagination**:

   - The API should return pagination metadata (totalItems, totalPages, currentPage)
   - Default page size should be configurable, with a reasonable default value (e.g., 10)

5. **User Deletion**:
   - Only users with appropriate permissions can delete other users
   - Deletion should be logical (soft delete) rather than physical
   - Deleted users should not appear in search results

### Email Templates

#### Invitation Email Template

Subject: You've been invited to join the team on Kudos

```
Hello,

You've been invited to join the team on Kudos! Kudos is a platform for [brief description].

Click the link below to accept the invitation and create your account:

[INVITATION_LINK]

This invitation will expire in 7 days.

Thank you,
The Kudos Team
```

### Error Handling

The API should return appropriate HTTP status codes:

- 200: Success
- 400: Bad Request (invalid parameters)
- 401: Unauthorized
- 403: Forbidden (insufficient permissions)
- 404: Not Found
- 500: Server Error

All error responses should follow the consistent format shown in the error responses above.

## Security Considerations

1. **Authentication**:

   - All API endpoints should require authentication
   - Use JWT or session-based authentication

2. **Authorization**:

   - Implement role-based access control (RBAC)
   - Only users with admin or team lead roles should be able to:
     - Invite new users
     - Update user roles

3. **Input Validation**:

   - Validate all input parameters, especially email addresses for invitations
   - Use parameterized queries to prevent SQL injection

4. **Rate Limiting**:
   - Implement rate limiting on the invitation endpoint to prevent abuse

## Testing Requirements

1. **Unit Tests**:

   - Test validation logic for all endpoints
   - Test business logic for user role management

2. **Integration Tests**:

   - Test the complete flow of user invitation, including email sending
   - Test pagination and sorting functionality

3. **Security Tests**:
   - Test authentication and authorization constraints
   - Test rate limiting functionality
