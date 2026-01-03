const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Health check endpoint for ALB/ECS
router.get('/', async (req, res) => {
  try {
    // Check database connection
    const result = await pool.query('SELECT NOW()');
    
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      dbTime: result.rows[0].now,
      uptime: process.uptime(),
      environment: process.env.NODE_ENV
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error.message
    });
  }
});

module.exports = router;
