# Recipix Backend - Project Overview

## 🏗 Architecture Overview

The Recipix backend is built with a modern, scalable architecture using:

- **GraphQL API** with Apollo Server for flexible data querying
- **PostgreSQL** as the primary database with JSONB support
- **Redis** for caching and session management
- **Docker** for containerization and easy deployment
- **JWT** for stateless authentication
- **Sequelize ORM** for database operations

## 📊 Database Design

### Core Entities

1. **Users**
   - Authentication and profile management
   - Role-based access control (user/admin)
   - Social features (favorites, ratings)

2. **Recipes**
   - Rich recipe data with ingredients and instructions
   - JSONB fields for flexible ingredient/instruction storage
   - Social features (ratings, favorites, views)
   - Publishing workflow (draft/published)

3. **Relationships**
   - Users can create multiple recipes
   - Many-to-many relationships for favorites and ratings
   - Efficient querying with proper indexing

## 🔐 Security Features

- **JWT Authentication** with configurable expiration
- **Password Hashing** using bcrypt
- **Rate Limiting** to prevent abuse
- **CORS Configuration** for cross-origin requests
- **Input Validation** using Joi schemas
- **Security Headers** via Helmet middleware

## 🚀 Deployment Options

### Development
```bash
# Local development with Docker
docker-compose up -d

# Local development without Docker
npm install
npm run dev
```

### Production
```bash
# Production deployment
docker-compose -f docker-compose.prod.yml up -d
```

## 📈 Performance Optimizations

- **Database Indexing** on frequently queried fields
- **Redis Caching** for frequently accessed data
- **Connection Pooling** for database connections
- **GraphQL Query Optimization** with field-level resolvers
- **Nginx Reverse Proxy** with rate limiting

## 🔧 Configuration Management

Environment variables control all aspects of the application:

- Database connections
- JWT secrets and expiration
- CORS origins
- Rate limiting parameters
- File upload settings

## 📝 API Documentation

The GraphQL API provides:

- **Authentication**: Register, login, password management
- **User Management**: Profile updates, user queries
- **Recipe Management**: CRUD operations, publishing
- **Social Features**: Favorites, ratings, views
- **Search & Filtering**: Advanced query capabilities

## 🧪 Testing Strategy

- **Unit Tests** for resolvers and utilities
- **Integration Tests** for database operations
- **API Tests** for GraphQL endpoints
- **Docker Testing** for containerized environments

## 🔄 Development Workflow

1. **Local Development**: Use Docker Compose for consistent environment
2. **Database Migrations**: Automatic schema updates in development
3. **Seeding**: Sample data for testing and development
4. **Code Quality**: ESLint for code standards
5. **Version Control**: Git with proper branching strategy

## 📊 Monitoring & Logging

- **Health Checks** for all services
- **Structured Logging** for debugging
- **Error Tracking** with detailed error messages
- **Performance Monitoring** via GraphQL metrics

## 🔗 Integration Points

- **Frontend**: React Native app via GraphQL
- **File Storage**: Local uploads with potential for cloud storage
- **Email Service**: Ready for user notifications
- **External APIs**: Extensible for recipe data sources

## 🚀 Future Enhancements

- **Real-time Features**: WebSocket subscriptions
- **Image Processing**: Automatic image optimization
- **Search Engine**: Elasticsearch integration
- **Microservices**: Service decomposition
- **CI/CD Pipeline**: Automated testing and deployment

## 📚 Key Files & Directories

```
recipix-backend/
├── src/
│   ├── index.js              # Application entry point
│   ├── models/               # Database models and relationships
│   ├── resolvers/            # GraphQL resolvers
│   ├── schemas/              # GraphQL schema definitions
│   ├── middleware/           # Express middleware
│   ├── database/             # Database connection and seeding
│   └── utils/                # Utility functions
├── docker-compose.yml        # Development environment
├── docker-compose.prod.yml   # Production environment
├── Dockerfile               # Container definition
├── nginx.conf               # Reverse proxy configuration
└── README.md                # Detailed documentation
```

## 🎯 Getting Started

1. **Clone and Setup**: Follow the README.md instructions
2. **Environment**: Configure your .env file
3. **Database**: Start PostgreSQL and Redis
4. **Development**: Run with `npm run dev` or Docker
5. **Testing**: Access GraphQL Playground at `/graphql`

This backend provides a solid foundation for the Recipix recipe management application with room for growth and scaling.
