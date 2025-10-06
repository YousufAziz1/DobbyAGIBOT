# SentientDobby Ai
Full-stack chat app (Next.js + Express + MongoDB) with document upload and OpenRouter model selection.

This guide shows step-by-step how to run locally on Windows. Anyone cloning from GitHub can follow this to run.

## Prerequisites
- **Node.js**: v18 or newer (Next.js 14 requires Node 18.17+)
- **npm**: comes with Node
- **MongoDB**: running locally at `mongodb://127.0.0.1:27017`

## Project Structure
```
SentientDobby Ai/
  backend/
    src/
      config/db.js
      server.js
      routes/{authRoutes.js, chatRoutes.js, uploadRoutes.js, modelRoutes.js}
      controllers/{authController.js, chatController.js, uploadController.js}
      middleware/{authMiddleware.js, errorMiddleware.js}
      models/{User.js, Chat.js, Message.js}
    package.json
    .env  (create this)
  frontend/
    app/ (Next.js pages)
    components/
    lib/api.ts
    next.config.js
    package.json
    .env.local (create this)
```

## Environment Variables

### Backend `backend/.env`
Copy/paste and fill your values if needed:
```
# Server
PORT=4000
CLIENT_ORIGIN=http://localhost:3001

# Database
MONGO_URI=mongodb://127.0.0.1:27017/sentientdobby

# Auth
JWT_SECRET=change_this_in_prod
JWT_EXPIRES_IN=7d

# OpenRouter (optional, for live model list and chat)
OPENROUTER_API_KEY=your_key_here
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
OPENROUTER_TITLE=SentientAGIDobby
OPENROUTER_SAFE_MODE=false
```
Notes:
- If `OPENROUTER_API_KEY` is missing or `OPENROUTER_SAFE_MODE=true`, backend returns a safe fallback model list.
- CORS origin defaults to `http://localhost:3001` per `src/server.js`.

### Frontend `frontend/.env.local`
```
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

## Install Dependencies
Run these in separate terminals or sequentially:

1) Backend
```
cd backend
npm install
```

2) Frontend
```
cd frontend
npm install
```

## Run Locally
Use two terminals (one for backend, one for frontend).

1) Start MongoDB
- Make sure MongoDB service is running locally. Default URI used by app: `mongodb://127.0.0.1:27017/sentientdobby`.

2) Backend (Express API)
```
cd backend
npm run dev   # runs on http://localhost:4000
```
Logs should show: `API running on http://localhost:4000` and `MongoDB connected`.

3) Frontend (Next.js)
```
cd frontend
npm run dev   # runs on http://localhost:3001
```
Open `http://localhost:3001` in your browser.

## Default Ports
- Backend API: `http://localhost:4000` (see `backend/src/server.js`)
- Frontend: `http://localhost:3001` (see `frontend/package.json` -> `dev` script)

## API Overview (for testing with Postman/HTTP clients)
Base URL: `http://localhost:4000/api`

- **Auth** (`backend/src/routes/authRoutes.js`)
  - POST `/auth/register` { name?, email, password }
  - POST `/auth/login` { email, password } → returns `{ token, user }`
  - GET `/auth/me` (requires `Authorization: Bearer <token>`) → returns user

- **Chats** (`backend/src/routes/chatRoutes.js`) [requires auth]
  - GET `/chats`
  - POST `/chats` { title? }
  - GET `/chats/:chatId/messages`
  - POST `/chats/:chatId/messages` { content, model? }
  - PUT `/chats/:chatId/messages/:messageId` { content } (edit only user messages)
  - DELETE `/chats/:chatId` (delete chat + messages)
  - DELETE `/chats/:chatId/messages` (clear messages)

- **Uploads** (`backend/src/routes/uploadRoutes.js`) [requires auth]
  - POST `/uploads` form-data with `file`
    - Accepts: pdf, docx, doc, images (png/jpeg/webp/gif)
    - Response includes extracted `text` (for pdf/docx) and `preview_url`

- **Models** (`backend/src/routes/modelRoutes.js`)
  - GET `/models` → returns model list from OpenRouter or a safe fallback

## Frontend Configuration
- API base URL read from `frontend/lib/api.ts`: `NEXT_PUBLIC_API_URL` or default `http://localhost:4000/api`.
- Ensure `frontend/.env.local` is set if you change backend port/host.

## Common Issues & Tips
- If CORS errors occur, set `CLIENT_ORIGIN` in `backend/.env` to your frontend URL.
- If MongoDB connection fails, verify MongoDB is running and `MONGO_URI` is correct.
- Without `OPENROUTER_API_KEY`, the app still works using a safe fallback model list.

## Scripts Reference
Backend (`backend/package.json`):
- `npm run dev` → `nodemon src/server.js`
- `npm start` → `node src/server.js`

Frontend (`frontend/package.json`):
- `npm run dev` → `next dev -p 3001`
- `npm run build` → `next build`
- `npm start` → `next start`

## Quick Start (Step-by-step)
1) Install Node 18+, MongoDB.
2) Create `backend/.env` and `frontend/.env.local` using samples above.
3) In `backend/`: `npm install && npm run dev`.
4) In `frontend/`: `npm install && npm run dev`.
5) Open `http://localhost:3001` and register/login to start chatting.

Happy hacking!
