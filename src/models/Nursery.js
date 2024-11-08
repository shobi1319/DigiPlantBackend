// models/Nursery.js
const mongoose = require('mongoose');

const NurserySchema = new mongoose.Schema({
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
