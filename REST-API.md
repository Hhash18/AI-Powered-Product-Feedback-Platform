# Requirement 4 — REST API (Node.js + Express)

Complete REST API implementation with authentication, validation, and consistent JSON responses.

---

## Consistent JSON Response Format

All endpoints return a standardized response structure:

```json
{
  "success": boolean,
  "data": object | array | null,
  "error": string | null,
  "message": string
}
```

### Response Examples

**Success Response (200/201):**

```json
{
  "success": true,
  "data": { "feedback": {...} },
  "error": null,
  "message": "Feedback retrieved successfully"
}
```

**Error Response (4xx/5xx):**

```json
{
    "success": false,
    "data": null,
    "error": "Failed to create feedback",
    "message": "Description must be between 20 and 5000 characters"
}
```

---

## Required API Endpoints

### 1. POST /api/feedback — Submit New Feedback (Public)

**Description:** Create new feedback with AI analysis

**Request:**

```bash
curl -X POST http://localhost:5000/api/feedback \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Login page is slow",
    "description": "The login page takes 5 seconds to load on initial visit. This is causing users to bounce.",
    "category": "Performance",
    "userEmail": "user@example.com",
    "userName": "John Doe",
    "userType": "Customer"
  }'
```

**Request Body:**

```typescript
{
  title: string (required, 1-200 chars)
  description: string (required, 20-5000 chars)
  category?: string (optional, enum)
  userEmail?: string
  userName?: string
  userType?: string (default: "Guest")
}
```

**Response (201):**

```json
{
    "success": true,
    "data": {
        "_id": "507f1f77bcf86cd799439011",
        "title": "Login page is slow",
        "description": "The login page takes 5 seconds to load...",
        "category": "Performance",
        "priority": "High",
        "sentiment": "Negative",
        "priorityScore": 7,
        "summary": "User reports slow login page affecting retention",
        "tags": ["performance", "ux", "bug"],
        "status": "New",
        "userEmail": "user@example.com",
        "userName": "John Doe",
        "userType": "Customer",
        "aiGenerated": true,
        "createdAt": "2024-03-30T10:30:00Z",
        "updatedAt": "2024-03-30T10:30:00Z"
    },
    "message": "Feedback submitted successfully"
}
```

**Error Response (400):**

```json
{
    "success": false,
    "error": "Description must be between 20 and 5000 characters",
    "message": "Invalid input"
}
```

**Status Codes:**

- `201` — Feedback created successfully
- `400` — Invalid input (missing/wrong format)
- `500` — Server error

---

### 2. GET /api/feedback — Get All Feedback (Public)

**Description:** Retrieve all feedback with optional filters and pagination

**Request:**

```bash
curl "http://localhost:5000/api/feedback?status=New&category=Bug&priority=High&sort=newest&page=1&limit=20"
```

**Query Parameters:**

```
status?: string (enum: New, Reviewed, In Progress, Completed, Archived)
category?: string (enum: Bug, Feature Request, Improvement, Documentation, Performance, Other)
priority?: string (enum: Critical, High, Medium, Low)
sort?: string (default: "newest" | "oldest")
page?: number (default: 1)
limit?: number (default: 20, max: 100)
```

**Response (200):**

```json
{
    "success": true,
    "data": {
        "feedback": [
            {
                "_id": "507f1f77bcf86cd799439011",
                "title": "Login page is slow",
                "description": "The login page takes 5 seconds...",
                "category": "Performance",
                "priority": "High",
                "sentiment": "Negative",
                "priorityScore": 7,
                "summary": "User reports slow login page",
                "tags": ["performance", "ux"],
                "status": "New",
                "userEmail": "user@example.com",
                "userName": "John Doe",
                "createdAt": "2024-03-30T10:30:00Z"
            }
        ],
        "pagination": {
            "total": 154,
            "page": 1,
            "limit": 20,
            "pages": 8
        }
    },
    "message": "Feedback retrieved successfully"
}
```

**Status Codes:**

- `200` — Success
- `500` — Server error

---

### 3. GET /api/feedback/:id — Get Single Feedback (Public)

**Description:** Retrieve a specific feedback item by ID

**Request:**

```bash
curl http://localhost:5000/api/feedback/507f1f77bcf86cd799439011
```

**Response (200):**

```json
{
    "success": true,
    "data": {
        "_id": "507f1f77bcf86cd799439011",
        "title": "Login page is slow",
        "description": "The login page takes 5 seconds to load...",
        "category": "Performance",
        "priority": "High",
        "sentiment": "Negative",
        "priorityScore": 7,
        "summary": "User reports slow login page affecting retention",
        "tags": ["performance", "ux", "bug"],
        "status": "New",
        "userEmail": "user@example.com",
        "userName": "John Doe",
        "userType": "Customer",
        "aiGenerated": true,
        "createdAt": "2024-03-30T10:30:00Z",
        "updatedAt": "2024-03-30T10:30:00Z"
    },
    "message": "Feedback retrieved successfully"
}
```

