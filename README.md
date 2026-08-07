# Pulse

A dating app built with React, Express, and MongoDB. Users create a profile, swipe on other users, match, and message each other.

## Stack

- **Frontend:** React 19, React Router, Axios, Vite
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT auth, bcrypt

## Project layout

```
pulse-app/
├── api/index.js        # Vercel serverless entry point (wraps the Express app)
├── backend/             # Express API (used for local dev, mirrors api/index.js)
│   ├── config/db.js
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
├── src/                 # React frontend
│   ├── pages/
│   ├── components/
│   ├── services/api.js
│   └── context/AuthContext.jsx
└── vercel.json
```

## Running locally

You'll need Node 18+ and a MongoDB connection string (a free MongoDB Atlas cluster works fine).

**1. Backend**

```bash
cd backend
npm install
cp .env.example .env   # then fill in MONGO_URI, JWT_SECRET, etc.
npm start
```

Runs on `http://localhost:8005`.

**2. Frontend**

```bash
npm install
npm run dev
```

Runs on `http://localhost:5173`.

Or just run `./setup.sh` (Mac/Linux) or `setup.bat` (Windows) to install both at once.

## Environment variables

`backend/.env` (copy from `backend/.env.example`):

```
MONGO_URI=your MongoDB connection string
JWT_SECRET=any random string
PORT=8005
NODE_ENV=development
GEMINI_API_KEY=optional, only needed for the AI compatibility feature
```

Never commit a real `.env` file — it's already covered by `.gitignore`.

## API

**Auth** — `/api/auth`
- `POST /register`, `POST /login`, `GET /me`
- `POST /send-otp`, `POST /verify-otp` — email verification
- `POST /google` — Google sign-in

**Users** — `/api/users`
- `GET /swipe` — candidates to swipe on
- `GET /matches`, `PUT /profile`, `GET /:userId`

**Matches** — `/api/matches`
- `POST /like`, `POST /pass`, `POST /unlike`

**Messages** — `/api/messages`
- `POST /send`, `GET /conversations`, `GET /:otherUserId`, `DELETE /:messageId`

**AI** — `/api/ai`
- `GET /analyze/:matchId` — Gemini-based compatibility summary

**Notifications** — `/api/notifications`

## Deployment

The app is set up to deploy on Vercel as a single project: the React app builds to static files, and `api/index.js` runs as a serverless function for everything under `/api/*` (see `vercel.json`). See the deployment steps below.
