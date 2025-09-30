// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDhbBncrHLik-GEePuHjF-JxfU0rhAXrc8",
    authDomain: "test-skills-9e54a.firebaseapp.com",
    projectId: "test-skills-9e54a",
    storageBucket: "test-skills-9e54a.firebasestorage.app",
    messagingSenderId: "99293841209",
    appId: "1:99293841209:web:c767c3f65a5e593f2f8ae8",
    measurementId: "G-8CJG73WKMB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
