const { put } = require('@vercel/blob');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');

const JWT_SECRET = '1319@';

// Configure multer to parse image file uploads
const upload = multer();

// Fetch user profile
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
        success: false,
      });
    }

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

// Edit user profile with image upload
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

    // Handle image upload for profile update
    if (req.file) {
      const imageBuffer = req.file.buffer;
      const { url } = await put(`profile-images/${userId}.png`, imageBuffer, { access: 'public' });
      user.profileImageUrl = url;
    }

    await user.save();

    res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update profile', error: error.message });
  }
};

// Create user with optional profile image
const createUser = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Handle image upload for new user
    let profileImageUrl;
    if (req.file) {
      const imageBuffer = req.file.buffer;
      const { url } = await put(`profile-images/${req.body.email}.png`, imageBuffer, { access: 'public' });
      profileImageUrl = url;
    }

    const user = new User({
      ...req.body,
      password: hashedPassword,
      profileImageUrl, // Store the image URL if available
    });

    await user.save();

    res.status(201).json({
      message: 'User added successfully!',
      success: true,
      user,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'User ID or email already exists.',
        success: false,
      });
    }
    res.status(400).json({
      message: error.message,
      success: false,
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

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

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

// Apply multer middleware to routes that handle file uploads
module.exports = {
  loginUser,
  createUser: [upload.single('profileImage'), createUser],
  getUserProfile,
  editUserProfile: [upload.single('profileImage'), editUserProfile],
};
