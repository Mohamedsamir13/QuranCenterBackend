// src/controllers/authController.js
const authService = require('../services/authService');

/**
 * 🧱 Register Controller (uses Firebase Auth)
 */
const register = async (req, res) => {
  try {
    const { name, email, password, type } = req.body;
    
    // Validate required fields
    if (!name || !email || !password || !type) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const user = await authService.register({ name, email, password, type });

    res.status(201).json({
      message: 'User registered successfully',
      user,
    });
  } catch (error) {
    console.error('Register error:', error.message);
    res.status(400).json({ message: error.message });
  }
};

/**
 * 🧱 Login Controller
 * Basic email and password login
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const result = await authService.loginWithEmailPassword({ email, password });
    res.status(200).json({
      message: 'Login successful',
      token: result.token,
      user: result.user,
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(401).json({ message: error.message });
  }
};

module.exports = { register, login };
