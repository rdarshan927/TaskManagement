# Task Management Application

## Overview

A robust full-stack web application for organizing, managing, and tracking tasks. The platform features a modern interface, secure authentication, and advanced productivity tools.

---

## Table of Contents

- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Live Demo](#live-demo)
- [Setup Guide](#setup-guide)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Docker Setup](#docker-setup)
- [API Reference](#api-reference)
- [Security Features](#security-features)
- [Application Architecture](#application-architecture)
- [Future Enhancements](#future-enhancements)
- [Notes & Best Practices](#notes--best-practices)

---

## Key Features

### Authentication & Security

- User registration and login
- JWT-based authentication
- Two-factor authentication (2FA) via Speakeasy
- Protected routes

### Task Management

- Create, read, update, and delete tasks
- Task attributes: title, description, status, priority, due date
- Custom confirmation modals

### Organization & Productivity

- Filter tasks by status (To Do, In Progress, Completed)
- Filter by priority (Low, Medium, High)
- Sort tasks by creation date, due date, priority, or title
- Responsive design for all devices

### User Experience

- Clean UI powered by TailwindCSS
- Loading states and animations
- Global error handling (ErrorBoundary)
- Cached API responses for performance

---

## Technology Stack

**Frontend**

- React (Vite)
- TailwindCSS
- Context API
- Axios
- React Router

**Backend**

- Node.js (Express)
- MongoDB (Mongoose)
- JWT
- Speakeasy (2FA)

**DevOps**

- Docker & Docker Compose
- Deployment: Vercel (backend), Netlify (frontend)

---

## Live Demo

- **Frontend:** [https://taskrd927.netlify.app](https://taskrd927.netlify.app)
- **Backend API:** [https://task-management-kappa-taupe.vercel.app](https://task-management-kappa-taupe.vercel.app)

---

## Setup Guide

### Prerequisites

- Node.js v16 or higher
- MongoDB (local or Atlas)
- Git
- Docker & Docker Compose (for containerized setup)

---

### Backend Setup

1. Clone the repository:

   ```sh
   git clone https://github.com/rdarshan927/TaskManagement.git
   cd TaskManagement
   ```

2. Navigate to the server directory:

   ```sh
   cd server
   ```

3. Install dependencies:

   ```sh
   npm install
   ```

4. Create a `.env` file in the `server` directory:

   ```
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=development
   ```

5. Start the development server:
   ```sh
   npm start
   ```

---

### Frontend Setup

1. Navigate to the client directory:

   ```sh
   cd ../client
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Start the development server:

   ```sh
   npm run dev
   ```

4. Access the application:  
   [http://localhost:5173](http://localhost:5173)

---

### Docker Setup

1. Ensure Docker & Docker Compose are installed.

2. Create a `.env` file in the project root:

   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key_here
   ```

3. Run Docker Compose:

   ```sh
   docker-compose up
   ```

4. Access the application:  
   [http://localhost](http://localhost])

---

## API Reference

### Authentication & User Management

- `POST /api/users` — Register a new user
- `POST /api/users/login` — Login user
- `GET /api/users/me` — Get current user profile (requires auth)
- `GET /api/users/2fa/generate` — Generate 2FA secret (requires auth)
- `POST /api/users/2fa/enable` — Enable 2FA for user (requires auth)
- `POST /api/users/verify-2fa` — Verify 2FA code
- `POST /api/users/2fa/disable` — Disable 2FA (requires auth)

### Task Management

- `GET /api/tasks` — Get all tasks for current user (requires auth)
- `POST /api/tasks` — Create a new task (requires auth)
- `PUT /api/tasks/:id` — Update a task (requires auth)
- `DELETE /api/tasks/:id` — Delete a task (requires auth)

---

## Security Features

- JWT authentication with token expiration
- Password hashing (bcrypt)
- Two-factor authentication (Speakeasy)
- CORS configuration
- Input validation
- MongoDB security best practices

---

## Application Architecture

```
project-root/
├── client/                        # Frontend (React + Vite)
│   ├── src/                       # Source code
│   │   ├── components/            # Reusable React components
│   │   ├── context/               # Context providers (state management)
│   │   ├── pages/                 # Page-level React components
│   │   ├── services/              # API service modules
│   │   ├── utils/                 # Utility/helper functions
│   │   └── hooks/                 # Custom React hooks
│   ├── public/                    # Static assets (favicon, logo, etc.)
│   ├── index.html                 # Main HTML file
│   ├── package.json               # Frontend dependencies & scripts
│   ├── vite.config.js             # Vite configuration
│   ├── tailwind.config.js         # TailwindCSS configuration
│   ├── postcss.config.js          # PostCSS configuration
│   ├── babel.config.cjs           # Babel configuration
│   ├── eslint.config.js           # ESLint configuration
│   ├── jest.config.cjs            # Jest configuration (frontend tests)
│   ├── Dockerfile                 # Dockerfile for frontend
│   ├── nginx.conf                 # Nginx config for production
│   └── README.md                  # Frontend README
│
├── server/                        # Backend (Node.js + Express)
│   ├── controllers/               # Route controller logic
│   ├── middleware/                # Express middleware (auth, error handling, etc.)
│   ├── models/                    # Mongoose models (MongoDB schemas)
│   ├── routes/                    # API route definitions
│   ├── utils/                     # Utility/helper functions
│   ├── __tests__/                 # Backend unit/integration tests
│   ├── app.js                     # Express app setup
│   ├── server.js                  # Server entry point
│   ├── package.json               # Backend dependencies & scripts
│   ├── Dockerfile                 # Dockerfile for backend
│   ├── jest.config.js             # Jest configuration (backend tests)
│   ├── jest.setup.js              # Jest setup file
│   ├── .env                       # Environment variables (example)
│   └── vercel.json                # Vercel deployment config
│
├── .env                           # Root environment variables
├── .gitignore                     # Git ignore rules
├── docker-compose.yml             # Docker Compose configuration
├── LICENSE                        # Project license (MIT)
├── README.md                      # Main project documentation
```

---

## Future Enhancements

- Email notifications for tasks approaching due dates
- Collaboration features for shared tasks
- Categories/tags for better task organization
- Calendar view for task visualization
- Export task data to PDF/CSV
- Dark mode support

---

## Notes & Best Practices

### Authentication & API Usage

- **User Registration:** Use `POST /api/users` to create a new account.
- **Two-Factor Authentication (2FA):** Integrated via Speakeasy, with backup codes for enhanced security.

### Environment Configuration

- Place your `.env` file in both the project root (for Docker) and the `server` directory (for local development).
- Required environment variables:
  ```
  MONGO_URI=your_mongodb_connection_string
  JWT_SECRET=your_jwt_secret_key
  ```

### Docker & Ports

- **Docker Compose:** Client runs on `http://localhost:80`, server on `http://localhost:5000`.
- The client is configured to wait for the server using a healthcheck.
- For local development (without Docker):
  - Frontend (Vite): `http://localhost:5173`
  - Backend (Express): `http://localhost:5000`

### CORS Configuration

- Backend allows requests from:
  - `http://localhost:5173` (local frontend)
  - `https://taskrd927.netlify.app` (deployed frontend)
- Update CORS settings if deploying to a new domain.

### Testing

- Jest is used for both client and server.
- Configurations:
  - `jest.config.js` (Frontend)
  - `jest.config.cjs` (Backend)
- Run tests with:
  ```sh
  npm test
  ```

### Error Handling

- The frontend includes a global `ErrorBoundary` component for graceful error handling and user-friendly messages.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Project Motive

The Task Management Application was built to demonstrate best practices in full-stack web development, focusing on secure authentication, user experience, and scalable architecture. It serves as a foundation for learning, collaboration, and further enhancement in productivity tools.

---
