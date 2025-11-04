// src/middleWares/authMiddleware.js
const { admin, db } = require('../config/firebase');

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized: Missing token' });
    }

    const idToken = authHeader.split('Bearer ')[1].trim();

    // ✅ Verify Firebase token using Admin SDK
    const decoded = await admin.auth().verifyIdToken(idToken);

    // ✅ Optionally, get user profile from Firestore
    const userDoc = await db.collection('users').doc(decoded.uid).get();
    if (!userDoc.exists) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    req.user = userDoc.data();
    next();
  } catch (err) {
    console.error('❌ Token verification error:', err.message);
    return res.status(401).json({ message: 'Invalid or expired Firebase token' });
  }
};

module.exports = { verifyToken };
