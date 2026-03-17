const admin = require("firebase-admin");

let serviceAccount;

try {
  let accountData = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (accountData) {
    // Robust parsing: Handle cases where the string might start with the variable name or be wrapped in quotes
    accountData = accountData.trim();
    if (accountData.startsWith('FIREBASE_SERVICE_ACCOUNT=')) {
      accountData = accountData.substring('FIREBASE_SERVICE_ACCOUNT='.length).trim();
    }
    // Remove wrapping single/double quotes if they exist
    if ((accountData.startsWith("'") && accountData.endsWith("'")) || 
        (accountData.startsWith('"') && accountData.endsWith('"'))) {
      accountData = accountData.substring(1, accountData.length - 1).trim();
    }
    serviceAccount = JSON.parse(accountData);
  } else {
    throw new Error("FIREBASE_SERVICE_ACCOUNT environment variable missing");
  }
} catch (error) {
  console.error("Firebase config error:", error);
  process.exit(1);
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

module.exports = { admin, db };