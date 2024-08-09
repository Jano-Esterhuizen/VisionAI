// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
    apiKey: "AIzaSyCZ7sJlzQ7NwBgOHAobX6pYlSt5vfvtwZY",
    authDomain: "visionaryai-e691e.firebaseapp.com",
    projectId: "visionaryai-e691e",
    storageBucket: "visionaryai-e691e.appspot.com",
    messagingSenderId: "78363851477",
    appId: "1:78363851477:web:a258cbe28a4d0e81c0405c",
    measurementId: "G-GQX9618QJ6"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };