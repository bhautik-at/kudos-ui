# Analytics Dashboard Implementation Plan

## Overview

The analytics dashboard will provide insights into how kudos are being used across the organization. It will display the top recognized individuals/teams and trending words/categories, with options to filter by time periods.

## Required APIs

### 1. Top Recognized API

**Endpoint:** `GET /api/analytics/top-recognized`

**Query Parameters:**

- `period_type`: "weekly", "monthly", "quarterly", "yearly"
- `period_value`: The specific period (week number, month number, quarter number, or year)
- `limit`: Number of results to return (default 10)
- `organization_id`: Organization ID
- `type`: "individuals" or "teams" (which type of entity to analyze)

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "name": "string",
      "count": "number",
      "percentage": "number"
    }
  ],
  "period": {
    "type": "string",
    "value": "string|number",
    "start_date": "string (ISO date)",
    "end_date": "string (ISO date)"
  },
  "total_kudos": "number"
}
```

### 2. Trending Categories API

**Endpoint:** `GET /api/analytics/trending-categories`

**Query Parameters:**

- `period_type`: "weekly", "monthly", "quarterly", "yearly"
- `period_value`: The specific period
- `limit`: Number of results to return (default 5)
- `organization_id`: Organization ID

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "name": "string",
      "count": "number",
      "percentage": "number"
    }
  ],
  "period": {
    "type": "string",
    "value": "string|number",
    "start_date": "string (ISO date)",
    "end_date": "string (ISO date)"
  },
  "total_kudos": "number"
}
```

### 3. Trending Keywords API

**Endpoint:** `GET /api/analytics/trending-keywords`

**Query Parameters:**

