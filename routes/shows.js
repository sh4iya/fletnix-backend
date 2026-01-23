const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Show = require('../models/Show'); 

router.get('/', authMiddleware, async (req, res) => {
  try {
    const shows = await Show.find();
    res.json(shows);
   
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
