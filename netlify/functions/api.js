const express = require('express');
const serverless = require('serverless-http');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// Initialize Express
const app = express();
const router = express.Router();

// Connect to MongoDB
const MONGODB_URI = "mongodb+srv://mathav:yzxlmg0Csrh33HtJ@canvas-demo.tbzth.mongodb.net/canvas-landing-page?retryWrites=true&w=majority&appName=canvas-demo";

mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  company: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', userSchema);

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
router.get('/', (req, res) => {
  res.json({
    message: 'Canvas Landing Page API is running'
  });
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// Register a user from form data
router.post('/users', async (req, res) => {
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

// This is important - this is the path that Netlify functions use
app.use('/.netlify/functions/api', router);

// This is also needed to handle the root function URL directly
module.exports.handler = serverless(app); 