**Error Response (404):**

```json
{
    "success": false,
    "error": "Feedback not found",
    "message": "No feedback item with this ID"
}
```

**Status Codes:**

- `200` — Success
- `404` — Feedback not found
- `500` — Server error

---

### 4. PUT /api/feedback/:id — Update Feedback (Protected - Admin Only)

**Description:** Update feedback status, priority, or category

**Request:**

```bash
curl -X PUT http://localhost:5000/api/feedback/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer <jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "In Progress",
    "priority": "Critical",
    "category": "Bug"
  }'
```

**Request Body:**

```typescript
{
  status?: string (enum: New, Reviewed, In Progress, Completed, Archived)
  priority?: string (enum: Critical, High, Medium, Low)
  category?: string (enum: Bug, Feature Request, Improvement, Documentation, Performance, Other)
}
```

**Response (200):**

```json
{
    "success": true,
    "data": {
        "_id": "507f1f77bcf86cd799439011",
        "title": "Login page is slow",
        "description": "The login page takes 5 seconds...",
        "status": "In Progress",
        "priority": "Critical",
        "category": "Bug",
        "updatedAt": "2024-03-30T11:00:00Z"
    },
    "message": "Feedback updated successfully"
}
```

**Error Responses:**

- `400` — No fields provided for update
- `401` — Missing or invalid token
- `404` — Feedback not found
- `500` — Server error

**Status Codes:**

- `200` — Success
- `400` — Bad request
- `401` — Unauthorized
- `404` — Not found
- `500` — Server error

---

### 5. DELETE /api/feedback/:id — Delete Feedback (Protected - Admin Only)

**Description:** Delete a feedback item

**Request:**

```bash
curl -X DELETE http://localhost:5000/api/feedback/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer <jwt_token>"
```

**Response (200):**

```json
{
    "success": true,
    "data": {
        "deletedId": "507f1f77bcf86cd799439011"
    },
    "message": "Feedback deleted successfully"
}
```

**Error Responses:**

- `401` — Missing or invalid token
- `404` — Feedback not found
- `500` — Server error

**Status Codes:**

- `200` — Success
- `401` — Unauthorized
- `404` — Not found
- `500` — Server error

---

### 6. GET /api/feedback/summary — Get AI Trend Summary (Public)

**Description:** Generate AI-powered trend summary from recent feedback

**Request:**

```bash
curl http://localhost:5000/api/feedback/summary
```

**Response (200):**

```json
{
    "success": true,
    "data": {
        "summary": "Analysis of 50 recent feedback items reveals critical performance issues affecting 40% of users. Primary pain points include login page latency (7 mentions), dashboard slowness (5 mentions), and missing features (3 mentions). Sentiment is 60% negative, 25% neutral, 15% positive. Recommended actions: 1) Optimize login endpoint, 2) Implement caching for dashboard, 3) Roadmap planning for feature requests."
    },
    "message": "Trend summary generated successfully"
}
```

**Status Codes:**

- `200` — Success
- `500` — Server error

---

### 7. GET /api/feedback/analytics — Get Analytics (Protected - Admin Only)

**Description:** Retrieve analytics by status, category, priority, and sentiment

**Request:**

```bash
curl http://localhost:5000/api/feedback/analytics \
  -H "Authorization: Bearer <jwt_token>"
```

**Response (200):**

```json
{
    "success": true,
    "data": {
        "total": 154,
        "byStatus": {
            "New": 45,
            "Reviewed": 32,
            "In Progress": 28,
            "Completed": 35,
            "Archived": 14
        },
        "byCategory": {
            "Bug": 52,
            "Feature Request": 48,
            "Improvement": 31,
            "Performance": 18,
            "Documentation": 5
        },
        "byPriority": {
            "Critical": 8,
            "High": 35,
            "Medium": 78,
            "Low": 33
        },
        "bySentiment": {
            "Positive": 25,
            "Neutral": 58,
            "Negative": 71
        }
    },
    "message": "Analytics retrieved successfully"
}
```

**Status Codes:**

- `200` — Success
- `401` — Unauthorized
- `500` — Server error

---

### 8. GET /api/feedback/insights — Get AI Insights (Protected - Admin Only)

**Description:** Generate detailed AI insights from feedback

**Request:**

