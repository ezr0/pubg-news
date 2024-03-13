// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCK8zxeOtUyg7HI3N61Ec0OqDbAuPSU2hk",
    authDomain: "pubg-news-baef8.firebaseapp.com",
    projectId: "pubg-news-baef8",
    storageBucket: "pubg-news-baef8.appspot.com",
    messagingSenderId: "543836862738",
    appId: "1:543836862738:web:7cdead0670207a4f115bcb",
    measurementId: "G-FXKRY41ERE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);