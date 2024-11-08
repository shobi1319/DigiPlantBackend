// routes/nurseryRoutes.js
const express = require('express');
const { getNurseryProfile, createNursery, loginNursery, editNurseryProfile } = require('../controllers/nurseryController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Fetch nursery profile
router.get('/profile', authMiddleware, getNurseryProfile);

// Register new nursery
router.post('/register', createNursery);

// Login for nursery
router.post('/login', loginNursery);

// Edit nursery profile
router.put('/edit-profile', authMiddleware, editNurseryProfile);

module.exports = router;
