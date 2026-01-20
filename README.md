# FinanceAI Backend

Backend service for **FinanceAI**, handling authentication, transactions,
analytics, budgets, and integration with AI services.

## Tech Stack
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Multer (file uploads)

## Core Features
- User authentication & authorization
- Transaction CRUD APIs
- Monthly income / expense / savings summary
- Category-wise expense aggregation
- Budget tracking & alerts
- CSV statement import with preview & confirmation
- AI service integration with graceful degradation

## Key Design Decisions
- AI service failures do NOT impact core functionality
- Client-side pagination to reduce API complexity
- Rule-based income detection handled in backend
- Modular route & service structure

## APIs Overview
- `/api/auth`
- `/api/transactions`
- `/api/analytics`
- `/api/insights`
- `/api/budgets`
- `/api/savings-goals`

## Environment Variables
- MONGO_URI=your_mongo_uri
- JWT_SECRET=your_secret
- AI_SERVICE_URL=your_ai_service_url
