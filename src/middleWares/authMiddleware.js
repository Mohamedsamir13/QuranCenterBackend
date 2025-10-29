// src/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const userRepo = require('../repositories/userRepo');
require('dotenv').config();

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized: Missing token' });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }

    // Optional: check user still exists in DB
    const user = await userRepo.findByEmail(decoded.email);
    if (!user) return res.status(401).json({ message: 'User no longer exists' });

    // Optional: token revocation check (tokenVersion pattern)
    // If you store tokenVersion in user doc, e.g. user.tokenVersion
    // if (user.tokenVersion && decoded.tokenVersion !== user.tokenVersion) {
    //   return res.status(401).json({ message: 'Token revoked' });
    // }

    // Attach user info to request for controllers
    req.user = { id: decoded.id, email: decoded.email, type: decoded.type };
    next();
  } catch (err) {
    console.error('authMiddleware error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { verifyToken };
