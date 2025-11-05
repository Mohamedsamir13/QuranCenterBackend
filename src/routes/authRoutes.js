const express = require('express');
const { register, login } = require('../controllers/authController');

// middlewares
const { loginLimiterByEmail } = require('../middleWares/rateLimiter');
const { verifyToken } = require('../middleWares/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', loginLimiterByEmail, login);

router.get('/profile', verifyToken, (req, res) => {
  res.status(200).json({
    message: '✅ Token is valid',
    user: req.user,
  });
});

module.exports = router;
