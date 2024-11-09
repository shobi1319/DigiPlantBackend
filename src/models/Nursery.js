const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');  // For generating unique IDs

const NurserySchema = new mongoose.Schema({
  nurseryId: {
    type: String,
    unique: true,
    default: () => uuidv4(),  // Generates a unique nurseryId using UUID
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,  // You can adjust this based on your password policy
  },
  nurseryName: {
    type: String,
    required: true,
    trim: true,
  },
  ownerName: {
    type: String,
    required: true,
    trim: true,
  },
  nurseryDescription: {
    type: String,
    trim: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true,
  },
});

module.exports = mongoose.model('Nursery', NurserySchema);
