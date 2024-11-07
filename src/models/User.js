const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: { type: String, unique: true }, // Ensure userId is unique
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
});

// Create the User model based on the schema
const User = mongoose.model('User', userSchema);

// Export the User model
module.exports = User;
