# Movie Search & Favorites

A full-stack application for searching movies and managing your favorites, built with Next.js and NestJS.

## Project Structure

```
movie-search-app/
├── backend/          # NestJS REST API
└── frontend/         # Next.js application with TanStack Query
```

## Features

- **Movie Search**: Search for movies using the OMDb API with auto-search as you type
- **Infinite Scroll**: Automatically loads more results as you scroll down
- **Favorites Management**: Add and remove movies from your favorites list
- **Persistent Storage**: Favorites are saved to disk and survive server restarts
- **Real-time Updates**: TanStack Query handles cache management and optimistic updates
- **Responsive Design**: Mobile-friendly UI built with Tailwind CSS
- **RESTful API**: Clean separation of concerns with modular NestJS architecture

## Prerequisites

- Node.js 18+ and npm
- OMDb API key (get one free at https://www.omdbapi.com/apikey.aspx)
- (Optional) [mise](https://mise.jdx.dev/) - Recommended for easier task management

## Setup Instructions

### Quick Start (with mise - Recommended)

If you have [mise](https://mise.jdx.dev/) installed:

```bash
cd movie-search-app

# Trust the mise config
mise trust

# Setup environment files
mise run setup

# Edit backend/.env and add your OMDb API key
# OMDB_API_KEY=your_actual_api_key_here

# Install all dependencies
mise run install

# Run both frontend and backend
mise run dev
```

That's it! Open `http://localhost:3001` in your browser.

### Manual Setup (without mise)

#### 1. Clone/Navigate to the repository

```bash
cd /Users/juliusoh/PersonalRepos/movie-search-app
```

#### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env and add your OMDb API key
# OMDB_API_KEY=your_actual_api_key_here
# PORT=3000

# Start the backend server
npm run start:dev
```

The backend will run on `http://localhost:3000`

#### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local file (optional - defaults work)
cp .env.local.example .env.local

# Start the frontend development server
npm run dev
```

The frontend will run on `http://localhost:3001`

#### 4. Access the Application

Open your browser and navigate to `http://localhost:3001`

## Available mise Commands

If you're using mise, you have access to these convenient commands:

### Installation
- `mise run install` - Install all dependencies (frontend + backend)
- `mise run install:api` - Install backend dependencies only
- `mise run install:web` - Install frontend dependencies only

### Development
- `mise run dev` - Run both frontend and backend in parallel
- `mise run dev:api` - Run backend only
- `mise run dev:web` - Run frontend only

### Building
- `mise run build` - Build both projects
- `mise run build:api` - Build backend only
- `mise run build:web` - Build frontend only

### Linting
- `mise run lint` - Lint both projects
- `mise run lint:api` - Lint backend only
- `mise run lint:web` - Lint frontend only

### Utilities
- `mise run setup` - Create .env files from examples
- `mise run clean` - Remove node_modules and build artifacts
- `mise task ls` - List all available tasks

## API Endpoints

### Movies
- `GET /movies/search?q={query}` - Search for movies by title

### Favorites
- `GET /favorites` - Get all favorite movies
- `POST /favorites` - Add a movie to favorites (body: Movie object)
- `DELETE /favorites/:imdbID` - Remove a movie from favorites

## Architecture Decisions

### Backend (NestJS)
ellent performance

**Design Choices:**
- **JSON file persistence**: Favorites are saved to `backend/data/favorites.json`
  - Automatically loads on startup
  - Saves after each add/remove operation
  - Survives server restarts
  - For production, would use a database (PostgreSQL, MongoDB)
- **Modular structure**: Separate modules for movies and favorites
- **Pagination**: Supports page-based movie search results

### Frontend (Next.js)

**Why TanStack Query?**
- Automatic caching and background refetching
- Optimistic updates for better UX
- Simplified async state management
- Query invalidation on mutations

**Design Choices:**
- **Client-side rendering**: Using 'use client' for interactive components
- **Infinite scroll**: Using `useInfiniteQuery` with Intersection Observer for automatic pagination
- **Query invalidation**: Automatic refetch of favorites after mutations
- **Simple state management**: TanStack Query handles most state needs

## Production 

To make this application production-ready, 

### Security
- [ ] **Environment variable validation** - Use libraries like `joi` or `zod` to validate environment variables at startup
- [ ] **Rate limiting** - Implement rate limiting on API endpoints 
- [ ] **Input validation** - Add DTOs with `class-validator` for all API inputs
- [ ] **Helmet.js** - Add security headers to protect against common vulnerabilities
- [ ] **CORS configuration** - Restrict CORS to specific production domains
- [ ] **API authentication** - Implement JWT or OAuth for user authentication
- [ ] **HTTPS** - Enforce HTTPS in production

### Data Persistence
- [x] **Local file storage** - ✅ Currently using JSON file (`backend/data/favorites.json`)
- [ ] **Database** - Upgrade to PostgreSQL, MongoDB, or SQLite for production
  - Option 1: PostgreSQL with TypeORM or Prisma
  - Option 2: MongoDB with Mongoose
  - Option 3: SQLite for simpler deployment
- [ ] **Database migrations** - Set up migration system for schema changes
- [ ] **Data validation** - Ensure data integrity with database constraints

### Testing
- [x] **Unit tests** - ✅ 29 passing tests (23 backend, 6 frontend)
- [ ] **Integration tests** - Test API endpoints (Supertest)
- [ ] **E2E tests** - Test user flows (Playwright or Cypress)
- [ ] **Component tests** - Add more React components tests
- [ ] **Code coverage** - Aim for >80% coverage

### Monitoring & Logging
- [ ] **Structured logging** - Use Winston or Pino for better log management
- [ ] **Error tracking** - Integrate Sentry or similar for error monitoring
- [ ] **Performance monitoring** - Add APM tools (New Relic, DataDog)
- [ ] **Metrics collection** - Track API response times, error rates

### Infrastructure & DevOps
- [ ] **Docker** - Containerize both frontend and backend
- [ ] **Docker Compose** - Orchestrate local development environment
- [ ] **CI/CD pipeline** - Automate testing and deployment (GitHub Actions, GitLab CI)
- [ ] **Environment management** - Separate dev, staging, production configs
- [ ] **Load balancing** - Set up load balancer for horizontal scaling
- [ ] **CDN** - Use CDN for static assets (Cloudflare, CloudFront)

### Performance
- [ ] **Caching** - Add Redis for API response caching
- [ ] **Database indexing** - Index frequently queried fields (e.g., imdbID)
- [x] **Pagination** - ✅ Implemented with infinite scroll
- [ ] **Image optimization** - Use Next.js Image component with proper sizing
- [ ] **Bundle optimization** - Code splitting and lazy loading

## Development Notes

- Backend runs on port 3000
- Frontend runs on port 3001
- Favorites are persisted to `backend/data/favorites.json`
- Data directory is created automatically on first run


