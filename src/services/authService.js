const { db } = require('../config/firebase');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepo = require('../repositories/userRepo');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * 🔹 Register user with password hashing
 */
const register = async ({ name, email, password, type }) => {
  // Validate type
  if (!['Parent', 'Teacher', 'Manager', 'Student'].includes(type)) {
    throw new Error('Invalid user type');
  }

  // Check if user already exists
  const existingUser = await userRepo.findByEmail(email);
  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Generate a unique ID for the user
  const userId = db.collection('users').doc().id;

  // Save user data in Firestore
  const userData = {
    id: userId,
    name,
    email,
    password: hashedPassword, // Store hashed password
    type,
    createdAt: new Date().toISOString(),
  };
  await db.collection('users').doc(userId).set(userData);

  // Remove password from response
  const { password: _, ...userWithoutPassword } = userData;
  return userWithoutPassword;
};

/**
 * 🔹 Login user with email and password, returns JWT token
 */
const login = async ({ email, password }) => {
  // Find user by email
  const user = await userRepo.findByEmail(email);
  if (!user) {
    throw new Error('Invalid email or password');
  }

  // Get user data from Firestore to access password
  const userDoc = await db.collection('users').doc(user.id).get();
  const userData = userDoc.data();

  if (!userData.password) {
    throw new Error('User account not properly configured');
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, userData.password);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  // Generate JWT token
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      type: user.type,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  // Remove password from user data
  const { password: _, ...userWithoutPassword } = userData;

  return {
    token,
    user: userWithoutPassword,
  };
};

/**
 * 🔹 Verify JWT token
 */
const verifyToken = async (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Fetch user data from Firestore
    const userDoc = await db.collection('users').doc(decoded.id).get();
    if (!userDoc.exists) {
      throw new Error('User not found');
    }

    const userData = userDoc.data();
    const { password: _, ...userWithoutPassword } = userData;

    return userWithoutPassword;
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token');
    }
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token expired');
    }
    throw new Error('Token verification failed');
  }
};

module.exports = { register, login, verifyToken };
