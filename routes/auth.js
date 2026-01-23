const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();

router.post('/register', async (req, res) => {
  console.log('REGISTER API HIT'); 

  try {
    const { fullName, email, password, age } = req.body;

     //  Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
     
    //  Create user
    const user = new User({
      fullName,
      email,
      password: hashedPassword,
      age
    });

    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } 
  catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    const token = jwt.sign(
      { userId: user._id, age: user.age },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    console.log('TOKEN GENERATED:', token);

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



