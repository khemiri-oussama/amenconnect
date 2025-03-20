// firebaseAdmin.js
const admin = require('firebase-admin');
const serviceAccount = require('../../firebaseadminsdk.json'); // Update with the correct path

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://kiosk-b8f76-default-rtdb.firebaseio.com" // Your database URL from your firebaseConfig
  });
}

module.exports = admin;
