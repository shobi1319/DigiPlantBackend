// NurseryController.js
const Nursery = require('../models/Nursery');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Secret key for JWT (ensure this is secure in production)
const JWT_SECRET = '1319@';

// Fetch nursery profile
const getNurseryProfile = async (req, res) => {
  try {
    const nurseryId = req.user.id; // Access the nursery ID from the decoded token
    const nursery = await Nursery.findById(nurseryId).select('-password'); // Exclude password

    if (!nursery) {
      return res.status(404).json({
        message: 'Nursery not found',
        success: false,
      });
    }

    // Respond with nursery data
    res.status(200).json({
      message: 'Nursery profile retrieved successfully',
      success: true,
      nursery,
    });
  } catch (error) {
    console.error('Error fetching nursery profile:', error.message);
    res.status(500).json({
      message: 'Error fetching nursery profile',
      success: false,
    });
  }
};

// Edit nursery profile
const editNurseryProfile = async (req, res) => {
  const { name, address, phone, description, password } = req.body;
  const nurseryId = req.user.id;

  try {
    const nursery = await Nursery.findById(nurseryId);

    const isPasswordValid = await bcrypt.compare(password, nursery.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Update the nursery details
    nursery.name = name || nursery.name;
    nursery.address = address || nursery.address;
    nursery.phone = phone || nursery.phone;
    nursery.description = description || nursery.description;

    await nursery.save();

    res.status(200).json({ message: 'Profile updated successfully', nursery });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update profile', error: error.message });
  }
};

// Register nursery
const createNursery = async (req, res) => {
  try {
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Create a new nursery with the hashed password
    const nursery = new Nursery({
      ...req.body,
      password: hashedPassword, // Store hashed password
    });

    await nursery.save();

    res.status(201).json({
      message: 'Nursery registered successfully!',
      success: true,
      nursery,
    });
  } catch (error) {
    if (error.code === 11000) { // Duplicate key error
      return res.status(400).json({
        message: 'Nursery ID or email already exists.',
        success: false,
      });
    }
    res.status(400).json({
      message: error.message,
      success: false,
    });
  }
};

// Login nursery
const jwt = require('jsonwebtoken');  // Import jsonwebtoken
const bcrypt = require('bcryptjs');  // Import bcrypt for password comparison
const Nursery = require('../models/Nursery');  // Import your Nursery model

const loginNursery = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the nursery by email
    const nursery = await Nursery.findOne({ email });

    if (!nursery) {
      return res.status(404).json({
        message: 'Nursery not found',
        success: false,
      });
    }

    // Compare the entered password with the stored password
    const isMatch = await bcrypt.compare(password, nursery.password);
    
    if (!isMatch) {
      return res.status(400).json({
        message: 'Invalid credentials',
        success: false,
      });
    }

    // If the login is successful, generate a token
    const token = jwt.sign(
      { nurseryId: nursery.nurseryId, email: nursery.email }, // Payload (use unique identifiers like nurseryId and email)
      process.env.JWT_SECRET_KEY,  // Secret key (store this in .env for security)
      { expiresIn: '1h' }  // Set expiration for the token (1 hour in this case)
    );

    // Respond with success and the token
    return res.status(200).json({
      message: 'Login successful',
      success: true,
      token,  // Send the token to the client
    });
    
  } catch (error) {
    return res.status(500).json({
      message: 'Server error',
      success: false,
      error: error.message,
    });
  }
};

    const isPasswordValid = await bcrypt.compare(password, nursery.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid password',
        success: false,
      });
    }

    // Generate a token using the nurseryId
    const token = jwt.sign({ nurseryId: nursery._id }, JWT_SECRET, { expiresIn: '1h' });
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

module.exports = { loginNursery, createNursery, getNurseryProfile, editNurseryProfile };
