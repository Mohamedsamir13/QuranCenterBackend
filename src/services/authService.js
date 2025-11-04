// src/services/authService.js
const { admin, db } = require('../config/firebase');
const User = require('../models/userModel');
const userRepo = require('../repositories/userRepo');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * 🔹 Register a user with Firebase Admin SDK & Firestore
 */
const register = async ({ name, email, password, type }) => {
  if (!['Parent', 'Teacher', 'Manager', 'Student'].includes(type)) {
    throw new Error('Invalid user type');
  }

  // Create Firebase Auth user
  const userRecord = await admin.auth().createUser({
    email,
    password,
    displayName: name,
  });

  // Hash password before storing
  const hashedPassword = await bcrypt.hash(password, 10);

  // Store extended profile in Firestore
  const userData = new User({
    id: userRecord.uid,
    name,
    email,
    password: hashedPassword,
    type,
    createdAt: new Date().toISOString(),
  });

  await db.collection('users').doc(userRecord.uid).set({ ...userData });

  console.log(`✅ User registered: ${email}`);
  return userData;
};

/**
 * 🔹 Simple login - get user from Firestore and verify password
 */
const loginWithEmailPassword = async ({ email, password }) => {
  // Find user by email
  const user = await userRepo.findByEmail(email);
  if (!user) {
    throw new Error('Invalid email or password');
  }

  // Verify password
  if (user.password) {
    // If password is hashed, use bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }
  } else {
    // If no password stored, check Firebase Auth (fallback)
    try {
      const userRecord = await admin.auth().getUserByEmail(email);
      // Can't verify password with Admin SDK, so we'll need to store it
      throw new Error('Password verification not available');
    } catch (error) {
      throw new Error('Invalid email or password');
    }
  }

  // Remove password from response
  const userData = { ...user };
  delete userData.password;
  
  // Sign JWT token with user details
  const jwtSecret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
  const token = jwt.sign(
    {
      id: userData.id,
      email: userData.email,
      type: userData.type,
    },
    jwtSecret,
    { expiresIn: '7d' } // Token expires in 7 days
  );
  
  console.log(`✅ User logged in: ${email}`);
  return {
    token,
    user: userData,
  };
};

/**
 * 🔹 Verify Firebase ID Token (client handles login)
 */
const verifyFirebaseToken = async (token) => {
  try {
    console.log('🪪 Received Token:', token.substring(0, 30) + '...');
    const decoded = await admin.auth().verifyIdToken(token);
    console.log('✅ Decoded Token UID:', decoded.uid);

    // Fetch Firestore profile
    const userDoc = await db.collection('users').doc(decoded.uid).get();
    if (!userDoc.exists) throw new Error('User profile not found in Firestore');

    // Return combined data
    return {
      auth: decoded,
      profile: userDoc.data(),
    };
  } catch (error) {
    console.error('❌ Firebase Token Verification Failed:', error);
    throw new Error('Invalid or expired Firebase token');
  }
};

module.exports = { register, loginWithEmailPassword, verifyFirebaseToken };
