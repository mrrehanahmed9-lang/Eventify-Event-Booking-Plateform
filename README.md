# Eventify — Event Booking Platform

A full-stack event discovery and booking starter project with a React client and Express API server.

## Features
- Browse and search events
- Event details and booking flow
- Register / log in with JWT authentication
- View and cancel your bookings
- Create, edit, and delete events (admin role)
- MongoDB persistence with Mongoose
- Responsive UI

## Tech stack
- Client: React, Vite, React Router
- Server: Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs

## Requirements
- Node.js 18+
- MongoDB local instance or MongoDB Atlas connection string

## Setup

### 1. Configure server
```bash
cd server
cp .env.example .env
```
Edit `server/.env` and set `MONGO_URI` and a strong `JWT_SECRET`.

### 2. Install and run server
```bash
npm install
npm run dev
```
API runs at `http://localhost:5000`.

### 3. Install and run client
In a second terminal:
```bash
cd client
npm install
npm run dev
```
Client runs at `http://localhost:5173`.

## Create an admin
Register a user normally, then update that user's `role` to `admin` in MongoDB. Admins can create, edit, and delete events from the dashboard.

## API overview
- `GET /api/health`
- `GET /api/events` — list/search events (`?search=music&category=Music`)
- `GET /api/events/:id` — event details
- `POST /api/events` — admin only
- `PUT /api/events/:id` — admin only
- `DELETE /api/events/:id` — admin only
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me` — authenticated
- `GET /api/bookings/my` — authenticated
- `POST /api/bookings` — authenticated
- `DELETE /api/bookings/:id` — authenticated

## Notes
- This is a learning/demo project. It does not process real payments.
- Keep `.env` private and never commit secrets.
