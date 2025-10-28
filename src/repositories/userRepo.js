const { db } = require('../config/firebase');
const User = require('../models/userModel');

const userCollection = db.collection('users');

const createUser = async (userData) => {
  const userRef = userCollection.doc();
  const user = new User({ id: userRef.id, ...userData });
  await userRef.set({ ...user });
  return user;
};

const findByEmail = async (email) => {
  const snapshot = await userCollection.where('email', '==', email).get();
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return new User({ id: doc.id, ...doc.data() });
};

module.exports = { createUser, findByEmail };
