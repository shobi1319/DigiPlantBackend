const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Secret key for JWT (use a secure, private key in production)
const JWT_SECRET = '1319@';

// Fetch user profile
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Access the user ID from the decoded token
    const user = await User.findById(userId).select('-password'); // Exclude password from the response

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
        success: false,
      });
    }

    // Respond with user data
    res.status(200).json({
      message: 'User profile retrieved successfully',
      success: true,
      user,
    });
  } catch (error) {
    console.error('Error fetching user profile:', error.message);
    res.status(500).json({
      message: 'Error fetching user profile',
      success: false,
    });
  }
};
const editUserProfile = async (req, res) => {
  const { name, email, address, phone, password } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.address = address || user.address;
    user.phone = phone || user.phone;

    await user.save();

    res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update profile', error: error.message });
  }
};
const createUser = async (req, res) => {
  try {
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    
    // Create a new user with the hashed password
    const users = new User({
      ...req.body,
      password: hashedPassword, // Use the hashed password
    });

    await users.save();

    res.status(201).json({
      message: 'User added successfully!',
      success: true,
      user: users // Return the created user object without exposing the password
    });
  } catch (error) {
    if (error.code === 11000) { // Duplicate key error
      return res.status(400).json({
        message: 'User ID or email already exists.',
        success: false
      });
    }
    res.status(400).json({
      message: error.message,
      success: false
    });
  }
};


// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
        success: false,
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid password',
        success: false,
      });
    }

    // Generate a token using the userId
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
console.log(token);
    // Send token to frontend
    res.status(200).json({
      message: 'Login successful',
      success: true,
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

module.exports = { loginUser, createUser,getUserProfile , editUserProfile};
