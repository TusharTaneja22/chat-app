// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBNpqLBCD7WY_DMgnWFH5nX3MdgroVS9VM",
  authDomain: "chat-app-d49ce.firebaseapp.com",
  projectId: "chat-app-d49ce",
  storageBucket: "chat-app-d49ce.appspot.com",
  messagingSenderId: "351781582353",
  appId: "1:351781582353:web:22fd1cc527fb2534ce63b0",
  measurementId: "G-9DTP97RSKL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);