// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAufCw5uhLXNgowmyvsVGVbMtyHARzWiGY",
    authDomain: "chat-2699c.firebaseapp.com",
    projectId: "chat-2699c",
    storageBucket: "chat-2699c.appspot.com",
    messagingSenderId: "459039206529",
    appId: "1:459039206529:web:1957b529c82f36aebcf180"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();