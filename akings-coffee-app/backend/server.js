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
  // FIRST: Drop all old tables to force clean schema
  const dropTablesQuery = `
    DROP TABLE IF EXISTS order_items CASCADE;
    DROP TABLE IF EXISTS orders CASCADE;
    DROP TABLE IF EXISTS products CASCADE;
    DROP TABLE IF EXISTS reservations CASCADE;
    DROP TABLE IF EXISTS contact_messages CASCADE;
  `;

  const schemaQuery = `
    -- ============================================
    -- Products Table
    -- ============================================
    CREATE TABLE IF NOT EXISTS products (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(255) NOT NULL,
      description TEXT,
      price DECIMAL(10, 2) NOT NULL,
      category VARCHAR(50) NOT NULL,
      image_url TEXT,
      available BOOLEAN DEFAULT true,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
    CREATE INDEX IF NOT EXISTS idx_products_available ON products(available);

    -- ============================================
    -- Orders Table
    -- ============================================
    CREATE TABLE IF NOT EXISTS orders (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      customer_name VARCHAR(255) NOT NULL,
      customer_email VARCHAR(255) NOT NULL,
      customer_password VARCHAR(255),
      total DECIMAL(10, 2) NOT NULL,
      status VARCHAR(50) DEFAULT 'pending',
      preparation_minutes INTEGER DEFAULT 0,
      ready_at TIMESTAMP WITH TIME ZONE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
    CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(customer_email);
    CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

    -- ============================================
    -- Order Items Table (Join table)
    -- ============================================
    CREATE TABLE IF NOT EXISTS order_items (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
      quantity INTEGER NOT NULL CHECK (quantity > 0),
      price DECIMAL(10, 2) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
    CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

    -- ============================================
    -- Reservations Table
    -- ============================================
    CREATE TABLE IF NOT EXISTS reservations (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(20),
      date DATE NOT NULL,
      time VARCHAR(20) NOT NULL,
      guests INTEGER NOT NULL CHECK (guests > 0 AND guests <= 20),
      notes TEXT,
      status VARCHAR(50) DEFAULT 'confirmed',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_reservations_date ON reservations(date);
    CREATE INDEX IF NOT EXISTS idx_reservations_email ON reservations(email);

    -- ============================================
    -- Contact Messages Table
    -- ============================================
    CREATE TABLE IF NOT EXISTS contact_messages (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      subject VARCHAR(500) NOT NULL,
      message TEXT NOT NULL,
      status VARCHAR(50) DEFAULT 'new',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
    CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at);
  `;

  const seedDataQuery = `
    INSERT INTO products (name, description, price, category, image_url, available)
    VALUES 
      ('Classic Espresso', 'Rich and bold single shot of pure Italian espresso', 2.95, 'espresso', 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04', true),
      ('Double Espresso', 'Double shot for those who need an extra kick', 3.95, 'espresso', 'https://images.unsplash.com/photo-1579992357154-faf4bde95b3d', true),
      ('Americano', 'Espresso diluted with hot water for a smooth coffee experience', 3.50, 'espresso', 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd', true),
      ('Cappuccino', 'Perfect balance of espresso, steamed milk, and foam', 4.50, 'espresso', 'https://images.unsplash.com/photo-1572442388796-11668a67e53d', true),
      ('Latte', 'Smooth espresso with steamed milk and a touch of foam', 4.75, 'espresso', 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735', true),
      ('Flat White', 'Velvety microfoam over a double shot of espresso', 4.95, 'espresso', 'https://images.unsplash.com/photo-1545665225-b23b99e4d45e', true),
      ('Macchiato', 'Espresso marked with a dollop of foamed milk', 3.75, 'espresso', 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7', true),
      ('Caramel Macchiato', 'Vanilla-flavored latte with caramel drizzle', 5.50, 'specialty', 'https://images.unsplash.com/photo-1599826064848-80c8f2f6122b', true),
      ('Mocha', 'Rich chocolate blended with espresso and steamed milk', 5.25, 'specialty', 'https://images.unsplash.com/photo-1607013251379-e6eecfffe234', true),
      ('White Mocha', 'Sweet white chocolate mocha with whipped cream', 5.50, 'specialty', 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e', true),
      ('Vanilla Latte', 'Classic latte infused with smooth vanilla', 5.00, 'specialty', 'https://images.unsplash.com/photo-1576092768241-dec231879fc3', true),
      ('Hazelnut Latte', 'Nutty hazelnut flavor meets creamy latte', 5.00, 'specialty', 'https://images.unsplash.com/photo-1541167760496-1628856ab772', true),
      ('Iced Coffee', 'Smooth cold brew served over ice', 4.25, 'cold', 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7', true),
      ('Iced Latte', 'Chilled espresso with cold milk over ice', 4.95, 'cold', 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6', true),
      ('Iced Cappuccino', 'Cold version of the classic cappuccino', 5.25, 'cold', 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6', true),
      ('Cold Brew', 'Slow-steeped for 20 hours for a super smooth caffeine-packed punch', 4.75, 'cold', 'https://images.unsplash.com/photo-1517701604599-bb29b565090c', true),
      ('Iced Mocha', 'Chocolate and espresso over ice with whipped cream', 5.50, 'cold', 'https://images.unsplash.com/photo-1607013251379-e6eecfffe234', true),
      ('Peppermint Mocha', 'Festive mocha with peppermint flavor', 5.75, 'seasonal', 'https://images.unsplash.com/photo-1607013251379-e6eecfffe234', true),
      ('Honey Cinnamon Latte', 'Warm latte with honey and cinnamon spice', 5.25, 'seasonal', 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735', true),
      ('Salted Caramel Macchiato', 'Sweet caramel with a hint of sea salt', 5.75, 'seasonal', 'https://images.unsplash.com/photo-1599826064848-80c8f2f6122b', true),
      ('Signature Espresso', 'Our house blend espresso with rich, bold notes', 3.50, 'signature', 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04', true),
      ('Signature House Blend', 'Smooth and balanced pour-over of our proprietary blend', 4.25, 'signature', 'https://images.unsplash.com/photo-1447933601403-0c6688bcf566', true),
      ('Signature Cold Brew', 'Our award-winning 24-hour cold brew concentrate', 4.75, 'signature', 'https://images.unsplash.com/photo-1517701604599-bb29b565090c', true)
    ON CONFLICT DO NOTHING;
  `;

  const createTestOrdersQuery = `
    INSERT INTO orders (customer_name, customer_email, customer_password, total, status, preparation_minutes, ready_at)
    VALUES
      ('Akingbadeo', 'akingbadeo_ceo@brewcoffee.com', 'brew2026', 8.50, 'ready', 5, NOW() + INTERVAL '5 minutes'),
      ('Sarah Johnson', 'sarah.johnson@brewcoffee.com', 'coffee123', 12.75, 'ready', 6, NOW() + INTERVAL '10 minutes')
    ON CONFLICT DO NOTHING;
  `;

  try {
    console.log('🗑️  DROPPING OLD TABLES FOR CLEAN SCHEMA RESET...');
    await pool.query(dropTablesQuery);
    console.log('✓ Old tables dropped successfully');
    
    console.log('--- 🗄️ Starting Full System Bootstrap ---');
    await pool.query(schemaQuery);
    
    // Seed products
    const res = await pool.query('SELECT COUNT(*) FROM products');
    if (parseInt(res.rows[0].count) === 0) {
      await pool.query(seedDataQuery);
      console.log('--- 🌱 Menu Seeded Successfully (23 items) ---');
    }
    
    // Create test orders for login
    const ordersCheck = await pool.query('SELECT COUNT(*) FROM orders WHERE customer_email = $1', ['akingbadeo_ceo@brewcoffee.com']);
    if (parseInt(ordersCheck.rows[0].count) === 0) {
      await pool.query(createTestOrdersQuery);
      console.log('--- 🔑 Test Accounts Created ---');
    }
    
    console.log('--- ✅ All Tables Ready (Products, Orders, Order Items, Reservations, Contact) ---');
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