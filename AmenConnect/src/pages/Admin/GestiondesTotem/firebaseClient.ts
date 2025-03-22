import { initializeApp, FirebaseApp } from "firebase/app";
import { getDatabase, Database } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyD0qjnrDLjAs0BGQavFuvV7zQhgJ6ijos0",
  authDomain: "kiosk-b8f76.firebaseapp.com",
  databaseURL: "https://kiosk-b8f76-default-rtdb.firebaseio.com",
  storageBucket: "kiosk-b8f76.firebasestorage.app",
};

const app: FirebaseApp = initializeApp(firebaseConfig);
const database: Database = getDatabase(app);

export { database };
