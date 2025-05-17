# Kudos Backend API Specification

This document describes the backend API endpoints required to support the Kudos feature.

## Base URL

```
/api
```

## Authentication

All API endpoints require authentication via Bearer token:

```
Authorization: Bearer <token>
```

## Endpoints

### 1. Create Kudo

Create a new kudo from a sender to a recipient.

**Endpoint:** `POST /api/kudos`

**Request Body:**

```json
{
  "recipient_id": "string",
  "team_id": "string",
  "category_id": "string",
  "message": "string",
  "organization_id": "string"
}
```

**Response:**

```json
{
  "id": "string",
  "recipient_id": "string",
  "recipient_name": "string",
  "sender_id": "string",
  "sender_name": "string",
  "team_id": "string",
  "team_name": "string",
  "category_id": "string",
  "category_name": "string",
  "message": "string",
  "organization_id": "string",
  "created_at": "string (ISO date)"
}
```

### 2. Update Kudo

Update an existing kudo. Only the user who created the kudo can update it.

**Endpoint:** `PUT /api/kudos/:id`

**Request Body:**

```json
{
  "recipient_id": "string",
  "team_id": "string",
  "category_id": "string",
  "message": "string"
}
```

**Response:**

```json
{
  "id": "string",
  "recipient_id": "string",
  "recipient_name": "string",
  "sender_id": "string",
  "sender_name": "string",
  "team_id": "string",
  "team_name": "string",
  "category_id": "string",
  "category_name": "string",
  "message": "string",
  "organization_id": "string",
  "created_at": "string (ISO date)",
  "updated_at": "string (ISO date)"
}
```

**Error Response (403):**

```json
{
  "success": false,
  "message": "You are not authorized to update this kudo"
}
```

### 3. Delete Kudo

Delete an existing kudo. Only the user who created the kudo can delete it.

**Endpoint:** `DELETE /api/kudos/:id`

**Response (Success - 200):**

```json
{
  "success": true,
  "message": "Kudo deleted successfully"
}
```

**Error Response (403):**

```json
{
  "success": false,
  "message": "You are not authorized to delete this kudo"
}
```

### 4. Get Kudos

Get a list of kudos with optional filtering.

**Endpoint:** `GET /api/kudos`

**Query Parameters:**

- `recipient_id` (optional): Filter by recipient ID
- `team_id` (optional): Filter by team ID
- `category_id` (optional): Filter by category ID
- `page` (optional): Page number for pagination
- `limit` (optional): Number of results per page

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "recipient_id": "string",
      "recipient_name": "string",
      "sender_id": "string",
      "sender_name": "string",
      "team_id": "string",
      "team_name": "string",
      "category_id": "string",
      "category_name": "string",
      "message": "string",
      "organization_id": "string",
      "created_at": "string (ISO date)"
    }
  ],
  "pagination": {
    "total": "number",
    "pages": "number",
    "current_page": "number",
    "limit": "number"
  }
}
```

### 5. Get Kudo by ID

Get a specific kudo by its ID.

**Endpoint:** `GET /api/kudos/:id`

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "string",
    "recipient_id": "string",
    "recipient_name": "string",
    "sender_id": "string",
    "sender_name": "string",
    "team_id": "string",
    "team_name": "string",
    "category_id": "string",
    "category_name": "string",
    "message": "string",
    "organization_id": "string",
    "created_at": "string (ISO date)"
  }
}
```
