# Recipix Backend API

A GraphQL-based backend API for the Recipix recipe management application, built with Node.js, Express, Apollo Server, and PostgreSQL.

## 🚀 Features

- **GraphQL API** with Apollo Server
- **Authentication** with JWT tokens
- **User Management** with role-based access control
- **Recipe Management** with CRUD operations
- **Search & Filtering** with advanced query capabilities
- **Rating & Favorites** system
- **PostgreSQL Database** with Sequelize ORM
- **Redis Caching** for improved performance
- **Docker Support** with docker-compose
- **File Upload** support for recipe images
- **Rate Limiting** and security middleware

## 🛠 Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **GraphQL**: Apollo Server Express
- **Database**: PostgreSQL 15
- **ORM**: Sequelize
- **Authentication**: JWT
- **Caching**: Redis
- **Containerization**: Docker & Docker Compose
- **Security**: Helmet, CORS, Rate Limiting

## 📋 Prerequisites

- Node.js 18 or higher
- Docker and Docker Compose
- PostgreSQL (if running locally)
- Redis (if running locally)

## 🚀 Quick Start

### Using Docker (Full Stack)

The backend is now part of a full-stack Docker setup. See the root directory for complete instructions.

1. **From the project root directory:**
   ```bash
   # Start all services (backend + frontend)
   docker-compose up -d
   
   # Start only backend services
   docker-compose up postgres redis api -d
   ```

2. **Access the API**
   - GraphQL Playground: http://localhost:4001/graphql
   - Health Check: http://localhost:4001/health
   - Backend API: http://localhost:4001

### Using Docker (Backend Only)

If you want to run only the backend services:

1. **From the project root directory:**
   ```bash
   # Start only backend services
   docker-compose up postgres redis api -d
   ```

2. **Or use the production configuration:**
   ```bash
   docker-compose -f docker-compose.prod.yml up postgres redis api -d
   ```

### Local Development

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

3. **Start PostgreSQL and Redis**
   ```bash
   docker-compose up postgres redis -d
   ```

4. **Run database migrations**
   ```bash
   npm run migrate
   ```

5. **Seed the database (optional)**
   ```bash
   npm run seed
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
recipix-backend/
├── src/
│   ├── controllers/     # Business logic controllers
│   ├── database/        # Database connection and migrations
│   ├── middleware/      # Express middleware
│   ├── models/          # Sequelize models
│   ├── resolvers/       # GraphQL resolvers
│   ├── schemas/         # GraphQL schema definitions
│   ├── utils/           # Utility functions
│   └── index.js         # Application entry point
├── database/            # Database initialization scripts
├── uploads/             # File upload directory
├── docker-compose.yml   # Docker services configuration
├── Dockerfile          # Backend container definition
├── package.json        # Dependencies and scripts
└── README.md           # This file
```

## 🔐 Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Available Endpoints

#### Authentication
- `register(input: CreateUserInput!)` - Register a new user
- `login(email: String!, password: String!)` - Login user
- `changePassword(currentPassword: String!, newPassword: String!)` - Change password

#### Users
- `me` - Get current user profile
- `user(id: ID!)` - Get user by ID
- `updateProfile(input: UpdateUserInput!)` - Update user profile

#### Recipes
- `recipe(id: ID!)` - Get recipe by ID
- `recipes(filter, sort, first, after)` - Get paginated recipes
- `searchRecipes(query: String!)` - Search recipes
- `createRecipe(input: CreateRecipeInput!)` - Create new recipe
- `updateRecipe(id: ID!, input: UpdateRecipeInput!)` - Update recipe
- `deleteRecipe(id: ID!)` - Delete recipe
- `favoriteRecipe(id: ID!)` - Add recipe to favorites
- `unfavoriteRecipe(id: ID!)` - Remove recipe from favorites
- `rateRecipe(id: ID!, rating: Int!)` - Rate a recipe

## 🗄 Database Schema

### Users Table
- `id` (UUID, Primary Key)
- `username` (String, Unique)
- `email` (String, Unique)
- `password` (String, Hashed)
- `firstName` (String)
- `lastName` (String)
- `avatar` (String)
- `bio` (Text)
- `isVerified` (Boolean)
- `role` (Enum: user, admin)

### Recipes Table
- `id` (UUID, Primary Key)
- `title` (String)
- `description` (Text)
- `ingredients` (JSONB)
- `instructions` (JSONB)
- `prepTime` (Integer, minutes)
- `cookTime` (Integer, minutes)
- `servings` (Integer)
- `difficulty` (Enum: easy, medium, hard)
- `cuisine` (String)
- `tags` (JSONB)
- `image` (String)
- `isPublic` (Boolean)
- `isPublished` (Boolean)
- `rating` (Decimal)
- `ratingCount` (Integer)
- `viewCount` (Integer)
- `favoriteCount` (Integer)
- `authorId` (UUID, Foreign Key)

## 🔧 Configuration

### Environment Variables

```bash
# Server Configuration
NODE_ENV=development
PORT=4000

# Database Configuration
DATABASE_URL=postgresql://recipix_user:recipix_password@localhost:5432/recipix

# Redis Configuration
REDIS_URL=redis://localhost:6379

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# File Upload Configuration
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880

# CORS Configuration
CORS_ORIGIN=http://localhost:3000,http://localhost:19006

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📝 API Examples

### Register a new user
```graphql
mutation Register {
  register(input: {
    username: "chef_jane"
    email: "jane@example.com"
    password: "password123"
    firstName: "Jane"
    lastName: "Doe"
  }) {
    token
    user {
      id
      username
      email
    }
  }
}
```

### Create a recipe
```graphql
mutation CreateRecipe {
  createRecipe(input: {
    title: "Spaghetti Carbonara"
    description: "Classic Italian pasta dish"
    ingredients: [
      { name: "Spaghetti", amount: 400, unit: "g" }
      { name: "Eggs", amount: 4, unit: "large" }
      { name: "Pancetta", amount: 150, unit: "g" }
    ]
    instructions: [
      "Boil pasta according to package instructions",
      "Cook pancetta until crispy",
      "Mix eggs with cheese",
      "Combine all ingredients"
    ]
    prepTime: 10
    cookTime: 20
    servings: 4
    difficulty: medium
    cuisine: "Italian"
    tags: ["pasta", "italian", "quick"]
  }) {
    id
    title
    author {
      username
    }
  }
}
```

### Search recipes
```graphql
query SearchRecipes {
  recipes(
    filter: {
      search: "pizza"
      cuisine: "Italian"
      difficulty: medium
    }
    sort: { field: rating, direction: DESC }
    first: 10
  ) {
    edges {
      node {
        id
        title
        rating
        author {
          username
        }
      }
    }
    totalCount
  }
}
```

## 🚀 Deployment

### Production Deployment

1. **Set production environment variables**
2. **Build and run with Docker**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

### Environment-Specific Configurations

- **Development**: Uses local PostgreSQL and Redis
- **Production**: Uses managed database services
- **Testing**: Uses test database with separate configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔄 Changelog

### v1.0.0
- Initial release
- GraphQL API with authentication
- Recipe management system
- User management
- Docker support
