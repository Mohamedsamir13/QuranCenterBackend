const { db } = require('../config/firebase');
const User = require('../models/userModel');

const findById = async (uid) => {
  const doc = await db.collection('users').doc(uid).get();
  if (!doc.exists) return null;
  return new User({ id: doc.id, ...doc.data() });
};

module.exports = { findById };
