// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: "pubg-news-baef8.firebaseapp.com",
    projectId: "pubg-news-baef8",
    storageBucket: "pubg-news-baef8.appspot.com",
    messagingSenderId: "543836862738",
    appId: "1:543836862738:web:7cdead0670207a4f115bcb",
    measurementId: "G-FXKRY41ERE"
};

//* Initialize Firebase
initializeApp(firebaseConfig);