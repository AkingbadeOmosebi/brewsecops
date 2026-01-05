const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const pool = require('./config/database'); 
require('dotenv').config();

const productsRouter = require('./routes/products');
const ordersRouter = require('./routes/orders');
const reservationsRouter = require('./routes/reservations');
const contactRouter = require('./routes/contact');
const healthRouter = require('./routes/health');

const app = express();
const PORT = process.env.PORT || 3001;

// --- AUTOMATION: DATABASE BOOTSTRAP ---
const bootstrapDatabase = async () => {
  const schemaQuery = `
    -- Products Table
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      description TEXT,
      price DECIMAL(10, 2) NOT NULL,
      image_url TEXT,
      category VARCHAR(50),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Orders Table (For the Coffee Cards success flow)
    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      product_name VARCHAR(100),
      quantity INTEGER DEFAULT 1,
      total_price DECIMAL(10, 2),
      status VARCHAR(20) DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Reservations Table
    CREATE TABLE IF NOT EXISTS reservations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL,
      date DATE NOT NULL,
      time TIME NOT NULL,
      guests INTEGER NOT NULL,
      status VARCHAR(20) DEFAULT 'confirmed',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Contact Messages Table
    CREATE TABLE IF NOT EXISTS contact_messages (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL,
      subject VARCHAR(200),
      message TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const seedDataQuery = `
    INSERT INTO products (name, description, price, category, image_url)
    VALUES 
      ('Signature Espresso', 'Rich, bold, and intense dark roast espresso shot.', 3.50, 'Coffee', 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04'),
      ('Classic Latte', 'Smooth espresso balanced with silky steamed milk and a light layer of foam.', 4.50, 'Coffee', 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735'),
      ('Caramel Macchiato', 'Freshly steamed milk with vanilla-flavored syrup marked with espresso and caramel drizzle.', 5.25, 'Specialty', 'https://images.unsplash.com/photo-1485808191679-5f86510681a2'),
      ('Cappuccino', 'Equal parts espresso, steamed milk, and heavy foam for a perfect balance.', 4.25, 'Coffee', 'https://images.unsplash.com/photo-1534778101976-62847782c213'),
      ('Mocha Fusion', 'A delicious blend of chocolate, espresso, and steamed milk topped with whipped cream.', 5.50, 'Specialty', 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e'),
      ('Cold Brew', 'Slow-steeped for 20 hours for a super smooth, caffeine-packed punch.', 4.75, 'Coffee', 'https://images.unsplash.com/photo-1517701604599-bb29b565090c')
    ON CONFLICT DO NOTHING;
  `;

  try {
    console.log('--- 🗄️ Starting Full System Bootstrap ---');
    await pool.query(schemaQuery);
    
    // Seed only if products are missing
    const res = await pool.query('SELECT COUNT(*) FROM products');
    if (parseInt(res.rows[0].count) === 0) {
      await pool.query(seedDataQuery);
      console.log('--- 🌱 Menu Seeded Successfully ---');
    }
    console.log('--- ✅ All Tables Ready (Products, Orders, Reservations, Contact) ---');
  } catch (err) {
    console.error('--- ❌ Bootstrap Failed ---', err);
  }
};

// Security middleware
app.use(helmet());

// CORS configuration - Updated for Production Domain
app.use(cors({
  origin: [process.env.FRONTEND_URL, 'https://dev.brewsecops.online', 'http://localhost:5173'],
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

// Start logic
const start = async () => {
  await bootstrapDatabase();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

start();

module.exports = app;