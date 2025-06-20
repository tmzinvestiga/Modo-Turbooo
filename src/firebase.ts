// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDS5trGnp4xdIhJoeyCRh6FOCs79bKXvQ0",
  authDomain: "modo-turbo-a0739.firebaseapp.com",
  projectId: "modo-turbo-a0739",
  storageBucket: "modo-turbo-a0739.firebasestorage.app",
  messagingSenderId: "339613445345",
  appId: "1:339613445345:web:96292786ed30cb8d121ba0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);