const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { body, validationResult } = require('express-validator');

// GET all reservations
router.get('/', async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    
    const result = await pool.query(
      `SELECT * FROM reservations 
       ORDER BY date DESC, time DESC 
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    
    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch reservations'
    });
  }
});

// POST create new reservation
router.post('/', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').optional().trim(),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('time').trim().notEmpty().withMessage('Time is required'),
  body('guests').isInt({ min: 1, max: 20 }).withMessage('Guests must be between 1 and 20'),
  body('notes').optional().trim()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  try {
    const { name, email, phone, date, time, guests, notes } = req.body;
    
    const result = await pool.query(
      `INSERT INTO reservations (name, email, phone, date, time, guests, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [name, email, phone || null, date, time, guests, notes || null]
    );
    
    res.status(201).json({
      success: true,
      message: 'Reservation created successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating reservation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create reservation'
    });
  }
});

module.exports = router;
