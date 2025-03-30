const express = require('express');
const router = express.Router();
const User = require('../models/User');

// @route   POST /api/users
// @desc    Register a user from form data
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { name, email, company } = req.body;

    // Simple validation
    if (!name || !email || !company) {
      return res.status(400).json({ msg: 'Please enter all fields' });
    }

    // Check for existing user
    let user = await User.findOne({ email });
    if (user) {
      return res.status(200).json({ msg: 'User already exists', user });
    }

    user = new User({
      name,
      email,
      company
    });

    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   GET /api/users
// @desc    Get all users
// @access  Public (would normally be protected in production)
router.get('/', async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

module.exports = router; 