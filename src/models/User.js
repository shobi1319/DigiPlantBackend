const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: { type: String, unique: true }, // Ensure userId is unique
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  profileImage: { type: String }, // URL to the profile image stored on Vercel Blob
});

// Create the User model based on the schema
const User = mongoose.model('User', userSchema);

// Export the User model
module.exports = User;
