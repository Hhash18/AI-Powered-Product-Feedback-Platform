# FeedPulse Setup & Development Guide

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Google Gemini API key

### Step 1: Get Your API Keys

**Google Gemini API:**

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a new API key
3. Copy it and save for later

### Step 2: Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Create .env file (or update the existing one)
# Add your GEMINI_API_KEY

# Start MongoDB locally (if using local MongoDB)
# MongoDB should be running on mongodb://localhost:27017

# Run the backend
npm run dev
```

The backend will start on `http://localhost:5000`

### Step 3: Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will start on `http://localhost:3000`

### Step 4: Test the Application

1. Go to [http://localhost:3000](http://localhost:3000)
2. Submit some feedback
3. View the dashboard at [http://localhost:3000/dashboard](http://localhost:3000/dashboard)

## Project Structure

```
feedpulse/
├── frontend/                      # Next.js application
│   ├── app/
│   │   ├── page.tsx              # Home page (feedback submission)
│   │   ├── dashboard/page.tsx    # Admin dashboard
│   │   ├── layout.tsx            # Root layout
│   │   └── globals.css           # Global styles
│   ├── components/
│   │   ├── FeedbackForm.tsx       # Feedback submission form
│   │   ├── FeedbackList.tsx       # Display list of feedback
│   │   ├── FeedbackFilters.tsx    # Filter controls
│   │   └── AnalyticsDashboard.tsx # Analytics visualization
│   ├── lib/
│   │   └── api.ts                # API client
│   ├── types/
│   │   └── feedback.ts           # TypeScript types
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── server.ts             # Entry point
│   │   ├── routes/
│   │   │   └── feedbackRoutes.ts # API routes
│   │   ├── controllers/
│   │   │   └── feedbackController.ts # Business logic
│   │   ├── models/
│   │   │   └── Feedback.ts       # MongoDB schema
│   │   ├── services/
│   │   │   └── gemini.service.ts # AI integration
│   │   └── utils/
│   │       └── database.ts       # DB connection
│   ├── package.json
│   ├── .env
│   └── .env.example
│
└── docker-compose.yml
```

## API Endpoints

### Feedback Endpoints

- `POST /api/feedback` - Submit new feedback
- `GET /api/feedback` - Get all feedback (with optional filters)
    - Query params: `status`, `category`, `priority`, `sort`
- `GET /api/feedback/:id` - Get feedback by ID
- `PUT /api/feedback/:id` - Update feedback status/priority/category
- `DELETE /api/feedback/:id` - Delete feedback

### Analytics Endpoints

- `GET /api/feedback/analytics` - Get feedback analytics
- `GET /api/feedback/insights` - Get AI-generated insights

### Health Check

- `GET /api/health` - Server health check

## Environment Variables

### Backend (.env)

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/feedpulse
GEMINI_API_KEY=your_api_key_here
NODE_ENV=development
```

### Frontend (.env.local)

```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Using MongoDB Atlas (Cloud)

If you want to use MongoDB Atlas instead of local MongoDB:

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account and cluster
3. Get your connection string
4. Update `.env`:
    ```
    MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/?appName=FeedPulse
    ```

## Docker Setup

To run everything in Docker:

```bash
# Make sure you have Docker installed

# Build and start all services
docker-compose up

# The app will be available at:
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
# MongoDB: localhost:27017
```

## Development Commands

### Backend

```bash
npm run dev    # Start development server with hot reload
npm run build  # Build TypeScript
npm start      # Run production build
npm run lint   # Run ESLint
```

### Frontend

```bash
npm run dev    # Start development server
npm run build  # Build for production
npm start      # Start production server
npm run lint   # Run ESLint
```

## Troubleshooting

### MongoDB Connection Error

- Make sure MongoDB is running: `mongod`
- Check connection string in `.env`
- If using Atlas, ensure IP is whitelisted

### GEMINI_API_KEY Error

- Get your key from [Google AI Studio](https://aistudio.google.com/app/apikey)
- Add it to `.env` file
- Restart the backend server

### CORS Error

- Make sure `NEXT_PUBLIC_API_URL` in frontend `.env.local` is correct
- Make sure backend is running on the correct port

### Port Already in Use

- Backend: Change PORT in `.env` or kill process on 5000
- Frontend: Use `npm run dev -- -p 3001` to use different port

## Features

✅ **Feedback Submission**

- Simple form for users to submit feedback
- Email optional
- Real-time AI categorization

✅ **AI Integration (Google Gemini)**

- Auto-categorize feedback (Bug, Feature, Improvement, etc.)
- Auto-prioritize (Low, Medium, High, Critical)
- Generate summaries
- Generate insights from all feedback

✅ **Admin Dashboard**

- View all feedback
- Filter by status, category, priority
- Sort by date
- View analytics (charts and statistics)
- View AI-generated insights
- Update feedback status

✅ **Analytics**

- Total feedback count
- Distribution by status
- Distribution by category
- Distribution by priority

## Next Steps

- [ ] Add user authentication
- [ ] Add email notifications
- [ ] Add export to CSV/PDF
- [ ] Add Slack/Teams integration
- [ ] Add advanced search
- [ ] Add team management
- [ ] Add webhook support

## Support

For issues or questions, check the GitHub issues or refer to the project documentation.