- `period_type`: "weekly", "monthly", "quarterly", "yearly"
- `period_value`: The specific period
- `limit`: Number of results to return (default 10)
- `organization_id`: Organization ID

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "keyword": "string",
      "count": "number",
      "percentage": "number"
    }
  ],
  "period": {
    "type": "string",
    "value": "string|number",
    "start_date": "string (ISO date)",
    "end_date": "string (ISO date)"
  },
  "total_analyzed_kudos": "number"
}
```

## Implementation Steps

### 1. Domain Layer

1. Create necessary DTOs for analytics responses:

   - `TopRecognizedResponseDto`
   - `TrendingCategoriesResponseDto`
   - `TrendingKeywordsResponseDto`

2. Define interfaces for analytics services:
   - `AnalyticsService` with methods for each type of analysis

### 2. Repository Layer

1. Create `AnalyticsRepository` interface with methods for each analysis type:

   - `getTopRecognized(params)`
   - `getTrendingCategories(params)`
   - `getKeywordStats(params)`

2. Implement SQL queries for each analysis in `AnalyticsRepositoryImpl`:
   - For top recognized: GROUP BY recipient_id or team_id and COUNT
   - For trending categories: GROUP BY category_id and COUNT
   - For keywords: Extract words from message text, normalize, and count occurrences

### 3. Services Layer

1. Create utility services:

   - `PeriodCalculatorService` to convert period types and values to date ranges
   - `KeywordExtractorService` to process messages and extract meaningful keywords

2. Implement `AnalyticsServiceImpl` that uses the repository and handles business logic

### 4. Application Layer (Use Cases)

Create use cases for each analytics endpoint:

1. `GetTopRecognizedUseCase`
2. `GetTrendingCategoriesUseCase`
3. `GetTrendingKeywordsUseCase`

### 5. Presentation Layer

1. Create validation for analytics requests using Joi
2. Implement controller methods in `AnalyticsController`
3. Set up routes in `analyticsRoutes.ts`
4. Add the router to the main app

### 6. Testing

1. Unit tests for services and use cases
2. Integration tests for endpoints
3. Performance testing for large datasets

## Technical Considerations

### Database Optimization

For better performance on large datasets:

1. Consider adding relevant indexes on `created_at`, `recipient_id`, `team_id`, and `category_id`
2. For frequent analytics queries, consider materialized views or pre-calculated aggregations
3. Implement caching for common queries

### Text Analysis for Keywords

For keyword extraction:

1. Remove common stop words (e.g., "the", "and", "is")
2. Apply stemming or lemmatization to normalize word forms
3. Consider using a natural language processing library
4. Maintain a custom dictionary of business-relevant terms

### Period Calculation

Implement robust date range calculation for different period types:

1. Weekly: Calculate start/end dates based on ISO week numbers
2. Monthly: Handle different month lengths
3. Quarterly: Map quarters to their respective month ranges
4. Yearly: January 1st to December 31st

## Timeline Estimate

1. Database and repository implementation: 2-3 days
2. Services and use cases: 2-3 days
3. Controllers and routes: 1-2 days
4. Testing and optimization: 2-3 days

Total estimated time: 7-11 days

# Kudos Analytics API Documentation

This document describes the Analytics API endpoints, request parameters, and response formats.

## Base URL

All endpoints are relative to the base API URL: `/api/analytics`

## Common Query Parameters

All analytics endpoints accept these base parameters:

| Parameter         | Type          | Required | Description                                                          |
| ----------------- | ------------- | -------- | -------------------------------------------------------------------- |
| `period_type`     | string        | Yes      | Time period type: "weekly", "monthly", "quarterly", "yearly"         |
| `period_value`    | number/string | Yes      | Specific period (week number, month number, quarter number, or year) |
| `organization_id` | string        | Yes      | Organization ID                                                      |
| `limit`           | number        | No       | Number of results to return (varies by endpoint)                     |

## 1. Top Recognized API

Get the most recognized individuals or teams in an organization.

### Endpoint

```
GET /api/analytics/top-recognized
```

### Request Parameters

| Parameter                | Type   | Required | Default | Description                                      |
| ------------------------ | ------ | -------- | ------- | ------------------------------------------------ |
| `type`                   | string | Yes      | -       | Entity type to analyze: "individuals" or "teams" |
| `limit`                  | number | No       | 10      | Maximum number of results to return (1-100)      |
| _plus common parameters_ |        |          |         |                                                  |

### Response Format

```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "name": "string",
      "count": "number",
      "percentage": "number"
    }
  ],
  "period": {
    "type": "string",
    "value": "string|number",
    "start_date": "string (ISO date)",
    "end_date": "string (ISO date)"
  },
  "total_kudos": "number"
}
```

## 2. Trending Categories API

Get the most frequently used kudo categories in an organization.

### Endpoint

```
GET /api/analytics/trending-categories
```

### Request Parameters

| Parameter                | Type   | Required | Default | Description                                 |
| ------------------------ | ------ | -------- | ------- | ------------------------------------------- |
| `limit`                  | number | No       | 5       | Maximum number of results to return (1-100) |
| _plus common parameters_ |        |          |         |                                             |

### Response Format

```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "name": "string",
      "count": "number",
      "percentage": "number"
    }
  ],
  "period": {
    "type": "string",
    "value": "string|number",
    "start_date": "string (ISO date)",
    "end_date": "string (ISO date)"
  },
  "total_kudos": "number"
}
```

## 3. Trending Keywords API

Get the most frequently occurring keywords in kudos messages.

### Endpoint

```
GET /api/analytics/trending-keywords
```

### Request Parameters

| Parameter                | Type   | Required | Default | Description                                 |
| ------------------------ | ------ | -------- | ------- | ------------------------------------------- |
| `limit`                  | number | No       | 10      | Maximum number of results to return (1-100) |
| _plus common parameters_ |        |          |         |                                             |

### Response Format

```json
{
  "success": true,
  "data": [
    {
      "keyword": "string",
      "count": "number",
      "percentage": "number"
    }
  ],
  "period": {
    "type": "string",
    "value": "string|number",
    "start_date": "string (ISO date)",
    "end_date": "string (ISO date)"
  },
  "total_analyzed_kudos": "number"
}
```

## Period Structure

The `period` object in all responses contains:

| Field        | Type          | Description                                             |
| ------------ | ------------- | ------------------------------------------------------- |
| `type`       | string        | Period type: "weekly", "monthly", "quarterly", "yearly" |
| `value`      | string/number | The specific period value as provided in the request    |
| `start_date` | string        | Beginning of the time period (ISO date string)          |
| `end_date`   | string        | End of the time period (ISO date string)                |
