const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { renderPlaygroundPage } = require('graphql-playground-html');
require('dotenv').config();

const { sequelize } = require('./database/connection');
const typeDefs = require('./schemas');
const resolvers = require('./resolvers');
const { authenticateToken } = require('./middleware/auth');
const uploadRoutes = require('./routes/upload');

// Import models to establish relationships
require('./models');

const app = express();
const PORT = process.env.PORT || 4000;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000', 'http://localhost:19006'],
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// Upload routes
app.use('/api/upload', uploadRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// GraphQL Playground endpoint (development only)
if (process.env.NODE_ENV !== 'production') {
  app.get('/playground', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    const playground = renderPlaygroundPage({
      endpoint: '/graphql',
      title: 'Recipix GraphQL Playground'
    });
    res.write(playground);
    res.end();
  });
}

// GraphQL context function
const context = async ({ req }) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  let user = null;
  
  if (token) {
    try {
      user = await authenticateToken(token);
    } catch (error) {
      console.log('Token authentication failed:', error.message);
    }
  }
  
  return { user, req };
};

// Apollo Server setup
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context,
  introspection: process.env.NODE_ENV !== 'production',
  formatError: (error) => {
    console.error('GraphQL Error:', error);
    return {
      message: error.message,
      code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
    };
  },
});

// Apply Apollo Server middleware
async function startServer() {
  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });
}

// Database connection and server startup
async function startApp() {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
    
    // Sync database models (in development)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('✅ Database models synchronized.');
    }
    
    // Start Apollo Server
    await startServer();
    
    // Start Express server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📊 GraphQL endpoint: http://localhost:${PORT}${server.graphqlPath}`);
      if (process.env.NODE_ENV !== 'production') {
        console.log(`🔍 GraphQL Playground: http://localhost:${PORT}/playground`);
      }
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await sequelize.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  await sequelize.close();
  process.exit(0);
});

startApp();
