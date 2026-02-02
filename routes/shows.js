const express = require('express');
const router = express.Router();
 const authMiddleware = require('../middleware/authMiddleware');
 const Show = require('../models/Show'); 

router.get('/', authMiddleware, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 15;
  const search = req.query.search || '';
  const type = req.query.type || '';

  const skip = (page - 1) * limit;

  // 🔍 build query dynamically
  const query = {};

  // search title or cast
  if (search) {
  query.$or = [
    { title: { $regex: search, $options: 'i' } },
    { cast: { $elemMatch: { $regex: search, $options: 'i' } } },
    { cast: { $regex: search, $options: 'i' } } // fallback if string
  ];
}


  // filter by type if not ALL
  if (type && type !== 'All') {
  query.type = { $regex: `^${type}$`, $options: 'i' };
}


  const shows = await Show.find(query)
  .sort({ title: 1 })   // alphabetical
  .skip(skip)
  .limit(limit);


  const totalShows = await Show.countDocuments(query);

  res.json({
    data: shows,
    currentPage: page,
    totalPages: Math.ceil(totalShows / limit),
    totalItems: totalShows
  });
});



module.exports = router;
