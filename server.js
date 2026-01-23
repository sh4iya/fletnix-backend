const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();


app.use(express.json());

app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));




app.use('/api/auth', require('./routes/auth'));
app.use('/api/shows', require('./routes/shows'));


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error(err));

app.get('/', (req, res) => {
  res.send('FletNix Backend Running');
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
