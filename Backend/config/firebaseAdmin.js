// firebaseAdmin.js
const admin = require('firebase-admin');
const serviceAccount = require('./kiosk-b8f76-firebase-adminsdk-fbsvc-aa64e250f6.json'); // Update with the correct path

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://kiosk-b8f76-default-rtdb.firebaseio.com" // Your database URL from your firebaseConfig
  });
}

module.exports = admin;
