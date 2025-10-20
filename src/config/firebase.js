const admin = require("firebase-admin");
require("dotenv").config();

// 🔍 debug logs


if (!admin.apps.length) {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
    : undefined;

  if (!privateKey) {
    console.error("❌ FIREBASE_PRIVATE_KEY is missing");
    throw new Error("Missing FIREBASE_PRIVATE_KEY in environment");
  }

  const firebaseConfig = {
    type: "service_account",
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key: privateKey,
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
  };

  admin.initializeApp({
    credential: admin.credential.cert(firebaseConfig),
  });
}

const db = admin.firestore();
module.exports = { db, admin };
