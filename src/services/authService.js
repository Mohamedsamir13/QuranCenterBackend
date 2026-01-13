// src/services/authService.js
const { admin, db } = require("../config/firebase");
const User = require("../models/userModel");
const userRepo = require("../repositories/userRepo");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * 🔹 Register a user with Firebase Admin SDK & Firestore
 */

const register = async ({ name, email, password, type }) => {
  // if (type === "Manager") {
  //   throw new Error("Registering as Manager is not allowed");
  // }

  if (!["Parent", "Teacher", "Student"].includes(type)) {
    throw new Error("Invalid user type");
  }

  // Create Firebase Auth user
  const userRecord = await admin.auth().createUser({
    email,
    password,
    displayName: name,
  });

  // Hash password before storing in Firestore
  const hashedPassword = await bcrypt.hash(password, 10);

  // Prepare user data
  const userData = new User({
    id: userRecord.uid,
    name,
    email,
    password: hashedPassword,
    type,
    createdAt: new Date().toISOString(),
  });

  // ✅ Save all fields explicitly (to ensure password is stored)
  await db.collection("users").doc(userRecord.uid).set({
    id: userRecord.uid,
    name,
    email,
    password: hashedPassword,
    type,
    createdAt: new Date().toISOString(),
  });

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
    throw new Error("Invalid email or password");
  }

  // Verify password
  if (user.password) {
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }
  } else {
    // No password stored in Firestore
    throw new Error("Password not found. Please re-register your account.");
  }

  // Remove password from the returned user data
  const userData = { ...user };
  delete userData.password;

  // Sign JWT token
  const jwtSecret =
    process.env.JWT_SECRET || "your-secret-key-change-in-production";
  const token = jwt.sign(
    {
      id: userData.id,
      email: userData.email,
      type: userData.type,
    },
    jwtSecret,
    { expiresIn: "7d" }
  );

  console.log(`✅ User logged in: ${email}`);
  return {
    token,
    user: userData,
  };
};

/**
 * 🔹 Get all users (بدون password)
 */
const getAllUsers = async () => {
  const users = await userRepo.findAll();
  return users.map((u) => {
    const clean = { ...u };
    delete clean.password;
    return clean;
  });
};

/**
 * 🔹 Get single user by ID (بدون password)
 */
const getUserById = async (id) => {
  const user = await userRepo.findById(id);
  if (!user) return null;

  const clean = { ...user };
  delete clean.password;
  return clean;
};

/**
 * 🔹 Verify Firebase ID Token (client handles login)
 */
const verifyFirebaseToken = async (token) => {
  try {
    console.log("🪪 Received Token:", token.substring(0, 30) + "...");
    const decoded = await admin.auth().verifyIdToken(token);
    console.log("✅ Decoded Token UID:", decoded.uid);

    // Fetch Firestore profile
    const userDoc = await db.collection("users").doc(decoded.uid).get();
    if (!userDoc.exists) throw new Error("User profile not found in Firestore");

    // Return combined data
    return {
      auth: decoded,
      profile: userDoc.data(),
    };
  } catch (error) {
    console.error("❌ Firebase Token Verification Failed:", error);
    throw new Error("Invalid or expired Firebase token");
  }
};

module.exports = {
  register,
  loginWithEmailPassword,
  verifyFirebaseToken,
  getAllUsers, // 👈 مهم تضيفهم هنا
  getUserById, // 👈
};
