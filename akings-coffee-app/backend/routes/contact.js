const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { body, validationResult } = require('express-validator');

// GET all contact messages
router.get('/', async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    
    const result = await pool.query(
      `SELECT * FROM contact_messages 
       ORDER BY created_at DESC 
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    
    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch contact messages'
    });
  }
});

// POST create new contact message
router.post('/', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('subject').trim().notEmpty().withMessage('Subject is required'),
  body('message').trim().notEmpty().withMessage('Message is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  try {
    const { name, email, subject, message } = req.body;
    
    const result = await pool.query(
      `INSERT INTO contact_messages (name, email, subject, message)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, email, subject, message]
    );
    
    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating contact message:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send message'
    });
  }
});

module.exports = router;