```bash
curl http://localhost:5000/api/feedback/insights \
  -H "Authorization: Bearer <jwt_token>"
```

**Response (200):**

```json
{
    "success": true,
    "data": {
        "insights": "Top Issues: 1) Performance problems account for 35% of feedback, 2) Bug reports concentrated in login/payment flows, 3) Users request real-time notifications (high demand). Sentiment Analysis: Negative feedback peaked after last update, positive feedback increasing for recent fixes. Recommendations: Prioritize performance optimization, implement notifications feature, improve payment UX."
    },
    "message": "Insights generated successfully"
}
```

**Status Codes:**

- `200` — Success
- `401` — Unauthorized
- `500` — Server error

---

### 9. POST /api/auth/login — Admin Login (Public)

**Description:** Authenticate admin and receive JWT token

**Request:**

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@feedpulse.com",
    "password": "admin123"
  }'
```

**Request Body:**

```typescript
{
    email: string(required);
    password: string(required);
}
```

**Response (200):**

```json
{
    "success": true,
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "email": "admin@feedpulse.com"
    },
    "message": "Login successful"
}
```

**Error Response (401):**

```json
{
    "success": false,
    "error": "Invalid email or password",
    "message": "Authentication failed"
}
```

**Demo Credentials:**

```
Email: admin@feedpulse.com
Password: admin123
```

**Status Codes:**

- `200` — Success
- `400` — Missing credentials
- `401` — Invalid credentials
- `500` — Server error

---

## Mongoose Schemas with Validation

### Feedback Schema

**File:** `backend/src/models/Feedback.ts`

```typescript
const feedbackSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 200,
        },
        description: {
            type: String,
            required: true,
            minlength: 20,
            maxlength: 5000,
        },
        category: {
            type: String,
            enum: ["Bug", "Feature Request", "Improvement", "Documentation", "Performance", "Other"],
            default: "Other",
        },
        priority: {
            type: String,
            enum: ["Low", "Medium", "High", "Critical"],
            default: "Medium",
        },
        sentiment: {
            type: String,
            enum: ["Positive", "Neutral", "Negative"],
            default: "Neutral",
        },
        priorityScore: {
            type: Number,
            min: 1,
            max: 10,
            default: 5,
        },
        summary: {
            type: String,
            maxlength: 500,
        },
        tags: {
            type: [String],
            default: [],
        },
        status: {
            type: String,
            enum: ["New", "Reviewed", "In Progress", "Completed", "Archived"],
            default: "New",
        },
        userEmail: String,
        userName: String,
        userType: {
            type: String,
            enum: ["Customer", "Employee", "Partner", "Guest"],
            default: "Guest",
        },
        aiGenerated: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true },
);
```

**Validations:**

- `title`: Required, 1-200 chars, trimmed
- `description`: Required, 20-5000 chars, trimmed
- `category`: Enum validation
- `priority`: Enum validation (Low, Medium, High, Critical)
- `sentiment`: Enum validation (Positive, Neutral, Negative)
- `priorityScore`: Integer 1-10
- `status`: Enum validation
- `timestamps`: Auto-created at save

---

## JWT Authentication Middleware

**File:** `backend/src/middleware/auth.ts`

```typescript
export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const token = req.headers.authorization?.replace("Bearer ", "") || req.headers["x-auth-token"];

    if (!token) {
        res.status(401).json({
            success: false,
            error: "No authentication token provided",
            message: "Authorization required",
        });
        return;
    }

    try {
        const decoded = jwt.verify(token as string, process.env.JWT_SECRET || "secret") as { id: string; email: string };
        req.admin = decoded;
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            error: "Invalid or expired token",
            message: "Authentication failed",
        });
    }
};
```

**Token Header Options:**

1. `Authorization: Bearer <token>`
2. `x-auth-token: <token>`

**Token Expiration:** 24 hours

---

## 4.4 Environment Variables

**File:** `backend/.env`

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/feedpulse
GEMINI_API_KEY=your_gemini_api_key_here
JWT_SECRET=your_jwt_secret_key_here_change_in_production
NODE_ENV=development
```

**Required Variables:**

- `JWT_SECRET` — Used to sign and verify JWT tokens
- `MONGODB_URI` — MongoDB connection string
- `GEMINI_API_KEY` — Google Gemini API key
- `PORT` — Server port (default: 5000)
- `NODE_ENV` — Environment (development/production)

---

## Input Validation & Sanitization

### Sanitization Rules

**All endpoints validate input:**

1. **Type Checking:**
    - Strings must be `typeof string`
    - Numbers must be valid numbers

2. **Trimming:**
    - All strings trimmed of whitespace
    - Empty strings rejected

