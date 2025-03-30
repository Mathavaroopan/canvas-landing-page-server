const mongoose = require('mongoose');

// MongoDB Connection
const MONGODB_URI = "mongodb+srv://mathav:yzxlmg0Csrh33HtJ@canvas-demo.tbzth.mongodb.net/canvas-landing-page?retryWrites=true&w=majority&appName=canvas-demo";

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

// Handler for the Netlify Function
exports.handler = async (event, context) => {
  // Connect to MongoDB
  if (mongoose.connection.readyState !== 1) {
    try {
      await mongoose.connect(MONGODB_URI);
      console.log('MongoDB connected');
    } catch (error) {
      console.error('MongoDB connection error:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to connect to database' })
      };
    }
  }

  // Create the User model if it doesn't exist
  const User = mongoose.models.User || mongoose.model('User', userSchema);

  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  // Handle OPTIONS requests (for CORS preflight)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // GET request - list all users
  if (event.httpMethod === 'GET') {
    try {
      const users = await User.find().sort({ createdAt: -1 });
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(users)
      };
    } catch (error) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Failed to retrieve users' })
      };
    }
  }

  // POST request - create a new user
  if (event.httpMethod === 'POST') {
    try {
      const data = JSON.parse(event.body);
      const { name, email, company } = data;

      // Simple validation
      if (!name || !email || !company) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Please enter all fields' })
        };
      }

      // Check for existing user
      let user = await User.findOne({ email });
      if (user) {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ message: 'User already exists', user })
        };
      }

      // Create new user
      user = new User({
        name,
        email,
        company
      });

      const savedUser = await user.save();
      return {
        statusCode: 201,
        headers,
        body: JSON.stringify(savedUser)
      };
    } catch (error) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Failed to create user' })
      };
    }
  }

  // Default response for unsupported methods
  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ error: 'Method not allowed' })
  };
}; 