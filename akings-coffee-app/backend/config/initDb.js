const pool = require('./database');

const initDb = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      description TEXT,
      price DECIMAL(10, 2) NOT NULL,
      image_url TEXT,
      category VARCHAR(50),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  // This is idempotent: it only inserts if the name doesn't exist
  const seedDataQuery = `
    INSERT INTO products (name, description, price, category, image_url)
    SELECT 'Signature Espresso', 'Rich and bold dark roast', 3.50, 'Coffee', 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04'
    WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Signature Espresso');
    
    INSERT INTO products (name, description, price, category, image_url)
    SELECT 'Classic Latte', 'Smooth steamed milk with espresso', 4.50, 'Coffee', 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735'
    WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Classic Latte');
  `;

  try {
    console.log('--- 🗄️ Database Initialization Started ---');
    await pool.query(createTableQuery);
    await pool.query(seedDataQuery);
    console.log('--- ✅ Database Tables & Seed Data Ready ---');
  } catch (err) {
    console.error('--- ❌ Database Initialization Failed ---', err);
  }
};

module.exports = initDb;