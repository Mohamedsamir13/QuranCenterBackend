// config/firebase.js
const admin = require("firebase-admin");
require("dotenv").config();

// 🪵 Debug start
console.log("🔥 Firebase config initializing...");

try {
  if (!admin.apps.length) {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY
      ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
      : undefined;
console.log("🧩 Private key sample:", privateKey.substring(0, 40));

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

    // 🪵 Show environment details (not the full key)
    console.log("📦 FIREBASE_PROJECT_ID:", firebaseConfig.project_id);
    console.log("👤 FIREBASE_CLIENT_EMAIL:", firebaseConfig.client_email);

    admin.initializeApp({
      credential: admin.credential.cert(firebaseConfig),
    });

    console.log("✅ Firebase Admin initialized successfully");
  }

  const db = admin.firestore();

  // 🔍 Test Firestore connection
  (async () => {
    try {
      await db.listCollections();
      console.log("✅ Firestore connected and collections accessible");
    } catch (err) {
      console.error("🔥 Firestore connection test failed:", err.code, err.message);
    }
  })();

  module.exports = { db, admin };
} catch (error) {
  console.error("❌ Firebase init error:", error.message);
  throw error;
}
