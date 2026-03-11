# Backend Setup

This folder contains a Node.js + Express + TypeScript backend for the AI-Assisted Developer Evaluation Test.

## Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

## Installation

```bash
cd backend
npm install

# Create environment file
cp .env.example .env
```

**Note:** The `.env` file contains your local environment configuration. The `.env.example` template is provided in the repository.

## Running the Backend

### Development Mode

```bash
npm run dev
```

The backend server will run on **http://localhost:3000** (as configured in `.env`)

### Production Build

```bash
npm run build
npm start
```

## Verify Setup

Once the server is running, verify the health endpoint:

```bash
curl http://localhost:3000/health
```

You should see:
```json
{"status": "ok"}
```

Or open in your browser: [http://localhost:3000/health](http://localhost:3000/health)

## Project Structure

```
backend/
├── src/
│   ├── app.ts              # Express app configuration
│   ├── server.ts           # Server entry point
│   ├── controllers/        # Request handlers
│   │   └── health.controller.ts
│   ├── routes/             # API routes
│   │   └── health.routes.ts
│   ├── middleware/         # Custom middleware
│   │   └── errorHandler.ts
│   └── models/             # Data models (empty - for your implementation)
├── .env                    # Environment variables
├── package.json
├── tsconfig.json           # TypeScript configuration
└── nodemon.json            # Nodemon configuration
```

## Environment Variables

The `.env` file contains:
```
PORT=3000
```

You can modify the port if needed.

## Available Scripts

- `npm run dev` - Start the development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start the production server (requires build first)


