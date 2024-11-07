const express = require('express');
const { getUserProfile, createUser, loginUser,editUserProfile } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/profile', authMiddleware, getUserProfile);
router.post('/register', createUser);
router.post('/login', loginUser);
router.put('/edit-profile', authMiddleware, editUserProfile);

module.exports = router;
