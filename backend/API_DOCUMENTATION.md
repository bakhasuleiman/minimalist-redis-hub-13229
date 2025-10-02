# Minimalist Redis Hub Backend API

## Base URL
```
http://localhost:3001/api
```

## Authentication
All API endpoints (except auth) require a Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

## API Endpoints

### Authentication

#### POST /auth/register
Register a new user
```json
{
  "name": "User Name",
  "email": "user@example.com", 
  "password": "password123"
}
```

#### POST /auth/login
Login user
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### GET /auth/profile
Get current user profile (requires auth)

### Tasks

#### GET /tasks
Get all tasks accessible to user

#### POST /tasks
Create new task
```json
{
  "title": "Task Title",
  "description": "Task Description",
  "privacy": "PRIVATE|PUBLIC|SPECIFIC",
  "sharedWith": ["email1@example.com", "email2@example.com"]
}
```

#### PUT /tasks/:id
Update task

#### DELETE /tasks/:id
Delete task

### Notes

#### GET /notes
Get all notes accessible to user

#### GET /notes/:id
Get specific note

#### POST /notes
Create new note
```json
{
  "title": "Note Title",
  "content": "Note Content",
  "privacy": "PRIVATE|PUBLIC|SPECIFIC",
  "sharedWith": ["email1@example.com"]
}
```

#### PUT /notes/:id
Update note

#### DELETE /notes/:id
Delete note

### Goals

#### GET /goals
Get all goals accessible to user

#### GET /goals/:id
Get specific goal

#### POST /goals
Create new goal
```json
{
  "title": "Goal Title",
  "description": "Goal Description",
  "progress": 0,
  "deadline": "2025-12-31T00:00:00Z",
  "privacy": "PRIVATE|PUBLIC|SPECIFIC",
  "sharedWith": ["email1@example.com"]
}
```

#### PUT /goals/:id
Update goal

#### DELETE /goals/:id
Delete goal

### Finance

#### GET /finance
Get all transactions and balance

#### GET /finance/stats
Get financial statistics

#### GET /finance/:id
Get specific transaction

#### POST /finance
Create new transaction
```json
{
  "title": "Transaction Title",
  "amount": 1000.50,
  "type": "INCOME|EXPENSE",
  "privacy": "PRIVATE|PUBLIC"
}
```

#### PUT /finance/:id
Update transaction

#### DELETE /finance/:id
Delete transaction

### Articles

#### GET /articles
Get all articles accessible to user
Query params: `?published=true|false`

#### GET /articles/:id
Get specific article

#### POST /articles
Create new article
```json
{
  "title": "Article Title",
  "content": "Article Content",
  "published": false,
  "privacy": "PRIVATE|PUBLIC|SPECIFIC",
  "sharedWith": ["email1@example.com"]
}
```

#### PUT /articles/:id
Update article

#### DELETE /articles/:id
Delete article

### Activity Feed

#### GET /feed
Get activity feed for user

#### GET /feed/user
Get user's own activity
Query params: `?type=TASK|NOTE|GOAL|TRANSACTION|ARTICLE&limit=50&offset=0`

#### GET /feed/stats
Get activity statistics

## Privacy Levels

- **PRIVATE**: Only the creator can see
- **PUBLIC**: All users can see
- **SPECIFIC**: Only creator and specified users can see

## Response Format

All responses are in JSON format:
```json
{
  "data": "...",
  "message": "Success message",
  "error": "Error message if applicable"
}
```

## Error Handling

- 400: Bad Request (validation errors)
- 401: Unauthorized (invalid/missing token)
- 404: Not Found
- 500: Internal Server Error

## Activity Logging

All user actions are automatically logged to the activity feed:
- User registration/login
- Task creation/completion/updates
- Note creation/updates
- Goal creation/progress updates
- Transaction additions
- Article creation/publishing