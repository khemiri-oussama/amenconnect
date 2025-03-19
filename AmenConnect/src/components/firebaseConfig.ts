import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyD0qjnrDLjAs0BGQavFuvV7zQhgJ6ijos0",
  authDomain: "kiosk-b8f76.firebaseapp.com",
  databaseURL: "https://kiosk-b8f76-default-rtdb.firebaseio.com",
  projectId: "kiosk-b8f76",
  storageBucket: "kiosk-b8f76.firebasestorage.app",
  messagingSenderId: "778513479530",
  appId: "1:778513479530:web:14754cb9e1f908d0a79713",
  measurementId: "G-KVKTSYT6E3"
};

// Initialize Firebase only if it's not already initialized
let firebaseApp: FirebaseApp;
if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApps()[0]; // Use the existing initialized app
}

const database = getDatabase(firebaseApp);

export { firebaseApp, database };
