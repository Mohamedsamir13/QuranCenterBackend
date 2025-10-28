const authService = require('../services/authService');

const register = async (req, res) => {
  try {
    const { name, email, password, type } = req.body;

    if (!['Parent', 'Teacher', 'Manager', 'Student'].includes(type)) {
      return res.status(400).json({ message: 'Invalid user type' });
    }

    const user = await authService.register({ name, email, password, type });
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    console.error('Register error:', error.message);
    res.status(400).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login({ email, password });
    res.status(200).json(result);
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(400).json({ message: error.message });
  }
};

module.exports = { register, login };
