# NIT Project

A full-stack web application with separated frontend, backend, and database layers.

## Project Structure

```
NIT/
├── frontend/        # React 18 + Vite application
├── backend/         # Node.js + Express 4 REST API
├── database/        # SQLite 3 database module
└── README.md        # This file
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Frontend Setup

```bash
cd frontend
npm install      # Already installed
npm run dev      # Start development server
npm run build    # Build for production
```

**Stack:** React 19.2.5, Vite, TypeScript + React Compiler

### Backend Setup

```bash
cd backend
npm install      # Already installed
npm start        # Start the server
```

**Stack:** Node.js, Express 4.22.1

### Database Setup

```bash
cd database
npm install      # Already installed
```

**Stack:** SQLite 3

## Development Workflow

1. **Frontend:** Runs on `http://localhost:5173` (default Vite port)
2. **Backend:** Configure your Express server to run on a specific port (e.g., `http://localhost:3000`)
3. **Database:** SQLite database can be created/managed from the backend

## Project Status

✅ All three modules initialized successfully
✅ Zero vulnerabilities
✅ Ready for development

## Notes

- Each folder has its own `node_modules` and `package.json`
- No duplicates or conflicts
- Clean separation of concerns


helo  and hi 