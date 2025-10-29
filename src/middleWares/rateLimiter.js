// src/middleWares/rateLimiter.js
const rateLimit = require('express-rate-limit');
const { ipKeyGenerator } = require('express-rate-limit'); // ✅ عشان IPv6

// 🔹 login limiter
const loginLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 ساعة
  max: 5,
  message: { message: 'Too many login attempts. Try again after an hour.' },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true
});

// 🔹 login limiter by email
const loginLimiterByEmail = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 7,
  keyGenerator: (req) => {
    return (req.body && req.body.email)
      ? req.body.email
      : ipKeyGenerator(req); // ✅ دعم IPv6
  },
  message: { message: 'Too many login attempts for this email. Try again after an hour.' },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true
});

// 🔹 getAll limiter
const getAllLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 دقيقة
  max: 20, // 20 طلب في الدقيقة من نفس IP
  message: { message: 'Too many requests. Please slow down.' },
  standardHeaders: true,
  legacyHeaders: false
});

// ✅ التصدير الصحيح — كلهم مرة واحدة فقط
module.exports = { loginLimiter, loginLimiterByEmail, getAllLimiter };
