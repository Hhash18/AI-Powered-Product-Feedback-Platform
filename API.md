# FeedPulse API Documentation

## Base URL
```
http://localhost:5000/api
```

## Health Check

### GET /health
Check if the server is running.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-03-29T12:00:00.000Z",
  "service": "FeedPulse Backend"
}
```

---

## Feedback Endpoints

### POST /feedback
Submit new feedback. AI will automatically categorize and prioritize it.

**Request Body:**
```json
{
  "title": "Feedback Title",
  "description": "Detailed feedback description",
  "userEmail": "user@example.com",
  "userType": "User"
}
```

**Parameters:**
- `title` (string, required) - Brief title for the feedback
- `description` (string, required) - Detailed description
- `userEmail` (string, optional) - User's email
- `userType` (string, optional) - Type of user (User, Admin, Guest)

**Response (201):**
```json
{
  "message": "Feedback submitted successfully",
  "feedback": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Feedback Title",
    "description": "Detailed description",
    "category": "Feature Request",
    "priority": "High",
    "summary": "AI-generated summary...",
    "userEmail": "user@example.com",
    "userType": "User",
    "status": "New",
    "aiGenerated": true,
    "createdAt": "2024-03-29T12:00:00.000Z",
    "updatedAt": "2024-03-29T12:00:00.000Z"
  }
}
```

**Error (400):**
```json
{
  "error": "Title and description are required"
}
```

---

### GET /feedback
Get all feedback with optional filters.

**Query Parameters:**
- `status` (string, optional) - Filter by status (New, Reviewed, In Progress, Completed, Archived)
- `category` (string, optional) - Filter by category (Bug, Feature Request, Improvement, Documentation, Performance, Other)
- `priority` (string, optional) - Filter by priority (Low, Medium, High, Critical)
- `sort` (string, optional) - Sort order (newest or oldest)

**Example:**
```
GET /feedback?status=New&category=Bug&priority=Critical&sort=newest
```

**Response (200):**
```json
{
  "total": 10,
  "feedback": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Login button not working",
      "description": "...",
      "category": "Bug",
      "priority": "Critical",
      "status": "New",
      "summary": "...",
      "createdAt": "2024-03-29T12:00:00.000Z",
      "updatedAt": "2024-03-29T12:00:00.000Z"
    }
  ]
}
```

---

### GET /feedback/:id
Get a specific feedback item by ID.

**Parameters:**
- `id` (string, required) - MongoDB ObjectId

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "Feedback Title",
  "description": "...",
  "category": "Bug",
  "priority": "High",
  "status": "New",
  "summary": "...",
  "userEmail": "user@example.com",
  "aiGenerated": true,
  "createdAt": "2024-03-29T12:00:00.000Z",
  "updatedAt": "2024-03-29T12:00:00.000Z"
}
```

**Error (404):**
```json
{
  "error": "Feedback not found"
}
```

---

### PUT /feedback/:id
Update feedback status, priority, or category.

**Parameters:**
- `id` (string, required) - MongoDB ObjectId

**Request Body:**
```json
{
  "status": "In Progress",
  "priority": "Medium",
  "category": "Feature Request"
}
```

**Response (200):**
```json
{
  "message": "Feedback updated successfully",
  "feedback": {
    "_id": "507f1f77bcf86cd799439011",
    "status": "In Progress",
    "priority": "Medium",
    "category": "Feature Request",
    "updatedAt": "2024-03-29T12:00:00.000Z"
  }
}
```

---

### DELETE /feedback/:id
Delete a feedback item.

**Parameters:**
- `id` (string, required) - MongoDB ObjectId

**Response (200):**
```json
{
  "message": "Feedback deleted successfully"
}
```

**Error (404):**
```json
{
  "error": "Feedback not found"
}
```

---

## Analytics Endpoints

### GET /feedback/analytics
Get feedback analytics and statistics.

**Response (200):**
```json
{
  "total": 42,
  "byStatus": {
    "New": 15,
    "Reviewed": 10,
    "In Progress": 8,
    "Completed": 7,
    "Archived": 2
  },
  "byCategory": {
    "Bug": 12,
    "Feature Request": 18,
    "Improvement": 8,
    "Documentation": 2,
    "Performance": 1,
    "Other": 1
  },
  "byPriority": {
    "Critical": 3,
    "High": 12,
    "Medium": 18,
    "Low": 9
  }
}
```

---

### GET /feedback/insights
Generate AI insights from all feedback.

**Response (200):**
```json
{
  "insights": "Analysis of the feedback data shows that the most common complaint is about login functionality (3 mentions across different contexts). Users are requesting better mobile support with 5 direct feature requests. Documentation appears to be an area that could be improved based on 2 feedback items. Overall, the feedback suggests prioritizing bug fixes for authentication, followed by mobile optimization features."
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Title and description are required"
}
```

### 404 Not Found
```json
{
  "error": "Feedback not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Failed to create feedback",
  "details": "Error message here"
}
```

---

## Example Usage with curl

### Submit Feedback
```bash
curl -X POST http://localhost:5000/api/feedback \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Feedback",
    "description": "This is a test feedback",
    "userEmail": "test@example.com"
  }'
```

### Get All Feedback
```bash
curl http://localhost:5000/api/feedback
```

### Get Filtered Feedback
```bash
curl "http://localhost:5000/api/feedback?status=New&priority=High"
```

### Get Analytics
```bash
curl http://localhost:5000/api/feedback/analytics
```

### Get Insights
```bash
curl http://localhost:5000/api/feedback/insights
```

### Update Feedback
```bash
curl -X PUT http://localhost:5000/api/feedback/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "In Progress",
    "priority": "High"
  }'
```

### Delete Feedback
```bash
curl -X DELETE http://localhost:5000/api/feedback/507f1f77bcf86cd799439011
```

---

## Rate Limiting

No rate limiting is currently implemented. Feel free to make requests as needed.

---

## Authentication

The API does not currently require authentication. For production use, consider adding:
- JWT tokens
- API keys
- Role-based access control

---

## CORS

The API accepts requests from all origins. For production, configure CORS in `backend/src/server.ts`:

```typescript
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
}));
```

---

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Server Error

For more help, refer to the SETUP.md file.
