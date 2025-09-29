// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "********************************",
  authDomain: "mywebapp-2cb0a.firebaseapp.com",
  databaseURL: "https://mywebapp-2cb0a-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "mywebapp-2cb0a",
  storageBucket: "mywebapp-2cb0a.firebasestorage.app",
  messagingSenderId: "201241449535",
  appId: "1:201241449535:web:b5ee454fa8cc6a8e36d48a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Realtime Database and get a reference to the service
export const database = getDatabase(app);

export default app;
