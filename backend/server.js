const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const productsRouter = require('./routes/products');
const ordersRouter = require('./routes/orders');
const reservationsRouter = require('./routes/reservations');
const contactRouter = require('./routes/contact');
const healthRouter = require('./routes/health');

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use(morgan('dev'));

// API Routes
app.use('/api/health', healthRouter);
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/reservations', reservationsRouter);
app.use('/api/contact', contactRouter);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: "Aking's Coffee API",
    version: '1.0.0',
    tagline: 'Brew Beautifully, Deploy Securely',
    endpoints: {
      health: '/api/health',
      products: '/api/products',
      orders: '/api/orders',
      reservations: '/api/reservations',
      contact: '/api/contact'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════╗
║  Aking's Coffee API - Brew Beautifully, Deploy Securely ║
╚════════════════════════════════════════════════════════╝
  
  🚀 Server running on: http://localhost:${PORT}
  📝 Environment: ${process.env.NODE_ENV}
  🗄️  Database: ${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}
  
  Available endpoints:
  ├── GET  /api/health
  ├── GET  /api/products
  ├── POST /api/orders
  ├── GET  /api/orders
  ├── POST /api/reservations
  └── POST /api/contact
  `);
});

module.exports = app;
