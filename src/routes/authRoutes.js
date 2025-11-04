// src/routes/authRoutes.js
const express = require('express');
const { register, login } = require('../controllers/authController');
const { verifyToken } = require('../middleWares/authMiddleware');
const { loginLimiterByEmail } = require('../middleWares/rateLimiter');

const router = express.Router();

// 🧱 Register new user
router.post('/register', register);

// 🧱 Login with rate limiting
router.post('/login', loginLimiterByEmail, login);

// 🧱 Get user profile (protected route)
router.get('/profile', verifyToken, (req, res) => {
  res.status(200).json({
    message: '✅ Token is valid',
    user: req.user, // Comes from authMiddleware
  });
});

module.exports = router;
