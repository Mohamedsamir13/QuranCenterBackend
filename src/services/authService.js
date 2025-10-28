const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { admin } = require('../config/firebase');
const userRepo = require('../repositories/userRepo');
require('dotenv').config();

// 🔹 Register new user
const register = async ({ name, email, password, type }) => {
  const existing = await userRepo.findByEmail(email);
  if (existing) throw new Error('User already exists');

  // Create Firebase user
  const userRecord = await admin.auth().createUser({
    email,
    password,
    displayName: name,
  });

  // Save to Firestore
  const newUser = await userRepo.createUser({
    id: userRecord.uid,
    name,
    email,
    type,
  });

  return newUser;
};

// 🔹 Login user
const login = async ({ email, password }) => {
  const user = await userRepo.findByEmail(email);
  if (!user) throw new Error('User not found');

  // (Optional: if storing hashed passwords in Firestore)
  // const isMatch = await bcrypt.compare(password, user.password);
  // if (!isMatch) throw new Error('Invalid credentials');

  const token = jwt.sign(
    { id: user.id, email: user.email, type: user.type },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  return { user, token };
};

// 🔹 Verify JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw new Error('Invalid token');
  }
};

module.exports = { register, login, verifyToken };
