const { admin, db } = require('../config/firebase');
const User = require('../models/userModel');

/**
 * 🔹 Register user using Firebase Auth
 */
const register = async ({ name, email, password, type }) => {
  // Validate type
  if (!['Parent', 'Teacher', 'Manager', 'Student'].includes(type)) {
    throw new Error('Invalid user type');
  }

  // Create user in Firebase Authentication
  const userRecord = await admin.auth().createUser({
    email,
    password,
    displayName: name,
  });

  // Save user data in Firestore (extra info)
  const userData = {
    id: userRecord.uid,
    name,
    email,
    type,
    createdAt: new Date().toISOString(),
  };
  await db.collection('users').doc(userRecord.uid).set(userData);

  return userData;
};

/**
 * 🔹 Login user with Firebase Auth (on client, not here)
 * 🔹 This backend verifies Firebase ID Token
 */
const verifyFirebaseToken = async (token) => {
  try {
    const decoded = await admin.auth().verifyIdToken(token);

    // Fetch extra profile data from Firestore
    const userDoc = await db.collection('users').doc(decoded.uid).get();
    if (!userDoc.exists) {
      throw new Error('User profile not found in Firestore');
    }

    return { auth: decoded, profile: userDoc.data() };
  } catch (error) {
    throw new Error('Invalid or expired Firebase token');
  }
};

module.exports = { register, verifyFirebaseToken };
