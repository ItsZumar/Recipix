# Recipix

A full-stack recipe management application with a React Native frontend and Node.js/GraphQL backend.

## Project Structure

```
recipix/
├── backend/          # Node.js/GraphQL API server
│   ├── src/
│   │   ├── controllers/
│   │   ├── database/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── resolvers/
│   │   ├── schemas/
│   │   └── utils/
│   ├── uploads/
│   ├── docker-compose.yml
│   └── package.json
└── frontend/         # React Native/Expo app
    ├── app/
    ├── components/
    ├── hooks/
    ├── lib/
    ├── stores/
    ├── types/
    └── package.json
```

## Features

- **Backend**: Node.js with GraphQL API, PostgreSQL database, JWT authentication
- **Frontend**: React Native with Expo, TypeScript, Apollo Client
- **Authentication**: User registration and login
- **Recipe Management**: Create, read, update, and delete recipes
- **Image Upload**: Recipe image upload functionality
- **Modern UI**: Beautiful and responsive design

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL
- Expo CLI (for frontend development)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp env.example .env
   # Edit .env with your database and JWT configuration
   ```

4. Set up the database:
   ```bash
   # Run the database initialization script
   psql -U your_username -d your_database -f database/init.sql
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Expo development server:
   ```bash
   npx expo start
   ```

4. Run on your preferred platform:
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on your phone

## Docker Setup

This project includes comprehensive Docker configuration for both development and production environments. All Docker files are located in the root directory for easy management.

### Docker File Structure

```
recipix/
├── docker-compose.yml          # Main orchestration (development)
├── docker-compose.override.yml # Development overrides
├── docker-compose.prod.yml     # Production configuration
├── nginx.conf                  # Reverse proxy configuration
├── scripts/
│   └── docker.sh              # Docker management script
└── frontend/
    ├── Dockerfile             # Frontend development container
    ├── Dockerfile.prod        # Frontend production build
    ├── nginx.conf             # Frontend SPA configuration
    └── .dockerignore          # Frontend build optimization
```

### Development Environment

1. **Start all services:**
   ```bash
   docker-compose up -d
   ```

2. **View logs:**
   ```bash
   # All services
   docker-compose logs -f
   
   # Specific service
   docker-compose logs -f api
   docker-compose logs -f frontend
   ```

3. **Stop services:**
   ```bash
   docker-compose down
   ```

### Production Environment

1. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your production values
   ```

2. **Start production services:**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

3. **With custom environment file:**
   ```bash
   docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d
   ```

### Service Ports

- **Frontend (Web):** http://localhost:19006
- **Backend API:** http://localhost:4001
- **GraphQL Playground:** http://localhost:4001/graphql
- **PostgreSQL:** localhost:5433
- **Redis:** localhost:6380
- **Nginx (Production):** http://localhost:80

### Docker Management Script

We provide a convenient script to manage Docker operations:

```bash
# Make the script executable (first time only)
chmod +x scripts/docker.sh

# Start development environment
./scripts/docker.sh dev

# Start production environment
./scripts/docker.sh prod

# Start only backend services
./scripts/docker.sh backend

# Start only frontend service
./scripts/docker.sh frontend

# View logs
./scripts/docker.sh logs
./scripts/docker.sh logs-api
./scripts/docker.sh logs-frontend

# Stop all services
./scripts/docker.sh stop

# Clean everything
./scripts/docker.sh clean

# Show help
./scripts/docker.sh help
```

### Manual Docker Commands

```bash
# Build specific service
docker-compose build api
docker-compose build frontend

# Rebuild and restart
docker-compose up -d --build

# View running containers
docker-compose ps

# Execute commands in containers
docker-compose exec api npm run test
docker-compose exec postgres psql -U recipix_user -d recipix

# Clean up volumes
docker-compose down -v

# Remove all containers and images
docker-compose down --rmi all --volumes --remove-orphans
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database
POSTGRES_USER=recipix_user
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=recipix

# Redis
REDIS_PASSWORD=your_redis_password

# JWT
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d

# API URLs
API_URL=http://localhost:4001
GRAPHQL_URL=http://localhost:4001/graphql
FRONTEND_URL=http://localhost:19006
```

## API Documentation

The GraphQL API is available at `http://localhost:4000/graphql` when the backend is running.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
