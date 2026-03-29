# FeedPulse — AI-Powered Product Feedback Platform

A lightweight internal tool that collects product feedback and feature requests from users, then uses Google Gemini AI to automatically categorize, prioritize, and summarize them.

## Features

- 📝 **Feedback Collection** — Simple form for users to submit feedback
- 🤖 **AI-Powered Analysis** — Google Gemini automatically categories and prioritizes feedback
- 📊 **Admin Dashboard** — View, filter, and manage all feedback
- ⚡ **Real-time Updates** — See feedback as it comes in
- 🏷️ **Auto-Tagging** — AI-generated categories and priorities

## Tech Stack

### Frontend
- **Next.js** (TypeScript) — React framework
- **Tailwind CSS** — Utility-first styling
- **shadcn/ui** — Pre-built UI components
- **Axios/Fetch** — HTTP client

### Backend
- **Node.js + Express** (TypeScript) — REST API
- **MongoDB + Mongoose** — NoSQL database
- **Google Gemini API** — AI/ML integration

### Infrastructure
- **Docker** — Containerization (optional)

## Project Structure

```
feedpulse/
├── frontend/                    # Next.js application
│   ├── app/
│   │   ├── page.tsx            # Landing / Submit Feedback
│   │   ├── dashboard/page.tsx  # Admin Dashboard
│   │   └── api/                # Optional API routes
│   ├── components/             # Reusable React components
│   ├── package.json
│   ├── tsconfig.json
│   └── next.config.js
│
├── backend/                     # Node.js + Express API
│   ├── src/
│   │   ├── routes/             # API route handlers
│   │   ├── controllers/        # Business logic
│   │   ├── models/             # Mongoose schemas
│   │   ├── services/           # Service layer (Gemini, etc.)
│   │   └── gemini.service.ts   # AI integration
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   └── server.ts               # Entry point
│
├── docker-compose.yml          # Docker configuration
├── README.md                   # This file
└── .gitignore
```

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Google Gemini API key

### Installation

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

#### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Update .env with your MongoDB and Gemini API keys
npm run dev
```

#### With Docker
```bash
docker-compose up
```

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

## API Endpoints

- `POST /api/feedback` — Submit new feedback
- `GET /api/feedback` — Get all feedback (admin)
- `GET /api/feedback/:id` — Get feedback details
- `PUT /api/feedback/:id` — Update feedback
- `DELETE /api/feedback/:id` — Delete feedback
- `GET /api/analytics` — Get feedback analytics

## Future Enhancements

- [ ] User authentication
- [ ] Email notifications
- [ ] Export to CSV/PDF
- [ ] Integration with Slack/Teams
- [ ] Advanced filtering and search
- [ ] Team management

## License

MIT
