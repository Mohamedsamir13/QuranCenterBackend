// src/services/authService.js
const { admin, db } = require('../config/firebase');
const User = require('../models/userModel');

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

  // Store extended profile in Firestore
  const userData = new User({
    id: userRecord.uid,
    name,
    email,
    type,
    createdAt: new Date().toISOString(),
  });

  await db.collection('users').doc(userRecord.uid).set({ ...userData });

  console.log(`✅ User registered: ${email}`);
  return userData;
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

module.exports = { register, verifyFirebaseToken };
