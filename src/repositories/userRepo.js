// src/repositories/userRepo.js
const { db } = require("../config/firebase");
const User = require("../models/userModel");

const findById = async (uid) => {
  const doc = await db.collection("users").doc(uid).get();
  if (!doc.exists) return null;
  return new User({ id: doc.id, ...doc.data() });
};

const findByEmail = async (email) => {
  const snapshot = await db
    .collection("users")
    .where("email", "==", email)
    .limit(1)
    .get();
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return new User({ id: doc.id, ...doc.data() });
};
const findAll = async () => {
  const snapshot = await db.collection("users").get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

module.exports = { findById, findByEmail, findAll };
