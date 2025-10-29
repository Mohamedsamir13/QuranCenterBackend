// src/routes/authRoutes.js
const express = require('express');
const { register, login } = require('../controllers/authController');

// استدعاء الـ middlewares
const { loginLimiterByEmail } = require('../middleWares/rateLimiter');
const { verifyToken } = require('../middleWares/authMiddleware');

const router = express.Router();

// 🧱 تسجيل مستخدم جديد (مش محتاج middleware)
router.post('/register', register);

// 🧱 تسجيل دخول — نحط limiter هنا فقط
router.post('/login', loginLimiterByEmail, login);

// 🧱 مثال لمسار محمي يتأكد من صلاحية الـ token
router.get('/profile', verifyToken, (req, res) => {
  res.status(200).json({
    message: '✅ Token is valid',
    user: req.user, // جاي من الـ authMiddleware
  });
});

module.exports = router;
