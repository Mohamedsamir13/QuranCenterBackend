const express = require('express');
const { register, verifyToken } = require('../controllers/authController');

const router = express.Router();

// 🧱 Register new user (Firebase Auth + Firestore)
router.post('/register', register);

// 🧱 Verify Firebase ID token (from client)
router.get('/profile', verifyToken);

module.exports = router;
