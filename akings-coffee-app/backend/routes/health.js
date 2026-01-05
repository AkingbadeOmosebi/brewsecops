const express = require('express');
const router = express.Router();

// Pure health check - no database dependencies
router.get('/', (req, res) => {
  try {
    res.status(200).json({ 
      status: 'UP',
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;