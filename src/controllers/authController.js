const authService = require('../services/authService');

/**
 * 🧱 Register Controller (uses Firebase Auth)
 */
const register = async (req, res) => {
  try {
    const { name, email, password, type } = req.body;
    const user = await authService.register({ name, email, password, type });
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    console.error('Register error:', error.message);
    res.status(400).json({ message: error.message });
  }
};

/**
 * 🧱 Verify Token Controller
 * Client sends Firebase ID Token -> verify with Admin SDK
 */
const verifyToken = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Missing Firebase token' });
    }

    const idToken = authHeader.split('Bearer ')[1];
    const userData = await authService.verifyFirebaseToken(idToken);
    res.status(200).json({
      message: 'Token verified successfully',
      user: userData.profile,
    });
  } catch (error) {
    console.error('Verify token error:', error.message);
    res.status(401).json({ message: error.message });
  }
};

module.exports = { register, verifyToken };
