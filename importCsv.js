const fs = require('fs');
const csv = require('csv-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const Show = require('./models/Show');

// 1️⃣ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected for CSV import'))
  .catch(err => console.error(err));

// 2️⃣ Read CSV file
fs.createReadStream('./data/netflix.csv')
  .pipe(csv())
  .on('data', async (row) => {
    try {
      await Show.create({
        title: row.title,
        type: row.type,
        release_year: row.release_year,
        rating: row.rating,
        duration: row.duration,
        listed_in: row.listed_in
      });
    } catch (err) {
      console.error('❌ Error saving row:', err.message);
    }
  })
  .on('end', () => {
    console.log('🎉 CSV import completed');
  });
