# QA Dashboard Tech Stack Setup

This workspace now includes:

- `frontend/` — React.js app (Vite)
- `backend/` — Node.js + Express API

## Run the frontend (React)

```bash
cd frontend
npm run dev
```

Frontend runs on the Vite URL shown in terminal (usually `http://localhost:5173`).

## Run the backend (Node.js)

```bash
cd backend
npm run dev
```

Backend default URL: `http://localhost:5000`

Health endpoint:

- `GET http://localhost:5000/api/health`

## Production-like run for backend

```bash
cd backend
npm start
```
