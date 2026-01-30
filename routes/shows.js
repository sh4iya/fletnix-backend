const express = require('express');
const router = express.Router();
 const authMiddleware = require('../middleware/authMiddleware');
 const Show = require('../models/Show'); 

router.get('/', authMiddleware, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 15;

  const skip = (page - 1) * limit;

  const shows = await Show.find()
    .skip(skip)
    .limit(limit);

  const totalShows = await Show.countDocuments();

  res.json({
    data: shows,
    currentPage: page,
    totalPages: Math.ceil(totalShows / limit),
    totalItems: totalShows
  });
});

module.exports = router;
