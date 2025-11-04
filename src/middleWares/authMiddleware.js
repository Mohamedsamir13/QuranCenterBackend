// src/middleWares/authMiddleware.js
const authService = require('../services/authService');

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized: Missing token' });
    }

    const token = authHeader.split('Bearer ')[1].trim();

    // ✅ Verify JWT token
    const user = await authService.verifyToken(token);

    // Attach user to request object
    req.user = user;
    next();
  } catch (err) {
    console.error('❌ Token verification error:', err.message);
    return res.status(401).json({ message: err.message || 'Invalid or expired token' });
  }
};

module.exports = { verifyToken };
