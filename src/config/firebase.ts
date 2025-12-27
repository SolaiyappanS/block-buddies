import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC5k0oqkZcK093yJCAMKYYmEkLwfE2nTQQ",
  authDomain: "block-buddies-3cb0b.firebaseapp.com",
  projectId: "block-buddies-3cb0b",
  databaseURL: "https://block-buddies-3cb0b-default-rtdb.firebaseio.com",
  storageBucket: "block-buddies-3cb0b.firebasestorage.app",
  messagingSenderId: "722527122900",
  appId: "1:722527122900:web:cece745bd245c5aef29241",
  measurementId: "G-EWNCSBQS8H",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Realtime Database
export const database = getDatabase(app);

export default app;
