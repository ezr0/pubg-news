import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

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
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;