3. **Length Validation:**
    - Title: 1-200 characters
    - Description: 20-5000 characters
    - Query strings validated

4. **Enum Validation:**
    - Status, category, priority checked against allowed values
    - Invalid enums rejected with 400 error

5. **Range Validation:**
    - Priority score: 1-10
    - Page: minimum 1
    - Limit: 1-100

**Example Validation (in FeedbackController.create):**

```typescript
// Type checking
if (!title || typeof title !== "string") {
    return res.status(400).json({
        success: false,
        error: "Title is required and must be a string",
        message: "Invalid input",
    });
}

// Length validation
if (titleTrimmed.length === 0 || titleTrimmed.length > 200) {
    return res.status(400).json({
        success: false,
        error: "Title must be between 1 and 200 characters",
        message: "Invalid input",
    });
}
```

---

## HTTP Status Codes

| Code    | Usage        | Example                                  |
| ------- | ------------ | ---------------------------------------- |
| **200** | Success      | GET feedback, Update feedback            |
| **201** | Created      | POST feedback                            |
| **400** | Bad request  | Missing required fields, Invalid format  |
| **401** | Unauthorized | Missing/invalid token, Wrong credentials |
| **404** | Not found    | Feedback ID doesn't exist                |
| **500** | Server error | Database error, API failure              |

---

## File Structure (Separated Concerns)

```
backend/src/
├── controllers/
│   ├── feedbackController.ts    (Business logic for feedback)
│   └── authController.ts        (Business logic for auth)
├── routes/
│   ├── feedbackRoutes.ts        (Feedback endpoint definitions)
│   └── authRoutes.ts            (Auth endpoint definitions)
├── middleware/
│   └── auth.ts                  (JWT verification middleware)
├── models/
│   └── Feedback.ts              (Mongoose schema & model)
├── services/
│   └── gemini.service.ts        (Gemini AI integration)
├── utils/
│   └── database.ts              (MongoDB connection)
└── server.ts                    (Express app setup & routes)
```

### Separation of Concerns

- **Controllers** — Handle business logic, validation, response formatting
- **Routes** — Define endpoints, map to controllers, apply middleware
- **Middleware** — Authentication, authorization, cross-cutting concerns
- **Models** — Data schema, database validation
- **Services** — External integrations (Gemini API)
- **Utils** — Database connection, helpers

---

## Protected vs Public Routes

### Public Routes (No Auth)

```
POST   /api/feedback           (Create feedback)
GET    /api/feedback           (List feedback)
GET    /api/feedback/:id       (Get single feedback)
GET    /api/feedback/summary   (AI summary)
POST   /api/auth/login         (Admin login)
```

### Protected Routes (Admin Only - Requires JWT)

```
PUT    /api/feedback/:id       (Update feedback)
DELETE /api/feedback/:id       (Delete feedback)
GET    /api/feedback/analytics (Get analytics)
GET    /api/feedback/insights  (Get AI insights)
```

---

## Error Handling

All errors follow consistent format:

```json
{
    "success": false,
    "error": "Descriptive error message",
    "message": "User-friendly message"
}
```

**Common Error Scenarios:**

| Scenario              | Status | Error Message                                        |
| --------------------- | ------ | ---------------------------------------------------- |
| Missing title         | 400    | "Title is required and must be a string"             |
| Description too short | 400    | "Description must be between 20 and 5000 characters" |
| No auth token         | 401    | "No authentication token provided"                   |
| Invalid token         | 401    | "Invalid or expired token"                           |
| Wrong credentials     | 401    | "Invalid email or password"                          |
| Feedback not found    | 404    | "Feedback not found"                                 |
| Database error        | 500    | "Failed to create feedback"                          |

---

## Implementation Files

- `backend/src/controllers/feedbackController.ts` — Feedback business logic
- `backend/src/controllers/authController.ts` — Auth business logic
- `backend/src/routes/feedbackRoutes.ts` — Feedback routes with auth
- `backend/src/routes/authRoutes.ts` — Auth routes
- `backend/src/middleware/auth.ts` — JWT authentication middleware
- `backend/src/server.ts` — App setup with routes
- `backend/.env` — Environment variables (JWT_SECRET added)
- `backend/package.json` — jsonwebtoken dependency added

---

## Summary

✅ **Requirement 4 Complete:**

- 9 REST API endpoints fully implemented
- Consistent JSON response format
- JWT authentication for protected routes
- Input validation & sanitization
- Proper HTTP status codes (200, 201, 400, 401, 404, 500)
- Mongoose schemas with validation
- Separated route, controller, and model files
- Environment variables for secrets
- Admin login with hardcoded credentials (for demo)
